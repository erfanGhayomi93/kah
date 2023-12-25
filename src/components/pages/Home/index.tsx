'use client';

import styled from 'styled-components';
import Pagination from './Pagination';
import Table from './Table';

const Main = styled.main`
	min-height: calc(100% - 10.8rem);
`;

interface HomeProps {
	data: Option.Root[];
}

const Home = ({ data }: HomeProps) => {
	return (
		<Main className='p-32'>
			<div className='flex flex-col gap-24'>
				<Table data={data} />
				<Pagination />
			</div>
		</Main>
	);
};

export default Home;
