'use client';

import Main from '@/components/layout/Main';
import CreateNewStrategy from './CreateNewStrategy';
import Strategies from './Strategies';
import StrategyAnalyzer from './StrategyAnalyzer';
import StrategyInformation from './StrategyInformation';
import SymbolSearch from './SymbolSearch';

const Analyze = () => {
	return (
		<Main className='!flex-row gap-8 !pl-8 !pr-8'>
			<div style={{ flex: '1 1 52%' }} className='gap-8 flex-column'>
				<SymbolSearch />
				<CreateNewStrategy />
				<Strategies />
			</div>
			<div style={{ flex: '1 1 48%' }} className='gap-8 flex-column'>
				<StrategyInformation />
				<StrategyAnalyzer />
			</div>
		</Main>
	);
};

export default Analyze;
