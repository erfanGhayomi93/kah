import WithdrawalCashReports from '@/components/pages/FinancialReports/WithdrawalCashReports';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <WithdrawalCashReports />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'گزارشات برداشت وجه',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
