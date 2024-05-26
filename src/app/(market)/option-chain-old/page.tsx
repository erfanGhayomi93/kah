import OptionChain from '@/components/pages/OldOptionChain';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <OptionChain />;
};

const generateMetadata = () => {
	return {
		title: 'زنجیره قرارداد (قدیمی) - کهکشان',
	};
};

export { generateMetadata };

export default Page;
