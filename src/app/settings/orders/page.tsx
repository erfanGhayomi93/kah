import Orders from '@/components/pages/Settings/tabs/Orders';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
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
