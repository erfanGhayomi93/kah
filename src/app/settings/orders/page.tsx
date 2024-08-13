import Orders from '@/components/pages/Settings/tabs/Orders';
import { getMetadata } from '@/metadata';

const Page = () => {
	return <Orders />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'سفارشات',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
