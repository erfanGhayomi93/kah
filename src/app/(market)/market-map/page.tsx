import MarketMap from '@/components/pages/MarketMap';

const Page = () => {
	return <MarketMap />;
};

const generateMetadata = () => {
	return {
		title: 'نقشه بازار - کهکشان',
	};
};

export { generateMetadata };

export default Page;
