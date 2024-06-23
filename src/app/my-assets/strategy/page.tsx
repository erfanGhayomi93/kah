import Strategy from '@/components/pages/MyAssets/Strategy';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <Strategy />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('my_assets_strategy'),
	});
};

export { generateMetadata };

export default Page;
