'use client';

import Main from '@/components/layout/Main';
import { initialFilters } from '@/components/modals/OptionWatchlistFiltersModal/Form';
import { useState } from 'react';
import Table from './Table';
import Toolbar from './Toolbar';

const Home = () => {
	const [filters, setFilters] = useState<Partial<IOptionWatchlistFilters>>(initialFilters);

	return (
		<Main className='gap-16 bg-white !pt-16'>
			<Toolbar filters={filters} />
			<Table filters={filters} setFilters={setFilters} />
		</Main>
	);
};

export default Home;
