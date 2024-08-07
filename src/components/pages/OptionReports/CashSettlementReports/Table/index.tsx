import { useCashSettlementReportsQuery } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { useLayoutEffect, useMemo } from 'react';
import CashSettlementReportsTable from './CashSettlementReportsTable';

interface TableProps {
	filters: CashSettlementReports.ICashSettlementReportsFilters;
	setFilters: <K extends keyof CashSettlementReports.ICashSettlementReportsFilters>(
		name: K,
		value: CashSettlementReports.ICashSettlementReportsFilters[K],
	) => void;
	setFieldsValue: (props: Partial<CashSettlementReports.ICashSettlementReportsFilters>) => void;
	columnsVisibility: CashSettlementReports.ICashSettlementReportsColumnsState[];
}

const Table = ({ filters, setFilters, setFieldsValue, columnsVisibility }: TableProps) => {
	const { data: cashSettlementReportsData, isLoading } = useCashSettlementReportsQuery({
		queryKey: ['cashSettlementReports', filters],
	});

	const onFiltersChanged = (
		newFilters: Omit<CashSettlementReports.ICashSettlementReportsFilters, 'pageNumber' | 'pageSize'>,
	) => {
		setFieldsValue(newFilters);
	};

	useLayoutEffect(() => {
		ipcMain.handle('set_cash_settlement_reports_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_cash_settlement_reports_filters');
		};
	}, []);

	const reports = useMemo(() => {
		if (!cashSettlementReportsData?.result) return [];

		return cashSettlementReportsData?.result;
	}, [cashSettlementReportsData?.result]);

	const dataIsEmpty = reports.length === 0;

	return (
		<div className='relative flex-1 gap-16 overflow-hidden flex-column'>
			<CashSettlementReportsTable columnsVisibility={columnsVisibility} reports={reports} />

			<div className='border-t border-t-gray-200 py-16 flex-justify-end'>
				<Pagination
					hasNextPage={cashSettlementReportsData?.hasNextPage ?? false}
					hasPreviousPage={cashSettlementReportsData?.hasPreviousPage ?? false}
					totalPages={cashSettlementReportsData?.totalPages ?? 0}
					totalCount={cashSettlementReportsData?.totalCount ?? 0}
					currentPage={filters?.pageNumber ?? 1}
					pageSize={filters?.pageSize ?? 0}
					onPageChange={(value) => setFilters('pageNumber', value)}
					onPageSizeChange={(value) => setFilters('pageSize', value)}
					pageNumber={cashSettlementReportsData?.pageNumber ?? 0}
				/>
			</div>

			{isLoading && (
				<div style={{ backdropFilter: 'blur(1px)' }} className='absolute left-0 top-0 size-full'>
					<Loading />
				</div>
			)}
			{dataIsEmpty && !isLoading && (
				<div className='absolute center'>
					<NoData />
				</div>
			)}
		</div>
	);
};

export default Table;
