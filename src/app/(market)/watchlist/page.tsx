import Watchlist from '@/components/pages/Watchlist';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <Watchlist />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'دیده‌بان آپشن',
	});
};

export { generateMetadata };

export default Page;
