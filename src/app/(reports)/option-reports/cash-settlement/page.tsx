import CashSettlementReports from '@/components/pages/OptionReports/CashSettlementReports';
import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <CashSettlementReports />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return {
		title: t('cash_settlement_reports'),
	};
};

export { generateMetadata };

export default Page;
