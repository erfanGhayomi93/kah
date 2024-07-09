import Main from '@/components/layout/Main';
import MarketMap from '@/components/pages/MarketMap';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return (
		<Main className='rounded-md'>
			<MarketMap />
		</Main>
	);
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('market_map'),
	});
};

export { generateMetadata };

export default Page;
