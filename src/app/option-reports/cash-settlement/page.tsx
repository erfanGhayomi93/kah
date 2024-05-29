import CashSettlementReports from '@/components/pages/OptionReports/CashSettlementReports';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <CashSettlementReports />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'گزارشات تسویه نقدی',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
