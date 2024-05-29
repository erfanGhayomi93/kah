import MarketMap from '@/components/pages/MarketMap';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <MarketMap />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'نقشه بازار',
	});
};

export { generateMetadata };

export default Page;
