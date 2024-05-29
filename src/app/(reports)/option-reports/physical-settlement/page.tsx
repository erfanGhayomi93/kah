import PhysicalSettlementReports from '@/components/pages/OptionReports/PhysicalSettlementReports';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return <PhysicalSettlementReports />;
};

const generateMetadata = () => {
	return {
		title: 'گزارشات تسویه فیزیکی - کهکشان',
	};
};

export { generateMetadata };

export default Page;
