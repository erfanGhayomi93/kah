import InstantDepositReports from '@/components/pages/FinancialReports/InstantDepositReports';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <InstantDepositReports />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'گزارشات واریز آنی',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
