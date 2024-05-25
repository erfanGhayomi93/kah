import History from '@/components/pages/Settings/tabs/History';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = async () => <History />;

const generateMetadata = () => {
	return {
		title: 'سابقه ورود و خروج - کهکشان',
	};
};

export { generateMetadata };

export default Page;
