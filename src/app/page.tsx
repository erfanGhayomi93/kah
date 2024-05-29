import Dashboard from '@/components/pages/Dashboard';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = async () => {
	return <Dashboard />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'داشبورد',
	});
};

export { generateMetadata };

export default Page;
