import ChangeBrokerReports from '@/components/pages/ChangeBrokerReports';
import { getMetadata } from '@/metadata';
import { type NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <ChangeBrokerReports />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'گزارشات تغییر کارگزار ناظر',
		robots: {
			index: false,
			follow: false,
		},
	});
};

export { generateMetadata };

export default Page;
