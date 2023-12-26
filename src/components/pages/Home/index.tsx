'use client';

import styled from 'styled-components';
import Table from './Table';
import Toolbar from './Toolbar';

const Main = styled.main`
	display: flex;
	flex-direction: column;
	padding: 2.4rem 3.2rem 0 3.2rem;
	gap: 2.4rem;
	min-height: calc(100% - 10.8rem);
`;

interface HomeProps {
	data: Option.Root[];
}

const Home = ({ data }: HomeProps) => {
	return (
		<Main>
			<Toolbar />
			<Table data={data} />
		</Main>
	);
};

export default Home;
