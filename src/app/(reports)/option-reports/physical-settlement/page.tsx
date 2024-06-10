import PhysicalSettlementReports from '@/components/pages/OptionReports/PhysicalSettlementReports';
import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <PhysicalSettlementReports />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return {
		title: t('physical_settlement_reports'),
	};
};

export { generateMetadata };

export default Page;
