import AnalyzeChart from '@/components/common/Analyze/AnalyzeChart';
import { type IExecuteCoveredCallStrategyModal } from '@/features/slices/types/modalSlice.interfaces';
import { useAnalyze } from '@/hooks';
import { divide, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface StrategyChartDetailsProps
	extends CreateStrategy.CoveredCallInput,
		Pick<IExecuteCoveredCallStrategyModal, 'baseSymbol' | 'option' | 'contractSize'> {}

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
					settlementDay: new Date(option.settlementDay),
					strikePrice: option.strikePrice,
					requiredMargin: option.requiredMargin,
					baseSymbolPrice: baseSymbol.bestLimitPrice,
					historicalVolatility: option.historicalVolatility,
				},
			},
		],
		[basePrice, optionPrice, quantity],
	);

	const { data, maxProfit, maxLoss, baseSymbolStatus, baseAssets, dueDays, income, cost, bep } = useAnalyze(
		contracts,
		{
			minPrice,
			maxPrice,
			baseAssets: basePrice,
			useRequiredMargin: true,
			useTradeCommission: true,
			useStrikeCommission: true,
		},
	);

	return (
		<div style={{ flex: '0 0 18.4rem' }} className='relative flex gap-40 border-y border-gray-200 py-16'>
			<ul
				style={{ flex: '0 0 22rem' }}
				className='justify-between text-gray-700 ltr flex-column *:flex-justify-between'
			>
				<li>
					<span
						className={clsx({
							'font-medium text-success-100': baseSymbolStatus === 'itm',
							'font-medium text-error-100': baseSymbolStatus === 'otm',
							'text-gray-700': baseSymbolStatus === 'atm',
						})}
					>
						{t(baseSymbolStatus)}
					</span>
					<span>:{t('current_status')}</span>
				</li>
				<li>
					<span className='font-medium text-error-100'>
						{maxLoss === -Infinity ? t('infinity') : sepNumbers(String(maxLoss))}
					</span>
					<span>:{t('most_loss')}</span>
				</li>
				<li>
					<span className='font-medium text-success-100'>
						{maxProfit === Infinity ? t('infinity') : sepNumbers(String(maxProfit))}
					</span>
					<span>:{t('most_profit')}</span>
				</li>
			</ul>

			<div className='relative flex-1'>
				<AnalyzeChart
					compact
					dueDays={dueDays}
					data={data}
					cost={cost}
					income={income}
					contractSize={contractSize}
					height={150}
					minPrice={minPrice}
					maxPrice={maxPrice}
					baseAssets={baseAssets}
					bep={bep}
				/>
			</div>
		</div>
	);
};

export default StrategyChartDetails;
