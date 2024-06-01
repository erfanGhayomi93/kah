import BuildStrategy from '@/components/pages/Strategies/BuildStrategy';
import StrategyLayout from '@/components/pages/Strategies/StrategyLayout';
import { getMetadata } from '@/metadata';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => (
	<StrategyLayout isBuilding>
		<BuildStrategy />
	</StrategyLayout>
);

const generateMetadata = () => {
	return getMetadata({
		title: 'ساخت استراتژی',
	});
};

export { generateMetadata };

export default Page;
