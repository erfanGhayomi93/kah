import FreezeUnFreezeReports from '@/components/pages/OptionReports/FreezeUnFreezeReports';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <FreezeUnFreezeReports />;
};

const generateMetadata = () => {
	return {
		title: 'گزارشات فریز و رفع فریز - کهکشان',
	};
};

export { generateMetadata };

export default Page;
