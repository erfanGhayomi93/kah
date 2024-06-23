import Analyze from '@/components/common/Analyze';
import Switch from '@/components/common/Inputs/Switch';
import { useAnalyze, useInputs, useLocalstorage } from '@/hooks';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import StrategyInfoItem from './StrategyInfoItem';

interface AnalyzeTabsProps {
	contracts: TSymbolStrategy[];
	baseSymbolPrice: number;
}

const AnalyzeTabs = ({ contracts, baseSymbolPrice }: AnalyzeTabsProps) => {
	const t = useTranslations('analyze_modal');

	const [useCommission, setUseCommission] = useLocalstorage('use_commission', true);

	const { inputs, setFieldsValue } = useInputs<Record<'minPrice' | 'maxPrice', number>>(
		{
			minPrice: 0,
			maxPrice: 0,
		},
		true,
	);

	const { data, bep, maxLoss, maxProfit, maxPrice, minPrice, neededRequiredMargin, neededBudget } = useAnalyze(
		contracts,
		{
			baseAssets: baseSymbolPrice,
			maxPrice: inputs.maxPrice,
			minPrice: inputs.minPrice,
			useCommission: true,
		},
	);

	return (
		<div className='relative h-full rounded px-16 shadow-card flex-column'>
			<Analyze
				chartData={data}
				contracts={contracts}
				baseAssets={baseSymbolPrice}
				bep={bep}
				height={420}
				maxPrice={maxPrice}
				minPrice={minPrice}
				onChange={setFieldsValue}
			/>

			<div className='gap-16 border-t border-t-light-gray-200 pb-24 pt-16 flex-column'>
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

			<div className='absolute left-16 top-8 flex-justify-center'>
				<div className='h-40 gap-8 flex-items-center'>
					<span className='text-tiny font-medium text-light-gray-700'>{t('with_commission')}</span>
					<Switch checked={useCommission} onChange={(v) => setUseCommission(v)} />
				</div>
			</div>
		</div>
	);
};

export default AnalyzeTabs;
