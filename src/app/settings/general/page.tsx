import General from '@/components/pages/Settings/tabs/General';
import { type NextPage } from 'next';

const Page: NextPage<INextProps> = async () => <General />;

const generateMetadata = () => {
	return {
		title: 'تنظیمات عمومی - کهکشان',
	};
};

export { generateMetadata };

export default Page;
