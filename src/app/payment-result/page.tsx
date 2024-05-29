import PaymentResultPage from '@/components/pages/paymentResultPage';
import { getMetadata } from '@/metadata';

const Page = () => {
	return <PaymentResultPage />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'نتیجه پرداخت',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
