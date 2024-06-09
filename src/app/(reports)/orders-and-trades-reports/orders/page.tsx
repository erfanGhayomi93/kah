import OrdersReports from '@/components/pages/OrdersTradesReports/OrdersReports';
import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <OrdersReports />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return {
		title: t('orders_reports'),
	};
};

export { generateMetadata };

export default Page;
