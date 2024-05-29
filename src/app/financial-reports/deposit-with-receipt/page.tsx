import DepositWithReceiptReports from '@/components/pages/FinancialReports/DepositWithReceiptReports';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <DepositWithReceiptReports />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'گزارشات واریز با فیش',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
