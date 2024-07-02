'use client';

import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import LocalstorageInstance from '@/classes/Localstorage';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { initialOptionWatchlistFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Toolbar from './Toolbar';

const Table = dynamic(() => import('./Table'), {
	ssr: false,
	loading: () => <Loading />,
});

const Watchlist = () => {
	const dispatch = useAppDispatch();

	const isLoggedIn = useAppSelector(getIsLoggedIn);

	const [filters, setFilters] = useState<Partial<IOptionWatchlistFilters>>(initialOptionWatchlistFilters);

	const { data: userCustomWatchlistList, refetch: refetchUserCustomWatchlistList } = useGetAllCustomWatchlistQuery({
		queryKey: ['getAllCustomWatchlistQuery'],
		enabled: false,
	});

	useEffect(() => {
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
		<Main className='gap-16 bg-white !pt-16'>
			<Toolbar filters={filters} />

			<div className='relative flex-1 overflow-hidden'>
				<Table
					filters={filters}
					setFilters={setFilters}
					watchlistCount={userCustomWatchlistList?.length ?? 0}
				/>
			</div>
		</Main>
	);
};

export default Watchlist;
