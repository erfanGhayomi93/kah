import Transactions from '@/components/pages/FinancialReports/Transactions';
import { type NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <Transactions />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return {
		title: t('transaction'),
	};
};

export { generateMetadata };

export default Page;
