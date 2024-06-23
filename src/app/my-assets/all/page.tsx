import AllAssets from '@/components/pages/MyAssets/AllAssets';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <AllAssets />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('my_assets_all'),
	});
};

export { generateMetadata };

export default Page;
