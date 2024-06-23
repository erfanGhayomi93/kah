import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface StrategyInfoProps {
	maxLoss: number;
	maxProfit: number;
	neededRequiredMargin: number;
	neededBudget: number;
}

interface StrategyInfoItemProps {
	type?: 'success' | 'error';
	title: string;
	value: React.ReactNode;
}

const StrategyInfo = ({ maxLoss, maxProfit, neededRequiredMargin, neededBudget }: StrategyInfoProps) => {
	const t = useTranslations('build_strategy');

	return (
		<div className='gap-16 rounded-md bg-light-gray-100 px-24 py-16 flex-column'>
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
	);
};

const StrategyInfoItem = ({ title, value, type }: StrategyInfoItemProps) => (
	<li className='items-start gap-4 flex-items-center'>
		<span style={{ width: '10.6rem' }} className='whitespace-nowrap text-tiny text-light-gray-700'>
			{title}:
		</span>
		<div
			style={{ width: '10.4rem' }}
			className={clsx('h-40 rounded px-8 text-tiny ltr flex-justify-center', {
				'bg-light-gray-300 text-light-gray-700': !type,
				'bg-light-success-100/10 text-light-success-100': type === 'success',
				'bg-light-error-100/10 text-light-error-100': type === 'error',
			})}
		>
			{value}
		</div>
	</li>
);

export default StrategyInfo;
