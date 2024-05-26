import Orders from '@/components/pages/Settings/tabs/Orders';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <Orders />;
};

const generateMetadata = () => {
	return {
		title: 'سفارشات - کهکشان',
	};
};

export { generateMetadata };

export default Page;
