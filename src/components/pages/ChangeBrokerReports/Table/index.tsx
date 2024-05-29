import { useChangeBrokerReportsQuery } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { useLayoutEffect, useMemo } from 'react';
import ChangeBrokerReportsTable from './ChangeBrokerReportsTable';

interface TableProps {
	filters: ChangeBrokerReports.IChangeBrokerReportsFilters;
	setFilters: <K extends keyof ChangeBrokerReports.IChangeBrokerReportsFilters>(
		name: K,
		value: ChangeBrokerReports.IChangeBrokerReportsFilters[K],
	) => void;
	setFieldsValue: (props: Partial<Transaction.ITransactionsFilters>) => void;
	columnsVisibility: ChangeBrokerReports.IChangeBrokerReportsColumnsState[];
}

const Table = ({ filters, setFilters, setFieldsValue, columnsVisibility }: TableProps) => {
	const { data: changeBrokerReportsData, isLoading } = useChangeBrokerReportsQuery({
		queryKey: ['changeBrokerReports', filters],
	});

	const onFiltersChanged = (
		newFilters: Omit<ChangeBrokerReports.IChangeBrokerReportsFilters, 'pageNumber' | 'pageSize'>,
	) => {
		setFieldsValue(newFilters);
	};

	useLayoutEffect(() => {
		ipcMain.handle('set_changeBroker_reports_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_changeBroker_reports_filters');
		};
	}, []);

	const reports = useMemo(() => {
		if (!changeBrokerReportsData?.result) return [];

		return changeBrokerReportsData?.result;
	}, [changeBrokerReportsData?.result]);

	const dataIsEmpty = changeBrokerReportsData?.result.length === 0;

	return (
		<>
			<div
				className='overflow-hidden rounded border border-b-gray-500 flex-column'
				style={{
					height: 'calc(100dvh - 23.2rem)',
					transition: 'height 250ms ease',
				}}
			>
				<ChangeBrokerReportsTable columnsVisibility={columnsVisibility} reports={reports} />
			</div>

			<div className='py-22 flex-justify-end'>
				<Pagination
					hasNextPage={changeBrokerReportsData?.hasNextPage ?? false}
					hasPreviousPage={changeBrokerReportsData?.hasPreviousPage ?? false}
					totalPages={changeBrokerReportsData?.totalPages ?? 0}
					totalCount={changeBrokerReportsData?.totalCount ?? 0}
					currentPage={filters?.pageNumber ?? 1}
					pageSize={filters?.pageSize ?? 0}
					onPageChange={(value) => setFilters('pageNumber', value)}
					onPageSizeChange={(value) => setFilters('pageSize', value)}
					pageNumber={changeBrokerReportsData?.pageNumber ?? 0}
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
		</>
	);
};

export default Table;
