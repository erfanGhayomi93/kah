import Position from '@/components/pages/MyAssets/Position';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <Position />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('my_assets_position'),
	});
};

export { generateMetadata };

export default Page;
