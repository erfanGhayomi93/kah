import Main from '@/components/layout/Main';
import MarketMap from '@/components/pages/MarketMap';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return (
		<Main className='rounded-md !px-8'>
			<MarketMap />
		</Main>
	);
};

const generateMetadata = () => {
	return getMetadata({
		title: 'نقشه بازار - کهکشان',
	});
};

export { generateMetadata };

export default Page;
