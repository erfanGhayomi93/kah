import { useInstantDepositReports } from '@/api/queries/reportsQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { useAppDispatch } from '@/features/hooks';
import { setAddSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import InstantDepositReportsTable from './InstantDepositReportsTable';



interface TableProps {
	filters: InstantDepositReports.IInstantDepositReportsFilters;
	setFilters: <K extends keyof InstantDepositReports.IInstantDepositReportsFilters>(name: K, value: InstantDepositReports.IInstantDepositReportsFilters[K]) => void;
}

const Table = ({ filters, setFilters }: TableProps) => {

	const dispatch = useAppDispatch();

	const t = useTranslations();


	const { data: instantDepositReportsData, isLoading, isError } = useInstantDepositReports({
		queryKey: ['instantDepositReports', filters]
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
		if (!instantDepositReportsData?.result) return [];


		return instantDepositReportsData?.result;
	}, [instantDepositReportsData?.result]);

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
				<InstantDepositReportsTable reports={reports} />
			</div>

			<div className='flex-justify-end py-22'>
				<Pagination
					hasNextPage={instantDepositReportsData?.hasNextPage ?? false}
					hasPreviousPage={instantDepositReportsData?.hasPreviousPage ?? false}
					totalPages={instantDepositReportsData?.totalPages ?? 0}
					totalCount={instantDepositReportsData?.totalCount ?? 0}
					currentPage={filters?.pageNumber ?? 1}
					pageSize={filters?.pageSize ?? 0}
					onPageChange={(value) => setFilters('pageNumber', value)}
					onPageSizeChange={(value) => setFilters('pageSize', value)} pageNumber={instantDepositReportsData?.pageNumber ?? 0} />
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
