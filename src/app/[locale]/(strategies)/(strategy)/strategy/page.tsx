import Strategies from '@/components/pages/Strategies/List';
import StrategyLayout from '@/components/pages/Strategies/StrategyLayout';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const StrategiesToolbar = dynamic(() => import('@/components/pages/Strategies/List/Toolbar'));

const Page: NextPage<INextProps> = async () => {
	return (
		<StrategyLayout headerRenderer={() => <StrategiesToolbar />}>
			<div className='relative flex flex-1 flex-wrap content-start gap-y-8 rounded bg-white px-8 py-24'>
				<Strategies />
			</div>
		</StrategyLayout>
	);
};

export default Page;
