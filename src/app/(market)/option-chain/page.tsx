import OptionChain from '@/components/pages/OptionChain';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <OptionChain />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'زنجیره قرارداد',
	});
};

export { generateMetadata };

export default Page;
