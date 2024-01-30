'use client';

import { initialFilters } from '@/components/modals/OptionWatchlistFiltersModal/Form';
import { useState } from 'react';
import styled from 'styled-components';
import Table from './Table';
import Toolbar from './Toolbar';

const Main = styled.main`
	display: flex;
	flex-direction: column;
	padding: 1.6rem 3.2rem 0 3.2rem;
	gap: 1.6rem;
	min-height: calc(100% - 10rem);
`;

const Home = () => {
	const [filters, setFilters] = useState<Partial<IOptionWatchlistFilters>>(initialFilters);

	return (
		<Main className='bg-white'>
			<Toolbar filters={filters} />
			<Table filters={filters} setFilters={setFilters} />
		</Main>
	);
};

export default Home;
