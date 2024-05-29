import OrdersReports from '@/components/pages/OrdersTradesReports/OrdersReports';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <OrdersReports />;
};

const generateMetadata = () => {
	return {
		title: 'گزارشات سفارشات - کهکشان',
	};
};

export { generateMetadata };

export default Page;
