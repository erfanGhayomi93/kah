import OptionChain from '@/components/pages/OptionChain';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = async () => {
	return <OptionChain />;
};

const generateMetadata = () => {
	return {
		title: 'زنجیره قرارداد - کهکشان',
	};
};

export { generateMetadata };

export default Page;
