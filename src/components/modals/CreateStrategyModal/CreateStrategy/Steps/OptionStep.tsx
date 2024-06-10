import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Badge from './Badge';
import BestSellLimitPrice from './BestSellLimitPrice';

interface OptionStepProps extends CreateStrategy.IOption {
	className: string;
}

const OptionStep = ({ side, symbolISIN, symbolTitle, status, className }: OptionStepProps) => {
	const t = useTranslations();

	return (
		<li className={className}>
			<h2 className={clsx(status === 'TODO' ? 'font-medium text-gray-1000' : 'text-gray-900')}>
				{t(`side.${side}`) + ' ' + symbolTitle}
			</h2>

			<div className='text-tiny flex-justify-between'>
				<span className='text-gray-900'>{t('create_strategy.best_limit_price')}:</span>
				<div className='gap-4 text-gray-700 ltr flex-items-end'>
					{t('common.rial')}
					<span className='text-base font-medium text-gray-1000'>
						<BestSellLimitPrice
							lsKey={side === 'buy' ? 'bestSellLimitPrice_1' : 'bestBuyLimitPrice_1'}
							symbolISIN={symbolISIN}
							initialValue={0}
						/>
					</span>
				</div>
			</div>

			<div className='flex-justify-between'>
				<Badge type={status} />
			</div>
		</li>
	);
};

export default OptionStep;
