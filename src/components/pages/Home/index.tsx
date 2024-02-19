'use client';

import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import LocalstorageInstance from '@/classes/Localstorage';
import Main from '@/components/layout/Main';
import { initialFilters } from '@/components/modals/OptionWatchlistFiltersModal/Form';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import { useLayoutEffect, useState } from 'react';
import Table from './Table';
import Toolbar from './Toolbar';

const Home = () => {
	const dispatch = useAppDispatch();

	const isLoggedIn = useAppSelector(getIsLoggedIn);

	const [filters, setFilters] = useState<Partial<IOptionWatchlistFilters>>(initialFilters);

	const { data: userCustomWatchlistList, refetch: refetchUserCustomWatchlistList } = useGetAllCustomWatchlistQuery({
		queryKey: ['getAllCustomWatchlistQuery'],
		enabled: false,
	});

	useLayoutEffect(() => {
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

	useLayoutEffect(() => {
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
			<Table filters={filters} setFilters={setFilters} />
		</Main>
	);
};

export default Home;
