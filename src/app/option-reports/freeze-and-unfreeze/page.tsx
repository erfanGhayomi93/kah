import FreezeUnFreezeReports from '@/components/pages/OptionReports/FreezeUnFreezeReports';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <FreezeUnFreezeReports />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'گزارشات فریز و رفع فریز',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
