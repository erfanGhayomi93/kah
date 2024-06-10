import OptionChain from '@/components/pages/OptionChain';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <OptionChain />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('option_chain'),
	});
};

export { generateMetadata };

export default Page;
