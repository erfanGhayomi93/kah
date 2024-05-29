import PhysicalSettlementReports from '@/components/pages/OptionReports/PhysicalSettlementReports';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <PhysicalSettlementReports />;
};

const generateMetadata = () => {
	return getMetadata({
		title: 'گزارشات تسویه فیزیکی',
		robots: {
			follow: false,
			index: false,
		},
	});
};

export { generateMetadata };

export default Page;
