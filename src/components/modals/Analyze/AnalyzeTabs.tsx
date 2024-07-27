import Analyze from '@/components/common/Analyze';
import Switch from '@/components/common/Inputs/Switch';
import { useAnalyze, useInputs, useLocalstorage } from '@/hooks';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import StrategyInfoItem from './StrategyInfoItem';

interface UseSwitchProps {
	title: string;
	checked: boolean;
	onChange: (v: boolean) => void;
}

interface AnalyzeTabsProps {
	contracts: TSymbolStrategy[];
	baseSymbolPrice: number;
}

const AnalyzeTabs = ({ contracts, baseSymbolPrice }: AnalyzeTabsProps) => {
	const t = useTranslations('analyze_modal');

	const [useTradeCommission, setUseTradeCommission] = useLocalstorage('use_trade_commission', true);

	const [useStrikeCommission, setUseStrikeCommission] = useLocalstorage('use_strike_commission', true);

	const [useRequiredMargin, setUseRequiredMargin] = useLocalstorage('use_required_margin', true);

	const { inputs, setFieldsValue } = useInputs<Record<'dueDays' | 'minPrice' | 'maxPrice', number | null>>(
		{
			minPrice: null,
			maxPrice: null,
			dueDays: null,
		},
		true,
	);

	const {
		data,
		bep,
		maxLoss,
		maxProfit,
		maxPrice,
		minPrice,
		contractSize,
		neededRequiredMargin,
		neededBudget,
		dueDays,
		cost,
		baseAssets,
		income,
	} = useAnalyze(contracts, {
		baseAssets: baseSymbolPrice,
		maxPrice: inputs.maxPrice,
		minPrice: inputs.minPrice,
		dueDays: inputs.dueDays,
		useTradeCommission,
		useStrikeCommission,
		useRequiredMargin,
	});

	return (
		<div className='relative h-full gap-16 rounded px-16 shadow-card flex-column'>
			<Analyze
				contractSize={contractSize}
				cost={cost}
				dueDays={dueDays}
				chartData={data}
				contracts={contracts}
				baseAssets={baseAssets}
				bep={bep}
				income={income}
				height={420}
				maxPrice={maxPrice}
				minPrice={minPrice}
				onChange={setFieldsValue}
			/>

			<div className='border-t-gray-200 gap-16 border-t pb-24 pt-16 flex-column'>
				<ul className='flex-justify-between'>
					<StrategyInfoItem
						type='success'
						title={t('most_profit')}
						value={maxProfit === Infinity ? t('infinity') : sepNumbers(String(maxProfit))}
					/>
					<StrategyInfoItem
						type='error'
						title={t('most_loss')}
						value={maxLoss === -Infinity ? t('infinity') : sepNumbers(String(maxLoss))}
					/>
					<StrategyInfoItem title={t('required_budget')} value={sepNumbers(String(neededBudget))} />
					<StrategyInfoItem title={t('required_margin')} value={sepNumbers(String(neededRequiredMargin))} />
				</ul>
			</div>

			<div className='absolute left-16 top-8 gap-16 flex-justify-end'>
				<span className='text-gray-700 text-tiny'>{t('with_calculation')}:</span>

				<div className='gap-24 flex-items-center'>
					<UseSwitch
						title={t('with_trade_commission')}
						checked={useTradeCommission}
						onChange={setUseTradeCommission}
					/>
					<UseSwitch
						title={t('with_strike_commission')}
						checked={useStrikeCommission}
						onChange={setUseStrikeCommission}
					/>
					<UseSwitch
						title={t('with_required_margin')}
						checked={useRequiredMargin}
						onChange={setUseRequiredMargin}
					/>
				</div>
			</div>
		</div>
	);
};

const UseSwitch = ({ title, checked, onChange }: UseSwitchProps) => (
	<div className='h-40 gap-8 flex-items-center'>
		<span className='text-gray-700 text-tiny font-medium'>{title}</span>
		<Switch checked={checked} onChange={onChange} />
	</div>
);

export default AnalyzeTabs;
