import Authorize from '@/components/pages/Authorize';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = async () => {
	return <Authorize />;
};

const generateMetadata = () => {
	return {
		title: 'احراز هویت کارگزاری - کهکشان',
		robots: 'noindex,nofollow',
	};
};

export { generateMetadata };

export default Page;
