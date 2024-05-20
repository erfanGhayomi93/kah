import Strategies from '@/components/pages/Strategies/List';
import StrategiesToolbar from '@/components/pages/Strategies/List/Toolbar';
import StrategyLayout from '@/components/pages/Strategies/StrategyLayout';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = async () => {
	return (
		<StrategyLayout headerRenderer={<StrategiesToolbar />}>
			<div className='relative flex flex-1 flex-wrap content-start gap-y-8 rounded bg-white px-8 py-24'>
				<Strategies />
			</div>
		</StrategyLayout>
	);
};

export default Page;
