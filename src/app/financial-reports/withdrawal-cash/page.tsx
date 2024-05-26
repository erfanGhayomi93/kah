import WithdrawalCashReports from '@/components/pages/FinancialReports/WithdrawalCashReports';
import { type NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <WithdrawalCashReports />;
};

const generateMetadata = () => {
	return {
		title: 'گزارشات برداشت وجه - کهکشان',
	};
};

export { generateMetadata };

export default Page;
