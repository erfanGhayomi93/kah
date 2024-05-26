import MarketMap from '@/components/pages/MarketMap';
import { type NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <MarketMap />;
};

const generateMetadata = () => {
	return {
		title: 'نقشه بازار - کهکشان',
	};
};

export { generateMetadata };

export default Page;
