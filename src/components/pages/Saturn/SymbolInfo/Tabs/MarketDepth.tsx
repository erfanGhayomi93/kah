import SymbolMarketDepth from '@/components/common/Tables/SymbolMarketDepth';
import { InfoSVG } from '@/components/icons';
import Progressbar from '../../common/Progressbar';

interface MarketDepthProps {
	symbol: Symbol.Info;
}

const MarketDepth = ({ symbol }: MarketDepthProps) => {
	const { individualBuyVolume, individualSellVolume, legalBuyVolume, legalSellVolume } = symbol;

	return (
		<div className='relative flex-1 gap-40 flex-column'>
			<SymbolMarketDepth symbolISIN={symbol.symbolISIN} />

			<div style={{ gap: '8.8rem' }} className='relative w-full items-center flex-justify-between'>
				<Progressbar side='buy' individualVolume={individualBuyVolume} legalVolume={legalBuyVolume} />
				<div className='absolute left-1/2 -translate-x-1/2 transform pt-24'>
					<button
						type='button'
						style={{ minWidth: '2.4rem', minHeight: '2.4rem' }}
						className='rounded-sm border border-gray-500 bg-gray-200 text-gray-1000 flex-justify-center'
					>
						<InfoSVG width='1.6rem' height='1.6rem' />
					</button>
				</div>
				<Progressbar side='sell' individualVolume={individualSellVolume} legalVolume={legalSellVolume} />
			</div>
		</div>
	);
};

export default MarketDepth;
