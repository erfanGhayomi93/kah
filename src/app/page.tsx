import Dashboard from '@/components/pages/Dashboard';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = async () => {
	return <Dashboard />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('dashboard'),
	});
};

export { generateMetadata };

export default Page;
