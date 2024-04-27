'use client';

import Main from '@/components/layout/Main';
import Strategies from './Strategies';
import Toolbar from './Toolbar';

const Strategy = () => {
	return (
		<Main className='gap-8 !px-8'>
			<Toolbar />
			<Strategies />
		</Main>
	);
};

export default Strategy;
