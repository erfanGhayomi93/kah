'use client';

import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import LocalstorageInstance from '@/classes/Localstorage';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { initialOptionWatchlistFilters } from '@/constants/filters';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import { useInputs } from '@/hooks';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import Toolbar from './Toolbar';

const Table = dynamic(() => import('./Table'), {
	ssr: false,
	loading: () => <Loading />,
});

const Watchlist = () => {
	const dispatch = useAppDispatch();

	const isLoggedIn = useAppSelector(getIsLoggedIn);

	const {
		inputs: filters,
		setFieldValue,
		setInputs,
	} = useInputs<Partial<IOptionWatchlistFilters>>(initialOptionWatchlistFilters);

	const { data: userCustomWatchlistList } = useGetAllCustomWatchlistQuery({
		queryKey: ['getAllCustomWatchlistQuery'],
		enabled: isLoggedIn,
	});

	const filtersCount = useMemo(() => {
		let badgeCount = 0;

		if (filters.minimumTradesValue && Number(filters.minimumTradesValue) >= 0) badgeCount++;

		if (Array.isArray(filters.symbols) && filters.symbols.length > 0) badgeCount++;

		if (Array.isArray(filters.type) && filters.type.length > 0) badgeCount++;

		if (Array.isArray(filters.status) && filters.status.length > 0) badgeCount++;

		if (filters.dueDays) {
			if (filters.dueDays[0] > 0) badgeCount++;
			if (filters.dueDays[1] < 365) badgeCount++;
		}

		if (filters.delta) {
			if (filters.delta[0] > -1) badgeCount++;
			if (filters.delta[1] < 1) badgeCount++;
		}

		return badgeCount;
	}, [JSON.stringify(filters ?? {})]);

	useEffect(() => {
		if (isLoggedIn) return;

		dispatch(
			setOptionWatchlistTabId({
				id: -1,
				updateLS: false,
			}),
		);
	}, [isLoggedIn]);

	useEffect(() => {
		if (!isLoggedIn || !Array.isArray(userCustomWatchlistList)) return;

		try {
			const watchlistId = Number(LocalstorageInstance.get('awl', -1)) || -1;
			const isExists = userCustomWatchlistList.findIndex((item) => !item.isHidden && watchlistId === item.id);

			if (isExists === -1) {
				dispatch(
					setOptionWatchlistTabId({
						id: -1,
						updateLS: false,
					}),
				);
			} else {
				dispatch(setOptionWatchlistTabId(watchlistId));
			}
		} catch (e) {
			//
		}
	}, [isLoggedIn, userCustomWatchlistList]);

	return (
		<Main>
			<div className='h-full gap-16 rounded bg-white px-24 pb-16 flex-column darkness:bg-gray-50'>
				<Toolbar
					setPriceBasis={(v) => setFieldValue('priceBasis', v)}
					filters={filters}
					filtersCount={filtersCount}
				/>

				<Table
					filters={filters}
					filtersCount={filtersCount}
					setFilters={setInputs}
					watchlistCount={userCustomWatchlistList?.length ?? 0}
				/>
			</div>
		</Main>
	);
};

export default Watchlist;
