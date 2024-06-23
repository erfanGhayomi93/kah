import Stocks from '@/components/pages/MyAssets/Stocks';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <Stocks />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('my_assets_stocks'),
	});
};

export { generateMetadata };

export default Page;
