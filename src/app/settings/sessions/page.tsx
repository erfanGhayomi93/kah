import Sessions from '@/components/pages/Settings/tabs/Sessions';
import { getMetadata } from '@/metadata';
import { getTranslations } from 'next-intl/server';

const Page = () => {
	return <Sessions />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('sessions'),
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
