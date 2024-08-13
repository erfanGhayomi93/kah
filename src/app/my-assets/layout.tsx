'use client';

import Main from '@/components/layout/Main';
import Toolbar from '@/components/pages/MyAssets/Toolbar';
import auth from '@/utils/hoc/auth';

const Layout = ({ children }: { children: ReactNode }) => (
	<Main className='gap-8'>
		<Toolbar />
		{children}
	</Main>
);

export default auth(Layout);
