import History from '@/components/pages/Settings/tabs/History';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <History />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'سابقه ورود و خروج',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
