import { useDepositWithReceiptReports } from '@/api/queries/reportsQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { useAppDispatch } from '@/features/hooks';
import { setAddSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import DepositWithReceiptReportsTable from './DepositWithReceiptReportsTable';

interface TableProps {
	filters: DepositWithReceiptReports.DepositWithReceiptReportsFilters;
	setFilters: <K extends keyof DepositWithReceiptReports.DepositWithReceiptReportsFilters>(
		name: K,
		value: DepositWithReceiptReports.DepositWithReceiptReportsFilters[K],
	) => void;
}

const Table = ({ filters, setFilters }: TableProps) => {
	const dispatch = useAppDispatch();

	const t = useTranslations();

	const {
		data: depositWithReceiptReportsData,
		isLoading,
		isError,
	} = useDepositWithReceiptReports({
		queryKey: ['depositWithReceiptReports', filters],
	});

	const addSymbol = () => {
		dispatch(setAddSymbolToWatchlistModal({}));
	};

	const onFiltersChanged = (newFilters: Transaction.ITransactionsFilters) => {
		// setFilters(newFilters);
	};

	// useLayoutEffect(() => {
	// 	ipcMain.handle('set_transactions_filters', onFiltersChanged);

	// 	return () => {
	// 		ipcMain.removeChannel('set_transactions_filters');
	// 	};
	// }, []);

	const reports = useMemo(() => {
		if (!depositWithReceiptReportsData?.result) return [];

		return depositWithReceiptReportsData?.result;
	}, [depositWithReceiptReportsData?.result]);

	const dataIsEmpty = reports.length === 0;

	return (
		<>
			<div
				className='overflow-hidden rounded border border-b-gray-500 flex-column'
				style={{
					height: 'calc(100dvh - 23.2rem)',
					transition: 'height 250ms ease',
				}}
			>
				<DepositWithReceiptReportsTable reports={reports} />
			</div>

			<div className='py-22 flex-justify-end'>
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
				<div className='fixed center'>
					<NoData />
				</div>
			)}
		</>
	);
};

export default Table;
