import axios from '@/api/axios';
import { type IOptionWatchlistQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { PlusSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setAddSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
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

	const {
		data: watchlistData,
		isLoading,
		fetchNextPage,
	} = useInfiniteQuery<
		PaginationResponse<Option.Root[]>,
		AxiosError,
		InfiniteData<PaginationResponse<Option.Root[]>>,
		['optionWatchlistQuery', Partial<IOptionWatchlistFilters> & { watchlistId: number }],
		PaginationParams
	>({
		queryKey: ['optionWatchlistQuery', { ...filters, watchlistId: watchlistId ?? -1 }],
		queryFn: async ({ queryKey, pageParam, signal }) => {
			const [, props] = queryKey;
			const params: Partial<IOptionWatchlistQuery> = {};

			if (props.term) params.Term = props.term;

			if (props.minimumTradesValue && Number(props.minimumTradesValue) >= 0)
				params.MinimumTradeValue = props.minimumTradesValue;

			if (Array.isArray(props.symbols) && props.symbols.length > 0)
				params.BaseSymbolISINs = props.symbols.map((item) => item.symbolISIN);

			if (Array.isArray(props.type) && props.type.length > 0) params.OptionType = props.type;

			if (Array.isArray(props.status) && props.status.length > 0) params.IOTM = props.status;

			if (props.dueDays) {
				params.FromDueDays = String(Math.min(props.dueDays[0], props.dueDays[1]));
				params.ToDueDays = String(Math.max(props.dueDays[0], props.dueDays[1]));
			}

			if (props.delta && props.delta[1] >= props.delta[0]) {
				params.FromDelta = String(Math.min(props.delta[0], props.delta[1]));
				params.ToDelta = String(Math.max(props.delta[0], props.delta[1]));
			}

			if (props.watchlistId > -1) params.Id = String(props.watchlistId);

			const response = await axios.get<PaginationResponse<Option.Root[]>>(
				props.watchlistId > -1 ? routes.optionWatchlist.GetCustomWatchlist : routes.optionWatchlist.Watchlist,
				{
					params: {
						...params,
						'QueryOption.PageSize': pageParam.pageSize,
						'QueryOption.PageNumber': pageParam.pageNumber,
					},
					signal,
				},
			);
			const { data } = response;

			return data;
		},
		getNextPageParam: (lastPage) => ({
			...lastPage,
			pageNumber: lastPage.result.length === 0 ? lastPage.pageNumber : lastPage.pageNumber + 1,
		}),
		initialPageParam: {
			pageNumber: 1,
			pageSize: 20,
			hasPreviousPage: false,
			hasNextPage: true,
			totalCount: -1,
			totalPages: -1,
		},
	});

	const addSymbol = () => {
		dispatch(setAddSymbolToWatchlistModal({}));
	};

	const onFiltersChanged = (newFilters: Omit<IOptionWatchlistFilters, 'priceBasis' | 'term'>) => {
		setFilters(newFilters);
	};

	useEffect(() => {
		ipcMain.handle('set_option_watchlist_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_option_watchlist_filters');
		};
	}, []);

	const data = useMemo<Option.Root[]>(() => {
		if (!watchlistData) return [];
		return watchlistData.pages.reduce<Option.Root[]>((total, currentPage) => [...total, ...currentPage.result], []);
	}, [watchlistData]);

	const dataIsEmpty = data.length === 0;

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
					data={data}
					setTerm={(term) => setFilters({ term })}
					fetchNextPage={fetchNextPage}
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
				<div className='absolute left-0 top-0 size-full flex-justify-center'>
					<NoData
						text={
							filtersCount > 0 || watchlistId === -1
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
