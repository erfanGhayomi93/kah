import axios from '@/api/axios';
import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import { MoreOptionsSVG, PlusSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleAddNewOptionWatchlist, toggleManageOptionWatchlistList } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId, setOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { useDebounce } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo } from 'react';
import Watchlist from './Watchlist';

const WatchlistList = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const queryClient = useQueryClient();

	const optionWatchlistTabId = useAppSelector(getOptionWatchlistTabId);

	const { setDebounce } = useDebounce();

	const { data: userCustomWatchlistList } = useGetAllCustomWatchlistQuery({
		queryKey: ['getAllCustomWatchlistQuery'],
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

		setWatchlistActiveTab(watchlist.id);
	};

	const addNewWatchlist = () => {
		dispatch(toggleAddNewOptionWatchlist(true));
	};

	const manageWatchlistList = () => {
		dispatch(toggleManageOptionWatchlistList(true));
	};

	const setWatchlistActiveTab = async (id: number) => {
		try {
			const queryKey = ['getAllCustomWatchlistQuery'];

			const watchlistList = JSON.parse(
				JSON.stringify(queryClient.getQueryData(queryKey) ?? []),
			) as Option.WatchlistList[];
			queryClient.setQueryData(
				queryKey,
				watchlistList.map((item) => {
					if (item.id === id) item.isActive = true;
					else item.isActive = false;
					return item;
				}),
			);
		} catch (e) {
			//
		}

		try {
			const response = await axios.post(routes.optionWatchlist.SetActiveWatchlist, {
				id,
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');
		} catch (e) {
			//
		}
	};

	const watchlistList = useMemo(() => {
		const defaultWatchlist: Option.WatchlistList = {
			id: -1,
			name: t('option_page.market_overview'),
			isActive: false,
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
		const activeWatchlistId = watchlistList.find(({ isActive }) => Boolean(isActive))?.id ?? -1;
		dispatch(setOptionWatchlistTabId(activeWatchlistId));
	}, [watchlistList]);

	return (
		<div className='gap-8 flex-items-center'>
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
					<button type='button' className='size-40 rounded btn-primary-outline' onClick={addNewWatchlist}>
						<PlusSVG width='1.8rem' height='1.8rem' />
					</button>
				</li>

				<li>
					<button onClick={manageWatchlistList} type='button' className='size-40 rounded btn-primary-outline'>
						<MoreOptionsSVG width='2.4rem' height='2.4rem' />
					</button>
				</li>
			</ul>
		</div>
	);
};

export default WatchlistList;
