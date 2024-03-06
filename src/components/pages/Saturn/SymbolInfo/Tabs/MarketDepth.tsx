import SymbolPriceTable from '@/components/common/Tables/SymbolPriceTable';
import { InfoSVG } from '@/components/icons';
import ProgressBar from '../../common/ProgressBar';

interface MarketDepthProps {
	symbol: Symbol.Info;
}

const MarketDepth = ({ symbol }: MarketDepthProps) => {
	const { individualBuyVolume, individualSellVolume, legalBuyVolume, legalSellVolume } = symbol;

	return (
		<div className='gap-40 flex-column'>
			<SymbolPriceTable symbolISIN={symbol.symbolISIN} />

			<div style={{ gap: '8.8rem' }} className='relative w-full items-center flex-justify-between'>
				<ProgressBar side='buy' individualVolume={individualBuyVolume} legalVolume={legalBuyVolume} />
				<div className='absolute left-1/2 -translate-x-1/2 transform pt-24'>
					<button
						type='button'
						style={{ minWidth: '2.4rem', minHeight: '2.4rem' }}
						className='rounded-sm border border-gray-500 bg-gray-200 text-gray-1000 flex-justify-center'
					>
						<InfoSVG width='1.6rem' height='1.6rem' />
					</button>
				</div>
				<ProgressBar side='sell' individualVolume={individualSellVolume} legalVolume={legalSellVolume} />
			</div>
		</div>
	);
};

export default MarketDepth;
