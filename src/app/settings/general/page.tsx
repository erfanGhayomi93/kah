import General from '@/components/pages/Settings/tabs/General';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <General />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'تنظیمات عمومی',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
