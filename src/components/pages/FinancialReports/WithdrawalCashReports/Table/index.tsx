import { useWithdrawalCashReports } from '@/api/queries/reportsQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { useAppDispatch } from '@/features/hooks';
import { setAddSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import WithdrawalCashReportsTable from './WithdrawalCashReportsTable';

interface TableProps {
	filters: WithdrawalCashReports.WithdrawalCashReportsFilters;
	setFilters: <K extends keyof WithdrawalCashReports.WithdrawalCashReportsFilters>(name: K, value: WithdrawalCashReports.WithdrawalCashReportsFilters[K]) => void;
}

const Table = ({ filters, setFilters }: TableProps) => {

	const dispatch = useAppDispatch();

	const t = useTranslations();


	const { data: withdrawalCashReportsData, isLoading, isError } = useWithdrawalCashReports({
		queryKey: ['withdrawalCashReports', filters]
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
		if (!withdrawalCashReportsData?.result) return [];


		return withdrawalCashReportsData?.result;
	}, [withdrawalCashReportsData?.result]);

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
				<WithdrawalCashReportsTable reports={reports} />
			</div>

			<div className='flex-justify-end py-22'>
				<Pagination
					hasNextPage={withdrawalCashReportsData?.hasNextPage ?? false}
					hasPreviousPage={withdrawalCashReportsData?.hasPreviousPage ?? false}
					totalPages={withdrawalCashReportsData?.totalPages ?? 0}
					totalCount={withdrawalCashReportsData?.totalCount ?? 0}
					currentPage={filters?.pageNumber ?? 1}
					pageSize={filters?.pageSize ?? 0}
					onPageChange={(value) => setFilters('pageNumber', value)}
					onPageSizeChange={(value) => setFilters('pageSize', value)} pageNumber={withdrawalCashReportsData?.pageNumber ?? 0} />
			</div>

			{isLoading && (
				<div style={{ backdropFilter: 'blur(1px)' }} className='absolute left-0 top-0 h-full w-full'>
					<Loading />
				</div>
			)}

			{dataIsEmpty && !isLoading && <div className='fixed center'>
				<NoData />
			</div>}
		</>
	);
};

export default Table;
