import TradesReports from '@/components/pages/OrdersTradesReports/TradesReports';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <TradesReports />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'گزارشات معاملات',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
