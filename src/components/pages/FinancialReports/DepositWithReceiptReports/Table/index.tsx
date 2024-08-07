import { useDepositWithReceiptReports } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useLayoutEffect, useMemo } from 'react';
import DepositWithReceiptReportsTable from './DepositWithReceiptReportsTable';

interface TableProps {
	filters: DepositWithReceiptReports.DepositWithReceiptReportsFilters;
	setFilters: <K extends keyof DepositWithReceiptReports.DepositWithReceiptReportsFilters>(
		name: K,
		value: DepositWithReceiptReports.DepositWithReceiptReportsFilters[K],
	) => void;
	setFieldsValue: (props: Partial<DepositWithReceiptReports.DepositWithReceiptReportsFilters>) => void;
	columnsVisibility: DepositWithReceiptReports.TDepositWithReceiptReportsColumnsState[];
}

const Table = ({ filters, setFilters, columnsVisibility, setFieldsValue }: TableProps) => {
	const brokerUrls = useAppSelector(getBrokerURLs);

	const { data: depositWithReceiptReportsData, isLoading } = useDepositWithReceiptReports({
		queryKey: ['depositWithReceiptReports', filters],
		enabled: Boolean(brokerUrls),
	});

	const onFiltersChanged = (
		newFilters: Omit<DepositWithReceiptReports.DepositWithReceiptReportsFilters, 'pageNumber' | 'pageSize'>,
	) => {
		setFieldsValue(newFilters);
	};

	useLayoutEffect(() => {
		ipcMain.handle('set_deposit_with_receipt_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_deposit_with_receipt_filters');
		};
	}, []);

	const reports = useMemo(() => {
		if (!depositWithReceiptReportsData?.result) return [];

		return depositWithReceiptReportsData?.result;
	}, [depositWithReceiptReportsData?.result]);

	const dataIsEmpty = reports.length === 0;

	return (
		<div className='relative flex-1 gap-16 overflow-hidden flex-column'>
			<DepositWithReceiptReportsTable reports={reports} columnsVisibility={columnsVisibility} />

			<div className='border-t border-t-gray-200 py-16 flex-justify-end'>
				<Pagination
					hasNextPage={depositWithReceiptReportsData?.hasNextPage ?? false}
					hasPreviousPage={depositWithReceiptReportsData?.hasPreviousPage ?? false}
					totalPages={depositWithReceiptReportsData?.totalPages ?? 0}
					totalCount={depositWithReceiptReportsData?.totalCount ?? 0}
					currentPage={filters?.pageNumber ?? 1}
					pageSize={filters?.pageSize ?? 0}
					onPageChange={(value) => setFilters('pageNumber', value)}
					onPageSizeChange={(value) => setFilters('pageSize', value)}
					pageNumber={depositWithReceiptReportsData?.pageNumber ?? 0}
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
