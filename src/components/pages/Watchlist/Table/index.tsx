import { useOptionWatchlistQuery } from '@/api/queries/optionQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';

import { PlusSquareSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleAddSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { useTranslations } from 'next-intl';
import { useLayoutEffect } from 'react';
import ManageWatchlistColumns from './ManageWatchlistColumns';
import NoData from './NoData';
import WatchlistTable from './WatchlistTable';

interface TableProps {
	filters: Partial<IOptionWatchlistFilters>;
	setFilters: React.Dispatch<React.SetStateAction<Partial<IOptionWatchlistFilters>>>;
}

const Table = ({ filters, setFilters }: TableProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const watchlistId = useAppSelector(getOptionWatchlistTabId);

	const { data: watchlistData, isFetching } = useOptionWatchlistQuery({
		queryKey: ['optionWatchlistQuery', { ...filters, watchlistId: watchlistId ?? -1, pageNumber: 1, pageSize: 25 }],
		refetchInterval: 3e5,
	});

	const addSymbol = () => {
		dispatch(toggleAddSymbolToWatchlistModal({}));
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
		<>
			<div
				className='overflow-hidden rounded border border-gray-500 flex-column'
				style={{
					height: 'calc(100dvh - 23.2rem)',
					transition: 'height 250ms ease',
				}}
			>
				<WatchlistTable id={watchlistId} data={watchlistData} />

				{!dataIsEmpty && !isFetching && watchlistId > -1 && (
					<button
						onClick={addSymbol}
						className='min-h-48 gap-8 border-t border-t-gray-500 pr-24 font-medium text-primary-400 flex-items-center'
						type='button'
					>
						<span className='size-16 rounded-sm text-current flex-justify-center'>
							<PlusSquareSVG width='1.6rem' height='1.6rem' />
						</span>
						{t('option_page.add_symbol')}
					</button>
				)}
			</div>

			{isFetching && (
				<div style={{ backdropFilter: 'blur(1px)' }} className='absolute left-0 top-0 h-full w-full'>
					<Loading />
				</div>
			)}

			<ManageWatchlistColumns />

			{dataIsEmpty && !isFetching && <NoData key='no-data' onAddSymbol={addSymbol} />}
		</>
	);
};

export default Table;
