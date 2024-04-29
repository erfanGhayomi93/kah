import Main from '@/components/layout/Main';
import Toolbar from '@/components/pages/Strategies/Toolbar';
import React from 'react';

const Template = ({ children }: { children: React.ReactNode }) => {
	return (
		<Main className='gap-8 !px-8'>
			<Toolbar />
			{children}
		</Main>
	);
};

export default Template;
