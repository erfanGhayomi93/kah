import TradesReports from '@/components/pages/OrdersTradesReports/TradesReports';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <TradesReports />;
};

const generateMetadata = () => {
	return {
		title: 'گزارشات معاملات - کهکشان',
	};
};

export { generateMetadata };

export default Page;
