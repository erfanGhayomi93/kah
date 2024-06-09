import ChangeBrokerReports from '@/components/pages/ChangeBrokerReports';
import { type NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <ChangeBrokerReports />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return {
		title: t('change_broker_reports'),
	};
};

export { generateMetadata };

export default Page;
