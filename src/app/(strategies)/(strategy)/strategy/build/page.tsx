import StrategyAnalyzer from '@/components/pages/Strategies/BuildStrategy/StrategyAnalyzer';
import StrategyContracts from '@/components/pages/Strategies/BuildStrategy/StrategyContracts';
import StrategyDetails from '@/components/pages/Strategies/BuildStrategy/StrategyDetails';
import StrategyLayout from '@/components/pages/Strategies/StrategyLayout';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = () => {
	return (
		<StrategyLayout isBuilding>
			<div className='flex-1 gap-16 rounded bg-white p-24 flex-column'>
				<div
					style={{ flex: '0.77', minHeight: '47rem' }}
					className='relative rounded-md border border-gray-500'
				>
					<StrategyContracts />
				</div>

				<div style={{ flex: '1', minHeight: '61rem' }} className='gap-16 flex-column'>
					<StrategyDetails />
					<StrategyAnalyzer />
				</div>
			</div>
		</StrategyLayout>
	);
};

const generateMetadata = () => {
	return {
		title: 'ساخت استراتژی - کهکشان',
	};
};

export { generateMetadata };

export default Page;
