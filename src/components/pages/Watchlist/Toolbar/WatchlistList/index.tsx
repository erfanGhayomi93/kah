import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import Tooltip from '@/components/common/Tooltip';
import { MoreOptionsSVG, PlusSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setAddNewOptionWatchlistModal, setManageOptionWatchlistListModal } from '@/features/slices/modalSlice';
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
		dispatch(setAddNewOptionWatchlistModal({}));
	};

	const manageWatchlistList = () => {
		if (!Array.isArray(userCustomWatchlistList) || userCustomWatchlistList.length === 0) {
			toast.warning(t('alerts.add_watchlist'));
			return;
		}
		dispatch(setManageOptionWatchlistListModal({}));
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
		<div className='select-none gap-8 overflow-hidden flex-justify-start'>
			<ul className='flex grow-0 gap-8 overflow-y-auto overflow-x-visible'>
				{watchlistList.map((item, i) => (
					<Watchlist
						key={item.id}
						{...item}
						star={item.id === -1}
						isActive={optionWatchlistTabId === item.id}
						onSelect={() => onSelectWatchlist(item)}
					/>
				))}
			</ul>

			<ul className='flex grow-0 gap-8'>
				<li>
					<Tooltip placement='top' content={t('tooltip.add_new_watchlist')}>
						<button
							type='button'
							className='size-40 rounded border border-gray-200 text-gray-800 transition-colors flex-justify-center hover:border-primary-100 hover:bg-primary-100 hover:text-white'
							onClick={addNewWatchlist}
						>
							<PlusSVG width='1.8rem' height='1.8rem' />
						</button>
					</Tooltip>
				</li>

				<li>
					<Tooltip placement='top' content={t('tooltip.manage_watchlist_list')}>
						<button
							type='button'
							onClick={manageWatchlistList}
							className='size-40 rounded border border-gray-200 text-gray-800 transition-colors flex-justify-center hover:border-primary-100 hover:bg-primary-100 hover:text-white'
						>
							<MoreOptionsSVG width='2.4rem' height='2.4rem' />
						</button>
					</Tooltip>
				</li>
			</ul>
		</div>
	);
};

export default WatchlistList;
