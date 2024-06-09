import General from '@/components/pages/Settings/tabs/General';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <General />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('general'),
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
