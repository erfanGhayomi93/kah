import CashSettlementReports from '@/components/pages/OptionReports/CashSettlementReports';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <CashSettlementReports />;
};

const generateMetadata = () => {
	return {
		title: 'گزارشات تسویه نقدی - کهکشان',
	};
};

export { generateMetadata };

export default Page;
