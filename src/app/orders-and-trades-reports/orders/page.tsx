import OrdersReports from '@/components/pages/OrdersTradesReports/OrdersReports';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <OrdersReports />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'گزارشات سفارشات',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
