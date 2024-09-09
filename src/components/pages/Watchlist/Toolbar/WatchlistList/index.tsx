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

	const { optionWatchlistTabId } = useAppSelector(getStates);

	const { setDebounce } = useDebounce();

	const { data: userCustomWatchlistList = [], isLoading } = useGetAllCustomWatchlistQuery({
		queryKey: ['getAllCustomWatchlistQuery'],
		enabled: false,
	});

	const onReloadMarketView = () => {
		setDebounce(() => {
			queryClient.refetchQueries({
				queryKey: ['optionCustomWatchlistQuery'],
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
			toast.warning(
				t('alerts.add_watchlist', {
					toastId: 'add_watchlist',
				}),
			);
			return;
		}
		dispatch(setManageOptionWatchlistListModal({}));
	};

	const defaultWatchlist: Option.WatchlistList = {
		id: -1,
		name: t('option_page.market_overview'),
		isHidden: false,
	};

	return (
		<div className='select-none gap-8 overflow-hidden flex-justify-start'>
			<div className='flex gap-8 overflow-hidden'>
				<ul className='flex grow-0'>
					<Watchlist
						{...defaultWatchlist}
						star
						isActive={optionWatchlistTabId === defaultWatchlist.id}
						onSelect={() => onSelectWatchlist(defaultWatchlist)}
					/>
				</ul>
				<ul className='flex grow-0 gap-8 overflow-y-auto overflow-x-visible'>
					{userCustomWatchlistList.map((item) => (
						<Watchlist
							key={item.id}
							{...item}
							star={false}
							isActive={optionWatchlistTabId === item.id}
							onSelect={() => onSelectWatchlist(item)}
						/>
					))}
				</ul>
			</div>

			<ul className='flex grow-0 gap-8'>
				<li>
					<Tooltip placement='top' content={t('tooltip.add_new_watchlist')}>
						<button
							disabled={isLoading}
							type='button'
							className='size-40 rounded border border-gray-200 text-gray-800 transition-colors flex-justify-center hover:border-primary-100 hover:bg-primary-100 hover:text-white'
							onClick={addNewWatchlist}
						>
							{isLoading ? (
								<div className='size-20 spinner' />
							) : (
								<PlusSVG width='1.8rem' height='1.8rem' />
							)}
						</button>
					</Tooltip>
				</li>

				<li>
					<Tooltip placement='top' content={t('tooltip.manage_watchlist_list')}>
						<button
							disabled={isLoading}
							type='button'
							onClick={manageWatchlistList}
							className='size-40 rounded border border-gray-200 text-gray-800 transition-colors flex-justify-center hover:border-primary-100 hover:bg-primary-100 hover:text-white'
						>
							{isLoading ? (
								<div className='size-20 spinner' />
							) : (
								<MoreOptionsSVG width='2.4rem' height='2.4rem' />
							)}
						</button>
					</Tooltip>
				</li>
			</ul>
		</div>
	);
};

export default WatchlistList;
