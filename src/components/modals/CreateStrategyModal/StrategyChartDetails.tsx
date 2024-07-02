import AnalyzeChart from '@/components/common/Analyze/AnalyzeChart';
import { type ICreateStrategyModal } from '@/features/slices/types/modalSlice.interfaces';
import { useAnalyze } from '@/hooks';
import { divide, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
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
					contractSize,
				},
			},
			{
				id: 'option',
				type: 'option',
				price: optionPrice,
				marketUnit: option.marketUnit,
				quantity: Math.floor(divide(quantity, contractSize)),
				side: 'sell',
				symbol: {
					symbolTitle: option.symbolTitle,
					symbolISIN: option.symbolISIN,
					optionType: 'call',
					contractSize,
					settlementDay: option.settlementDay,
					strikePrice: option.strikePrice,
					requiredMargin: option.requiredMargin,
					baseSymbolPrice: baseSymbol.bestLimitPrice,
					historicalVolatility: option.historicalVolatility,
				},
			},
		],
		[basePrice, optionPrice, quantity],
	);

	const { data, maxProfit, maxLoss, baseSymbolStatus, neededRequiredMargin, cost, bep } = useAnalyze(contracts, {
		minPrice,
		maxPrice,
		baseAssets: basePrice,
		useRequiredMargin: true,
		useTradeCommission: true,
		useStrikeCommission: true,
	});

	return (
		<div style={{ flex: '0 0 18.4rem' }} className='relative flex gap-40 border-y border-light-gray-200 py-16'>
			<ul
				style={{ flex: '0 0 22rem' }}
				className='justify-between text-light-gray-700 ltr flex-column *:flex-justify-between'
			>
				<li>
					<span
						className={clsx({
							'font-medium text-light-success-100': baseSymbolStatus === 'itm',
							'font-medium text-light-error-100': baseSymbolStatus === 'otm',
							'text-light-gray-700': baseSymbolStatus === 'atm',
						})}
					>
						{t(baseSymbolStatus)}
					</span>
					<span>:{t('current_status')}</span>
				</li>
				<li>
					<span className='font-medium text-light-error-100'>
						{maxLoss === -Infinity ? t('infinity') : sepNumbers(String(maxLoss))}
					</span>
					<span>:{t('most_loss')}</span>
				</li>
				<li>
					<span className='font-medium text-light-success-100'>
						{maxProfit === Infinity ? t('infinity') : sepNumbers(String(maxProfit))}
					</span>
					<span>:{t('most_profit')}</span>
				</li>
				<li>
					<span className='font-medium text-light-gray-700'>{sepNumbers(String(neededRequiredMargin))}</span>
					<span>:{t('required_margin')}</span>
				</li>
			</ul>

			<div className='relative flex-1'>
				<AnalyzeChart
					compact
					data={data}
					cost={cost}
					height={150}
					minPrice={minPrice}
					maxPrice={maxPrice}
					baseAssets={basePrice}
					bep={bep}
				/>
			</div>
		</div>
	);
};

export default StrategyChartDetails;
