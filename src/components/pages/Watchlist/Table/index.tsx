import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';

import axios from '@/api/axios';
import { type IOptionWatchlistQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import NoData from '@/components/common/NoData';
import { PlusSquareSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setAddSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo } from 'react';
import WatchlistTable from './WatchlistTable';

interface TableProps {
	filters: Partial<IOptionWatchlistFilters>;
	setFilters: React.Dispatch<React.SetStateAction<Partial<IOptionWatchlistFilters>>>;
}

const Table = ({ filters, setFilters }: TableProps) => {
	const t = useTranslations();

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

			if (props.minimumTradesValue && Number(props.minimumTradesValue) >= 0)
				params.MinimumTradeValue = props.minimumTradesValue;

			if (Array.isArray(props.symbols) && props.symbols.length > 0)
				params.SymbolISINs = props.symbols.map((item) => item.symbolISIN);

			if (Array.isArray(props.type) && props.type.length > 0) params.OptionType = props.type;

			if (Array.isArray(props.status) && props.status.length > 0) params.IOTM = props.status;

			if (props.dueDays && props.dueDays[1] >= props.dueDays[0]) {
				if (props.dueDays[0] > 0) params.FromDueDays = String(props.dueDays[0]);
				if (props.dueDays[1] < 365) params.ToDueDays = String(props.dueDays[1]);
			}

			if (props.delta && props.delta[1] >= props.delta[0]) {
				if (props.delta[0] > -1) params.FromDelta = String(props.delta[0]);
				if (props.delta[1] < 1) params.ToDelta = String(props.delta[1]);
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

	const onFiltersChanged = (newFilters: IOptionWatchlistFilters) => {
		setFilters(newFilters);
	};

	useLayoutEffect(() => {
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
		<>
			<div
				className='overflow-hidden rounded border border-gray-500 flex-column'
				style={{
					height: 'calc(100dvh - 18.4rem)',
					transition: 'height 250ms ease',
				}}
			>
				<WatchlistTable id={watchlistId} data={data} fetchNextPage={fetchNextPage} />

				{!dataIsEmpty && !isLoading && watchlistId > -1 && (
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

			{isLoading && (
				<div style={{ backdropFilter: 'blur(1px)' }} className='absolute left-0 top-0 size-full'>
					<Loading />
				</div>
			)}

			{dataIsEmpty && !isLoading && (
				<div className='absolute left-0 top-0 size-full flex-justify-center'>
					<NoData
						text={t.rich('option_page.no_data_table', {
							symbol: (chunk) => (
								<button type='button' className='text-primary-400 underline' onClick={addSymbol}>
									{chunk}
								</button>
							),
						})}
					/>
				</div>
			)}
		</>
	);
};

export default Table;
