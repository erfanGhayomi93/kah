import AnalyzeChart from '@/components/common/Analyze/AnalyzeChart';
import { type ICreateStrategyModal } from '@/features/slices/types/modalSlice.interfaces';
import { useAnalyze } from '@/hooks';
import { divide, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface StrategyChartDetailsProps
	extends CreateStrategy.CoveredCallInput,
		Pick<ICreateStrategyModal, 'baseSymbol' | 'option' | 'contractSize'> {}

const StrategyChartDetails = ({
	quantity,
	basePrice,
	optionPrice,
	baseSymbol,
	option,
	contractSize,
}: StrategyChartDetailsProps) => {
	const t = useTranslations('create_strategy');

	const minPrice = Math.floor(basePrice * 0.5);
	const maxPrice = Math.ceil(basePrice * 1.5);

	const contracts = useMemo<TSymbolStrategy[]>(
		() => [
			{
				id: 'base',
				type: 'base',
				side: 'buy',
				price: basePrice,
				quantity,
				marketUnit: baseSymbol.marketUnit,
				symbol: {
					symbolTitle: baseSymbol.symbolTitle,
					symbolISIN: baseSymbol.symbolISIN,
					baseSymbolPrice: basePrice,
				},
			},
			{
				id: 'option',
				type: 'option',
				price: optionPrice,
				contractSize,
				marketUnit: option.marketUnit,
				quantity: Math.floor(divide(quantity, contractSize)),
				settlementDay: option.settlementDay,
				strikePrice: option.strikePrice,
				side: 'sell',
				symbol: {
					symbolTitle: option.symbolTitle,
					symbolISIN: option.symbolISIN,
					optionType: 'call',
					baseSymbolPrice: baseSymbol.bestLimitPrice,
					historicalVolatility: option.historicalVolatility,
				},
			},
		],
		[basePrice, optionPrice, quantity],
	);

	const { data } = useAnalyze(contracts, {
		minPrice,
		maxPrice,
		baseAssets: basePrice,
	});

	return (
		<div style={{ flex: '0 0 18.4rem' }} className='relative flex gap-40 border-y border-light-gray-200 py-16'>
			<ul
				style={{ flex: '0 0 22rem' }}
				className='justify-between text-light-gray-700 ltr flex-column *:flex-justify-between'
			>
				<li>
					<span className='font-medium text-light-success-100'>{t('profit')}</span>
					<span>:{t('current_status')}</span>
				</li>
				<li>
					<span className='font-medium'>{sepNumbers('22509')}</span>
					<span>:{t('bep')}</span>
				</li>
				<li>
					<span className='font-medium'>(-{sepNumbers('2925')})</span>
					<span>:{t('most_loss')}</span>
				</li>
				<li>
					<span className='font-medium text-light-success-100'>({sepNumbers('2075')})</span>
					<span>:{t('most_profit')}</span>
				</li>
			</ul>

			<div className='relative flex-1'>
				<AnalyzeChart
					removeBorders
					data={data}
					minPrice={minPrice}
					maxPrice={maxPrice}
					baseAssets={basePrice}
				/>
			</div>
		</div>
	);
};

export default StrategyChartDetails;
