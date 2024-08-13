import Agreements from '@/components/pages/Settings/tabs/Agreements';
import { getMetadata } from '@/metadata';
import { getTranslations } from 'next-intl/server';

const Page = () => {
	return <Agreements />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('agreement'),
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
