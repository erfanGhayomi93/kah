import Saturn from '@/components/pages/Saturn';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <Saturn />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'زحل',
	});
};

export { generateMetadata };

export default Page;
