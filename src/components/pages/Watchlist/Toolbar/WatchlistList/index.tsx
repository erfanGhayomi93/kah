import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import { MoreOptionsSVG, PlusSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	toggleAddNewOptionWatchlist,
	toggleLoginModal,
	toggleManageOptionWatchlistListModal,
} from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId, setOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useDebounce } from '@/hooks';
import { createSelector } from '@reduxjs/toolkit';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
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

	const { data: userCustomWatchlistList } = useGetAllCustomWatchlistQuery({
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
		if (!isLoggedIn) {
			dispatch(toggleLoginModal({}));
			toast.error(t('alerts.login_to_your_account'), {
				toastId: 'login_to_your_account',
			});
			return;
		}

		dispatch(toggleAddNewOptionWatchlist({}));
	};

	const manageWatchlistList = () => {
		if (!isLoggedIn) {
			dispatch(toggleLoginModal({}));
			toast.error(t('alerts.login_to_your_account'), {
				toastId: 'login_to_your_account',
			});
			return;
		}

		if (!Array.isArray(userCustomWatchlistList) || userCustomWatchlistList.length === 0) {
			toast.warning(t('alerts.add_watchlist'));
			return;
		}
		dispatch(toggleManageOptionWatchlistListModal({}));
	};

	const watchlistList = useMemo(() => {
		const defaultWatchlist: Option.WatchlistList = {
			id: -1,
			name: t('option_page.market_overview'),
			isHidden: false,
		};

		try {
			if (!isLoggedIn || !Array.isArray(userCustomWatchlistList)) return [defaultWatchlist];

			return [defaultWatchlist, ...userCustomWatchlistList];
		} catch (e) {
			return [defaultWatchlist];
		}
	}, [userCustomWatchlistList, isLoggedIn]);

	return (
		<div className='gap-8 flex-justify-start'>
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
						type='button'
						onClick={manageWatchlistList}
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
