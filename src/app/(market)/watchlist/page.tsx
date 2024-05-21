import Watchlist from '@/components/pages/Watchlist';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = async () => {
	return <Watchlist />;
};

const generateMetadata = () => {
	return {
		title: 'دیده‌بان آپشن - کهکشان',
	};
};

export { generateMetadata };

export default Page;
