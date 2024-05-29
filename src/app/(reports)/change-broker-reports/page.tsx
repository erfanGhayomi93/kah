import ChangeBrokerReports from '@/components/pages/ChangeBrokerReports';
import { type NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <ChangeBrokerReports />;
};

const generateMetadata = () => {
	return {
		title: 'گزارشات تغییر کارگزار ناظر - کهکشان',
	};
};

export { generateMetadata };

export default Page;
