import SymbolPriceTable from '@/components/common/Tables/SymbolPriceTable';
import { MoreOptionsSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';

interface MarketDepthProps {
	symbol: Symbol.Info;
}

const MarketDepth = ({ symbol }: MarketDepthProps) => {
	const t = useTranslations();

	return (
		<div style={{ flex: '0 0 calc(50% - 1.8rem)' }} className='items-end gap-12 flex-column'>
			<div className='gap-8 flex-items-center'>
				<button type='button' className='h-32 w-96 rounded btn-error-outline'>
					{t('side.sell')}
				</button>

				<button type='button' className='h-32 w-96 rounded btn-success-outline'>
					{t('side.buy')}
				</button>

				<button type='button' className='text-gray-1000 size-24'>
					<MoreOptionsSVG width='2.4rem' height='2.4rem' />
				</button>
			</div>

			<div className='w-full gap-16 pl-16 flex-column'>
				<ul className='flex gap-8 border-b border-gray-500'>
					<li>
						<button type='button' className='text-gray-1000 px-8 py-12 font-medium'>
							{t('saturn.market_depth')}
						</button>
					</li>
					<li>
						<button type='button' className='text-gray-900 px-8 py-12'>
							{t('saturn.chart')}
						</button>
					</li>
					<li>
						<button type='button' className='text-gray-900 px-8 py-12'>
							{t('saturn.my_asset')}
						</button>
					</li>
				</ul>

				<SymbolPriceTable symbolISIN={symbol.symbolISIN} />
			</div>
		</div>
	);
};

export default MarketDepth;
