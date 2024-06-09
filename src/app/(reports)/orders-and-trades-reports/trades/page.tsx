import TradesReports from '@/components/pages/OrdersTradesReports/TradesReports';
import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

const Page: NextPage<INextProps> = () => {
	return <TradesReports />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return {
		title: t('trades_reports'),
	};
};

export { generateMetadata };

export default Page;
