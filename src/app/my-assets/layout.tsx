import Main from '@/components/layout/Main';
import Toolbar from '@/components/pages/MyAssets/Toolbar';

const Layout = ({ children }: { children: ReactNode }) => (
	<Main className='gap-8'>
		<Toolbar />
		{children}
	</Main>
);

export default Layout;
