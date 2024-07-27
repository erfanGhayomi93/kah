import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Badge from './Badge';

interface OptionStepProps {
	status: CreateStrategy.Status;
	bestLimitPrice: number;
	symbolTitle: string;
	className: string;
}

const OptionStep = ({ bestLimitPrice, symbolTitle, status, className }: OptionStepProps) => {
	const t = useTranslations();

	return (
		<li className={className}>
			<h2 className={clsx(status === 'TODO' ? 'text-gray-800 font-medium' : 'text-gray-700')}>
				{t('side.buy') + ' ' + symbolTitle}
			</h2>

			<div className='text-tiny flex-justify-between'>
				<span className='text-gray-700'>{t('create_strategy.best_limit_price')}:</span>
				<div className='text-gray-500 gap-4 ltr flex-items-end'>
					{t('common.rial')}
					<span className='text-gray-800 text-base font-medium'>{sepNumbers(String(bestLimitPrice))}</span>
				</div>
			</div>

			<div className='flex-justify-between'>
				<Badge type={status} />
			</div>
		</li>
	);
};

export default OptionStep;
