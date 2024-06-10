import InstantDepositReports from '@/components/pages/FinancialReports/InstantDepositReports';
import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <InstantDepositReports />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return {
		title: t('instant_deposit_reposts'),
	};
};

export { generateMetadata };

export default Page;
