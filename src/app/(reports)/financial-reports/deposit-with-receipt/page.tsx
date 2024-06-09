import DepositWithReceiptReports from '@/components/pages/FinancialReports/DepositWithReceiptReports';
import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <DepositWithReceiptReports />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return {
		title: t('deposit_with_receipt_reports'),
	};
};

export { generateMetadata };

export default Page;
