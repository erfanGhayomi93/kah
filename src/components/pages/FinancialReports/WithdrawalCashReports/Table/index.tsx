import { useWithdrawalCashReports } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useLayoutEffect, useMemo } from 'react';
import WithdrawalCashReportsTable from './WithdrawalCashReportsTable';

interface TableProps {
	filters: WithdrawalCashReports.WithdrawalCashReportsFilters;
	setFilters: <K extends keyof WithdrawalCashReports.WithdrawalCashReportsFilters>(
		name: K,
		value: WithdrawalCashReports.WithdrawalCashReportsFilters[K],
	) => void;
	setFieldsValue: (props: Partial<WithdrawalCashReports.WithdrawalCashReportsFilters>) => void;
	columnsVisibility: WithdrawalCashReports.TWithdrawalCashReportsColumnsState[];
}

const Table = ({ filters, setFilters, columnsVisibility, setFieldsValue }: TableProps) => {
	const brokerUrls = useAppSelector(getBrokerURLs);

	const { data: withdrawalCashReportsData, isLoading } = useWithdrawalCashReports({
		queryKey: ['withdrawalCashReports', filters],
		enabled: Boolean(brokerUrls),
	});

	const onFiltersChanged = (
		newFilters: Omit<WithdrawalCashReports.WithdrawalCashReportsFilters, 'pageNumber' | 'pageSize'>,
	) => {
		setFieldsValue(newFilters);
	};

	useLayoutEffect(() => {
		ipcMain.handle('set_withdrawal_cash_reports_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_withdrawal_cash_reports_filters');
		};
	}, []);

	const reports = useMemo(() => {
		if (!withdrawalCashReportsData?.result) return [];

		return withdrawalCashReportsData?.result;
	}, [withdrawalCashReportsData?.result]);

	const dataIsEmpty = reports.length === 0;

	return (
		<div className='relative flex-1 gap-16 overflow-hidden flex-column'>
			<WithdrawalCashReportsTable columnsVisibility={columnsVisibility} reports={reports} />

			<div className='border-t border-t-gray-200 py-16 flex-justify-end'>
				<Pagination
					hasNextPage={withdrawalCashReportsData?.hasNextPage ?? false}
					hasPreviousPage={withdrawalCashReportsData?.hasPreviousPage ?? false}
					totalPages={withdrawalCashReportsData?.totalPages ?? 0}
					totalCount={withdrawalCashReportsData?.totalCount ?? 0}
					currentPage={filters?.pageNumber ?? 1}
					pageSize={filters?.pageSize ?? 0}
					onPageChange={(value) => setFilters('pageNumber', value)}
					onPageSizeChange={(value) => setFilters('pageSize', value)}
					pageNumber={withdrawalCashReportsData?.pageNumber ?? 0}
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
