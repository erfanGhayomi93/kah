import Main from '@/components/layout/Main';
import Toolbar from '@/components/pages/Strategy/Toolbar';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<Main className='gap-8 !px-8'>
			<Toolbar />
			{children}
		</Main>
	);
};

export default layout;
