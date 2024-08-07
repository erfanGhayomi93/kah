import { useInstantDepositReports } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useLayoutEffect, useMemo } from 'react';
import InstantDepositReportsTable from './InstantDepositReportsTable';

interface TableProps {
	filters: InstantDepositReports.IInstantDepositReportsFilters;
	setFilters: <K extends keyof InstantDepositReports.IInstantDepositReportsFilters>(
		name: K,
		value: InstantDepositReports.IInstantDepositReportsFilters[K],
	) => void;
	setFieldsValue: (props: Partial<InstantDepositReports.IInstantDepositReportsFilters>) => void;
	columnsVisibility: InstantDepositReports.TInstantDepositReportsColumnsState[];
}

const Table = ({ filters, setFilters, columnsVisibility, setFieldsValue }: TableProps) => {
	const brokerUrls = useAppSelector(getBrokerURLs);

	const { data: instantDepositReportsData, isLoading } = useInstantDepositReports({
		queryKey: ['instantDepositReports', filters],
		enabled: Boolean(brokerUrls),
	});

	const onFiltersChanged = (
		newFilters: Omit<InstantDepositReports.IInstantDepositReportsFilters, 'pageNumber' | 'pageSize'>,
	) => {
		setFieldsValue(newFilters);
	};

	useLayoutEffect(() => {
		ipcMain.handle('set_instant_deposit_reports_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_instant_deposit_reports_filters');
		};
	}, []);

	const reports = useMemo(() => {
		if (!instantDepositReportsData?.result) return [];

		return instantDepositReportsData?.result;
	}, [instantDepositReportsData?.result]);

	const dataIsEmpty = reports.length === 0;

	return (
		<div className='relative flex-1 gap-16 overflow-hidden flex-column'>
			<InstantDepositReportsTable columnsVisibility={columnsVisibility} reports={reports} />

			<div className='border-t border-t-gray-200 py-16 flex-justify-end'>
				<Pagination
					hasNextPage={instantDepositReportsData?.hasNextPage ?? false}
					hasPreviousPage={instantDepositReportsData?.hasPreviousPage ?? false}
					totalPages={instantDepositReportsData?.totalPages ?? 0}
					totalCount={instantDepositReportsData?.totalCount ?? 0}
					currentPage={filters?.pageNumber ?? 1}
					pageSize={filters?.pageSize ?? 0}
					onPageChange={(value) => setFilters('pageNumber', value)}
					onPageSizeChange={(value) => setFilters('pageSize', value)}
					pageNumber={instantDepositReportsData?.pageNumber ?? 0}
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
