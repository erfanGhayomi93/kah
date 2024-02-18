import { useOptionWatchlistQuery } from '@/api/queries/optionQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';

import { useAppSelector } from '@/features/hooks';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { useLayoutEffect } from 'react';
import ManageWatchlistColumns from './ManageWatchlistColumns';
import NoData from './NoData';
import WatchlistTable from './WatchlistTable';

interface TableProps {
	filters: Partial<IOptionWatchlistFilters>;
	setFilters: React.Dispatch<React.SetStateAction<Partial<IOptionWatchlistFilters>>>;
}

const Table = ({ filters, setFilters }: TableProps) => {
	const watchlistId = useAppSelector(getOptionWatchlistTabId);

	const { data: watchlistData, isFetching } = useOptionWatchlistQuery({
		queryKey: [
			'optionWatchlistQuery',
			{ ...filters, watchlistId: watchlistId ?? undefined, pageNumber: 1, pageSize: 25 },
		],
		refetchInterval: 3e5,
	});

	const addSymbol = () => {
		//
	};

	const onFiltersChanged = (newFilters: IOptionWatchlistFilters) => {
		setFilters(newFilters);
	};

	useLayoutEffect(() => {
		ipcMain.handle<IOptionWatchlistFilters>('set_option_watchlist_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_option_watchlist_filters');
		};
	}, []);

	const dataIsEmpty = !Array.isArray(watchlistData) || watchlistData.length === 0;

	return (
		<div
			style={{
				maxHeight: 'calc(100vh - 24.8rem)',
				height: '200vh',
			}}
			className='relative'
		>
			<WatchlistTable data={watchlistData} />

			{isFetching && (
				<div style={{ backdropFilter: 'blur(1px)' }} className='absolute left-0 top-0 h-full w-full'>
					<Loading />
				</div>
			)}

			<ManageWatchlistColumns />

			{dataIsEmpty && !isFetching && <NoData key='no-data' onAddSymbol={addSymbol} />}
		</div>
	);
};

export default Table;
