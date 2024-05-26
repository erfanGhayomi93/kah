import Agreements from '@/components/pages/Settings/tabs/Agreements';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <Agreements />;
};

const generateMetadata = () => {
	return {
		title: 'توافق‌نامه‌ها - کهکشان',
	};
};

export { generateMetadata };

export default Page;
