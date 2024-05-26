import Saturn from '@/components/pages/Saturn';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <Saturn />;
};

const generateMetadata = () => {
	return {
		title: 'زحل - کهکشان',
	};
};

export { generateMetadata };

export default Page;
