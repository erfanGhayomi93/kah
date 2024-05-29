import Agreements from '@/components/pages/Settings/tabs/Agreements';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <Agreements />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'توافق‌نامه‌ها',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
