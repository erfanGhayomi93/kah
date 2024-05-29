import Transactions from '@/components/pages/FinancialReports/Transactions';
import { type NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <Transactions />;
};

const generateMetadata = () => {
	return {
		title: ' گردش حساب - کهکشان',
	};
};

export { generateMetadata };

export default Page;
