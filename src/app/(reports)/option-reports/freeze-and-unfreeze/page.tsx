import FreezeUnFreezeReports from '@/components/pages/OptionReports/FreezeUnFreezeReports';
import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <FreezeUnFreezeReports />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return {
		title: t('freeze_and_unfreeze_reports'),
	};
};

export { generateMetadata };

export default Page;
