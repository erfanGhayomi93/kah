import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import { MoreOptionsSVG, PlusSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleAddNewOptionWatchlist, toggleManageOptionWatchlistList } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId, setOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useDebounce } from '@/hooks';
import { createSelector } from '@reduxjs/toolkit';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo } from 'react';
import Watchlist from './Watchlist';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		optionWatchlistTabId: getOptionWatchlistTabId(state),
	}),
);

const WatchlistList = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const queryClient = useQueryClient();

	const { optionWatchlistTabId, isLoggedIn } = useAppSelector(getStates);

	const { setDebounce } = useDebounce();

	const { data: userCustomWatchlistList, refetch: refetchUserCustomWatchlistList } = useGetAllCustomWatchlistQuery({
		queryKey: ['getAllCustomWatchlistQuery'],
		enabled: false,
	});

	const onReloadMarketView = () => {
		setDebounce(() => {
			queryClient.refetchQueries({
				queryKey: ['optionWatchlistQuery'],
				type: 'active',
				exact: false,
			});
		}, 300);
	};

	const onSelectWatchlist = (watchlist: Option.WatchlistList) => {
		dispatch(setOptionWatchlistTabId(watchlist.id));

		if (watchlist.id === -1) {
			onReloadMarketView();
			return;
		}
	};

	const addNewWatchlist = () => {
		dispatch(toggleAddNewOptionWatchlist(true));
	};

	const manageWatchlistList = () => {
		dispatch(toggleManageOptionWatchlistList(true));
	};

	const watchlistList = useMemo(() => {
		const defaultWatchlist: Option.WatchlistList = {
			id: -1,
			name: t('option_page.market_overview'),
			isHidden: false,
		};

		try {
			if (!Array.isArray(userCustomWatchlistList)) return [defaultWatchlist];

			return [defaultWatchlist, ...userCustomWatchlistList];
		} catch (e) {
			return [defaultWatchlist];
		}
	}, [userCustomWatchlistList]);

	useLayoutEffect(() => {
		if (isLoggedIn) refetchUserCustomWatchlistList();
	}, [isLoggedIn]);

	useLayoutEffect(() => {
		try {
			const isExists = watchlistList.findIndex((item) => !item.isHidden && optionWatchlistTabId === item.id);
			if (isExists === -1) dispatch(setOptionWatchlistTabId(-1));
		} catch (e) {
			//
		}
	}, [watchlistList, optionWatchlistTabId]);

	return (
		<div className='gap-8 flex-justify-between'>
			<ul className='flex flex-grow-0 gap-8'>
				{watchlistList.map((item) => (
					<Watchlist
						key={item.id}
						{...item}
						isActive={optionWatchlistTabId === item.id}
						onSelect={() => onSelectWatchlist(item)}
					/>
				))}
			</ul>

			<ul className='flex flex-grow-0 gap-8'>
				<li>
					<button
						type='button'
						className='size-40 rounded border border-gray-500 text-gray-1000 transition-colors flex-justify-center hover:border-primary-400 hover:bg-primary-400 hover:text-white'
						onClick={addNewWatchlist}
					>
						<PlusSVG width='1.8rem' height='1.8rem' />
					</button>
				</li>

				<li>
					<button
						onClick={manageWatchlistList}
						type='button'
						className='size-40 rounded border border-gray-500 text-gray-1000 transition-colors flex-justify-center hover:border-primary-400 hover:bg-primary-400 hover:text-white'
					>
						<MoreOptionsSVG width='2.4rem' height='2.4rem' />
					</button>
				</li>
			</ul>
		</div>
	);
};

export default WatchlistList;
