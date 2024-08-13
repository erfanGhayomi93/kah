import Orders from '@/components/pages/Settings/tabs/Orders';
import { getMetadata } from '@/metadata';
import auth from '@/utils/hoc/auth';

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

export default auth(Page);
