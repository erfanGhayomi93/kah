import PaymentResultPage from '@/components/pages/paymentResultPage';
import { getMetadata } from '@/metadata';
import { getTranslations } from 'next-intl/server';

const Page = () => {
	return <PaymentResultPage />;
};

const generateMetadata = async () => {
	const t = await getTranslations('meta_title');

	return getMetadata({
		title: t('payment_result'),
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
