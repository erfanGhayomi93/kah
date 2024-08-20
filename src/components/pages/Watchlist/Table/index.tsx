import { useOptionWatchlistQuery } from '@/api/queries/optionQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { PlusSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setAddSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import WatchlistTable from './WatchlistTable';

interface TableProps {
	filtersCount: number;
	watchlistCount: number;
	filters: Partial<IOptionWatchlistFilters>;
	setFilters: React.Dispatch<React.SetStateAction<Partial<IOptionWatchlistFilters>>>;
}

const Table = ({ filters, filtersCount, watchlistCount, setFilters }: TableProps) => {
	const t = useTranslations('option_page');

	const dispatch = useAppDispatch();

	const watchlistId = useAppSelector(getOptionWatchlistTabId);

	const { data: watchlistData = [], isLoading } = useOptionWatchlistQuery({
		queryKey: ['optionCustomWatchlistQuery', { ...filters, watchlistId: watchlistId ?? -1 }],
	});

	const setSort = (sorting: IOptionWatchlistFilters['sort']) => {
		//
	};

	const addSymbol = () => {
		dispatch(setAddSymbolToWatchlistModal({}));
	};

	const onFiltersChanged = (newFilters: Omit<IOptionWatchlistFilters, 'priceBasis' | 'term' | 'sort'>) => {
		setFilters(newFilters);
	};

	useEffect(() => {
		ipcMain.handle('set_option_watchlist_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_option_watchlist_filters');
		};
	}, []);

	const dataIsEmpty = watchlistData.length === 0;

	const isFilteredDataEmpty = filtersCount > 0 || watchlistId === -1 || (filters.term && filters.term.length > 0);

	return (
		<div className='relative flex-1 gap-16 overflow-hidden flex-column'>
			<div
				className='gap-16 overflow-hidden flex-column'
				style={{
					maxHeight: 'calc(100dvh - 20rem)',
					transition: 'height 250ms ease',
				}}
			>
				<WatchlistTable
					id={watchlistId}
					data={watchlistData}
					setTerm={(term) => setFilters({ term })}
					setSort={setSort}
					watchlistCount={watchlistCount}
				/>

				{!dataIsEmpty && !isLoading && watchlistId > -1 && (
					<div>
						<button
							type='button'
							onClick={addSymbol}
							className='h-40 gap-8 rounded bg-gray-400 px-24 font-medium text-gray-700 flex-items-center'
						>
							<PlusSVG width='1.8rem' height='1.8rem' />
							{t('add_symbol')}
						</button>
					</div>
				)}
			</div>

			{isLoading && (
				<div style={{ backdropFilter: 'blur(1px)' }} className='absolute left-0 top-0 size-full'>
					<Loading />
				</div>
			)}

			{dataIsEmpty && !isLoading && (
				<div className='absolute left-0 top-48 size-full bg-white flex-justify-center darkness:bg-gray-50'>
					<NoData
						text={
							isFilteredDataEmpty
								? t('no_data_table')
								: t.rich('add_symbol_to_table', {
										symbol: (chunk) => (
											<button
												type='button'
												className='text-primary-100 underline'
												onClick={addSymbol}
											>
												{chunk}
											</button>
										),
									})
						}
					/>
				</div>
			)}
		</div>
	);
};

export default Table;
