import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface StrategyInfoItemProps {
	type?: 'success' | 'error';
	title: string;
	value: React.ReactNode;
}

const StrategyInfo = () => {
	const t = useTranslations('build_strategy');

	return (
		<div className='gap-16 rounded-md bg-gray-200 px-24 py-16 flex-column'>
			<ul className='flex-justify-between'>
				<StrategyInfoItem type='success' title={t('most_profit')} value='+2,075' />
				<StrategyInfoItem title={t('break_even_point')} value={`${sepNumbers(String(0))} (0.1%)`} />
				<StrategyInfoItem title={t('risk')} value='22,509 (0.1%)' />
				<StrategyInfoItem title={t('time_value')} value='22,509 (0.1%)' />
			</ul>

			<ul className='flex-justify-between'>
				<StrategyInfoItem type='error' title={t('most_loss')} value='-2,925' />
				<StrategyInfoItem title={t('required_budget')} value='132,000' />
				<StrategyInfoItem title={t('profit_probability')} value='132,000' />
				<StrategyInfoItem title={t('required_margin')} value='132,000' />
			</ul>
		</div>
	);
};

const StrategyInfoItem = ({ title, value, type }: StrategyInfoItemProps) => {
	return (
		<li className='items-start gap-4 flex-items-center'>
			<span style={{ width: '10.6rem' }} className='whitespace-nowrap text-tiny text-gray-900'>
				{title}:
			</span>
			<div
				style={{ width: '10.4rem' }}
				className={clsx('h-40 rounded px-8 text-tiny ltr flex-justify-end', {
					'bg-gray-300 text-gray-900': !type,
					'bg-success-100/10 text-success-100': type === 'success',
					'bg-error-100/10 text-error-100': type === 'error',
				})}
			>
				{value}
			</div>
		</li>
	);
};

export default StrategyInfo;
