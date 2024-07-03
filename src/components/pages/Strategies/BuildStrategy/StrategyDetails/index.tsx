import Analyze from '@/components/common/Analyze';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useAnalyze, useInputs } from '@/hooks';
import StrategyInfo from './StrategyInfo';

interface StrategyDetailsProps {
	contracts: TSymbolStrategy[];
}

const StrategyDetails = ({ contracts }: StrategyDetailsProps) => {
	const baseSymbolPrice = contracts.length === 0 ? 0 : contracts[0].symbol.baseSymbolPrice;

	const { inputs, setFieldsValue } = useInputs<Pick<IAnalyzeInputs, 'minPrice' | 'maxPrice'>>(
		{
			minPrice: null,
			maxPrice: null,
		},
		true,
	);

	const { data, bep, maxLoss, maxProfit, maxPrice, minPrice, neededRequiredMargin, cost, dueDays, neededBudget } =
		useAnalyze(contracts, {
			baseAssets: baseSymbolPrice,
			maxPrice: inputs.maxPrice,
			minPrice: inputs.minPrice,
			useRequiredMargin: false,
			useStrikeCommission: false,
			useTradeCommission: false,
		});

	return (
		<div style={{ minHeight: '61rem' }} className='flex-1 gap-16 flex-column'>
			<StrategyInfo
				maxLoss={maxLoss}
				maxProfit={maxProfit}
				neededRequiredMargin={neededRequiredMargin}
				neededBudget={neededBudget}
			/>

			<ErrorBoundary>
				<Analyze
					chartData={data}
					dueDays={dueDays}
					contracts={contracts}
					baseAssets={baseSymbolPrice}
					cost={cost}
					bep={bep}
					height={508}
					maxPrice={maxPrice}
					minPrice={minPrice}
					onChange={setFieldsValue}
				/>
			</ErrorBoundary>
		</div>
	);
};

export default StrategyDetails;
