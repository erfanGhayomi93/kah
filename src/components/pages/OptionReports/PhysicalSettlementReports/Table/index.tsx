import { usePhysicalSettlementReportsQuery } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { useLayoutEffect, useMemo } from 'react';
import PhysicalSettlementReportsTable from './PhysicalSettlementReportsTable';

interface TableProps {
	filters: PhysicalSettlementReports.IPhysicalSettlementReportsFilters;
	setFilters: <K extends keyof PhysicalSettlementReports.IPhysicalSettlementReportsFilters>(
		name: K,
		value: PhysicalSettlementReports.IPhysicalSettlementReportsFilters[K],
	) => void;
	setFieldsValue: (props: Partial<PhysicalSettlementReports.IPhysicalSettlementReportsFilters>) => void;
	columnsVisibility: PhysicalSettlementReports.IPhysicalSettlementReportsColumnsState[];
}

const Table = ({ filters, setFilters, setFieldsValue, columnsVisibility }: TableProps) => {
	const { data: physicalSettlementReportsData, isLoading } = usePhysicalSettlementReportsQuery({
		queryKey: ['physicalSettlementReports', filters],
	});

	const onFiltersChanged = (
		newFilters: Omit<PhysicalSettlementReports.IPhysicalSettlementReportsFilters, 'pageNumber' | 'pageSize'>,
	) => {
		setFieldsValue(newFilters);
	};

	useLayoutEffect(() => {
		ipcMain.handle('set_physical_settlement_reports_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_physical_settlement_reports_filters');
		};
	}, []);

	const reports = useMemo(() => {
		if (!physicalSettlementReportsData?.result) return [];

		return physicalSettlementReportsData?.result;
	}, [physicalSettlementReportsData?.result]);

	const dataIsEmpty = reports.length === 0;

	return (
		<div className='relative flex-1 gap-16 overflow-hidden flex-column'>
			<PhysicalSettlementReportsTable columnsVisibility={columnsVisibility} reports={reports} />

			<div className='border-t border-t-gray-200 py-16 flex-justify-end'>
				<Pagination
					hasNextPage={physicalSettlementReportsData?.hasNextPage ?? false}
					hasPreviousPage={physicalSettlementReportsData?.hasPreviousPage ?? false}
					totalPages={physicalSettlementReportsData?.totalPages ?? 0}
					totalCount={physicalSettlementReportsData?.totalCount ?? 0}
					currentPage={filters?.pageNumber ?? 1}
					pageSize={filters?.pageSize ?? 0}
					onPageChange={(value) => setFilters('pageNumber', value)}
					onPageSizeChange={(value) => setFilters('pageSize', value)}
					pageNumber={physicalSettlementReportsData?.pageNumber ?? 0}
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
