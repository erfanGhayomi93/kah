import OptionChain from '@/components/pages/OldOptionChain';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <OptionChain />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'زنجیره قرارداد (قدیمی)',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
