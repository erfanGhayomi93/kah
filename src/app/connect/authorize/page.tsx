import Authorize from '@/components/pages/Authorize';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <Authorize />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'احراز هویت کارگزاری',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
