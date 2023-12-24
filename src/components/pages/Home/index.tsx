'use client';

import styled from 'styled-components';
import OptionTable from './OptionTable';

const Main = styled.main`
	min-height: calc(100% - 10.8rem);
`;

interface HomeProps {
	data: Option.Root[];
}

const Home = ({ data }: HomeProps) => {
	return (
		<Main className='p-32'>
			<OptionTable data={data} />
		</Main>
	);
};

export default Home;
