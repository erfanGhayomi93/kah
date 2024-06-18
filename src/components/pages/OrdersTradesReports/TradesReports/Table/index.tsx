import { useTradesReportsQuery } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { useLayoutEffect, useMemo } from 'react';
import TradeReportsTable from './TradesReportsTable';

interface TableProps {
	filters: TradesReports.ITradesReportsFilters;
	setFilters: <K extends keyof TradesReports.ITradesReportsFilters>(
		name: K,
		value: TradesReports.ITradesReportsFilters[K],
	) => void;
	setFieldsValue: (props: Partial<TradesReports.ITradesReportsFilters>) => void;
	columnsVisibility: TradesReports.ITradesReportsColumnsState[];
}

const Table = ({ filters, setFilters, setFieldsValue, columnsVisibility }: TableProps) => {
	const { data: tradesReportsData, isLoading } = useTradesReportsQuery({
		queryKey: ['tradesReports', filters],
	});

	const onFiltersChanged = (newFilters: Omit<Transaction.ITransactionsFilters, 'pageNumber' | 'pageSize'>) => {
		setFieldsValue(newFilters);
	};

	useLayoutEffect(() => {
		ipcMain.handle('set_trades_reports_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_trades_reports_filters');
		};
	}, []);

	const reports = useMemo(() => {
		if (!tradesReportsData?.result) return [];

		return tradesReportsData?.result;
	}, [tradesReportsData?.result]);

	const dataIsEmpty = tradesReportsData?.result.length === 0;

	return (
		<>
			<div
				className='overflow-hidden rounded border border-b-light-gray-200 flex-column'
				style={{
					height: 'calc(100dvh - 23.2rem)',
					transition: 'height 250ms ease',
				}}
			>
				<TradeReportsTable columnsVisibility={columnsVisibility} reports={reports} />
			</div>

			<div className='py-22 flex-justify-end'>
				<Pagination
					hasNextPage={tradesReportsData?.hasNextPage ?? false}
					hasPreviousPage={tradesReportsData?.hasPreviousPage ?? false}
					totalPages={tradesReportsData?.totalPages ?? 0}
					totalCount={tradesReportsData?.totalCount ?? 0}
					currentPage={filters?.pageNumber ?? 1}
					pageSize={filters?.pageSize ?? 0}
					onPageChange={(value) => setFilters('pageNumber', value)}
					onPageSizeChange={(value) => setFilters('pageSize', value)}
					pageNumber={tradesReportsData?.pageNumber ?? 0}
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
