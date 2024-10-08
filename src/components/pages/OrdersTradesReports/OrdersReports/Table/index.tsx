import { useOrdersReportsQuery } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { useLayoutEffect, useMemo } from 'react';
import OrdersReportsTable from './OrdersReportsTable';

interface TableProps {
	filters: OrdersReports.IOrdersReportsFilters;
	setFilters: <K extends keyof OrdersReports.IOrdersReportsFilters>(
		name: K,
		value: OrdersReports.IOrdersReportsFilters[K],
	) => void;
	setFieldsValue: (props: Partial<OrdersReports.IOrdersReportsFilters>) => void;
	columnsVisibility: OrdersReports.IOrdersReportsColumnsState[];
}

const Table = ({ filters, setFilters, setFieldsValue, columnsVisibility }: TableProps) => {
	const { data: ordersReportData, isLoading } = useOrdersReportsQuery({
		queryKey: ['ordersReports', filters],
	});

	const onFiltersChanged = (newFilters: Omit<OrdersReports.IOrdersReportsFilters, 'pageNumber' | 'pageSize'>) => {
		setFieldsValue(newFilters);
	};

	useLayoutEffect(() => {
		ipcMain.handle('set_orders_reports_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_orders_reports_filters');
		};
	}, []);

	const reports = useMemo(() => {
		if (!ordersReportData?.result) return [];

		return ordersReportData?.result;
	}, [ordersReportData?.result]);

	const dataIsEmpty = ordersReportData?.result.length === 0;

	return (
		<div className='relative flex-1 gap-16 overflow-hidden flex-column'>
			<OrdersReportsTable columnsVisibility={columnsVisibility} reports={reports} />

			<div className='border-t border-t-gray-200 py-16 flex-justify-end'>
				<Pagination
					hasNextPage={ordersReportData?.hasNextPage ?? false}
					hasPreviousPage={ordersReportData?.hasPreviousPage ?? false}
					totalPages={ordersReportData?.totalPages ?? 0}
					totalCount={ordersReportData?.totalCount ?? 0}
					currentPage={filters?.pageNumber ?? 1}
					pageSize={filters?.pageSize ?? 0}
					onPageChange={(value) => setFilters('pageNumber', value)}
					onPageSizeChange={(value) => setFilters('pageSize', value)}
					pageNumber={ordersReportData?.pageNumber ?? 0}
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
