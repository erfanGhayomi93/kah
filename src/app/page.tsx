import Dashboard from '@/components/pages/Dashboard';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = async () => {
	return <Dashboard />;
};

const generateMetadata = () => {
	return {
		title: 'داشبورد - کهکشان',
	};
};

export { generateMetadata };

export default Page;
