'use client';

import Analyze from '@/components/common/Analyze';
import { useAppSelector } from '@/features/hooks';
import { getBuiltStrategy } from '@/features/slices/uiSlice';

const StrategyAnalyzer = () => {
	const builtStrategy = useAppSelector(getBuiltStrategy);
	const baseSymbolPrice = builtStrategy.length === 0 ? 0 : builtStrategy[0].symbol.baseSymbolPrice;

	return <Analyze contracts={builtStrategy} baseAssets={baseSymbolPrice} useCommission />;
};

export default StrategyAnalyzer;
