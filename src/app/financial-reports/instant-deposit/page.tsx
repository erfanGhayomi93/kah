import InstantDepositReports from '@/components/pages/FinancialReports/InstantDepositReports';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <InstantDepositReports />;
};

const generateMetadata = () => {
	return {
		title: 'گزارشات واریز آنی - کهکشان',
	};
};

export { generateMetadata };

export default Page;
