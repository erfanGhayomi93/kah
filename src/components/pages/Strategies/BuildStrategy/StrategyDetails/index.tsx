import Analyze from '@/components/common/Analyze';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import StrategyInfo from './StrategyInfo';

interface StrategyDetailsProps {
	contracts: TSymbolStrategy[];
}

const StrategyDetails = ({ contracts }: StrategyDetailsProps) => {
	const baseSymbolPrice = contracts.length === 0 ? 0 : contracts[0].symbol.baseSymbolPrice;

	return (
		<div style={{ minHeight: '61rem' }} className='flex-1 gap-16 flex-column'>
			<StrategyInfo key='details' />

			<ErrorBoundary>
				<Analyze contracts={contracts} baseAssets={baseSymbolPrice} useCommission />
			</ErrorBoundary>
		</div>
	);
};

export default StrategyDetails;
