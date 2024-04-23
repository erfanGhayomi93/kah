'use client';

import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import LocalstorageInstance from '@/classes/Localstorage';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { initialOptionWatchlistFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { getIsLoggedIn, getIsLoggingIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import dynamic from 'next/dynamic';
import { useLayoutEffect, useState } from 'react';
import Toolbar from './Toolbar';

const Table = dynamic(() => import('./Table'), {
	ssr: false,
	loading: () => <Loading />,
});

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		isLoggingIn: getIsLoggingIn(state),
	}),
);

const Watchlist = () => {
	const dispatch = useAppDispatch();

	const { isLoggingIn, isLoggedIn } = useAppSelector(getStates);

	const [filters, setFilters] = useState<Partial<IOptionWatchlistFilters>>(initialOptionWatchlistFilters);

	const { data: userCustomWatchlistList, refetch: refetchUserCustomWatchlistList } = useGetAllCustomWatchlistQuery({
		queryKey: ['getAllCustomWatchlistQuery'],
		enabled: false,
	});

	useLayoutEffect(() => {
		if (isLoggingIn) return;

		try {
			if (isLoggedIn) {
				refetchUserCustomWatchlistList();
			} else {
				dispatch(
					setOptionWatchlistTabId({
						id: -1,
						updateLS: false,
					}),
				);
			}
		} catch (e) {
			//
		}
	}, [isLoggedIn, isLoggingIn]);

	useLayoutEffect(() => {
		if (isLoggingIn || !isLoggedIn || !Array.isArray(userCustomWatchlistList)) return;

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
	}, [isLoggedIn, isLoggingIn, userCustomWatchlistList]);

	return (
		<Main className='gap-16 bg-white !pt-16'>
			<Toolbar filters={filters} />

			<div className='relative flex-1 overflow-hidden'>
				<Table filters={filters} setFilters={setFilters} />
			</div>
		</Main>
	);
};

export default Watchlist;
