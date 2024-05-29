import Transactions from '@/components/pages/FinancialReports/Transactions';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <Transactions />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'گردش حساب',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
