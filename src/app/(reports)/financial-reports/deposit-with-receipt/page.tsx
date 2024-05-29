import DepositWithReceiptReports from '@/components/pages/FinancialReports/DepositWithReceiptReports';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <DepositWithReceiptReports />;
};

const generateMetadata = () => {
	return {
		title: 'گزارشات واریز با فیش - کهکشان',
	};
};

export { generateMetadata };

export default Page;
