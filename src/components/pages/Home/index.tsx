'use client';

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

	useLayoutEffect(() => {
		try {
			if (isLoggedIn) {
				const watchlistId = Number(LocalstorageInstance.get('awl', -1)) || -1;
				dispatch(setOptionWatchlistTabId(isNaN(watchlistId) ? -1 : watchlistId));
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

	return (
		<Main className='gap-16 bg-white !pt-16'>
			<Toolbar filters={filters} />
			<Table filters={filters} setFilters={setFilters} />
		</Main>
	);
};

export default Home;
