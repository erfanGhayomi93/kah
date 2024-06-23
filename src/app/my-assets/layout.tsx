import Main from '@/components/layout/Main';
import Toolbar from '@/components/pages/MyAssets/Toolbar';
import { getMetadata } from '@/metadata';
import { getTranslations } from 'next-intl/server';

const Layout = ({ children }: { children: ReactNode }) => (
	<Main className='gap-8 !px-8'>
		<Toolbar />
		{children}
	</Main>
);

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('my_assets_stocks'),
	});
};

export { generateMetadata };

export default Layout;
