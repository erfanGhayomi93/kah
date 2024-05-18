import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Badge from './Badge';

interface BaseSymbolStepProps extends CreateStrategy.IBaseSymbol {
	className: string;
}

const BaseSymbolStep = ({ symbolTitle, className, status }: BaseSymbolStepProps) => {
	const t = useTranslations();

	return (
		<li className={className}>
			<h2 className={clsx(status === 'TODO' ? 'font-medium text-gray-1000' : 'text-gray-900')}>
				{t('create_strategy.base_step_title', { symbolTitle })}
			</h2>

			<div className='text-tiny flex-justify-between'>
				<span className='text-gray-900'>{t('create_strategy.best_limit_price')}:</span>
				<div className='gap-4 text-gray-700 ltr flex-items-end'>
					{t('common.rial')}
					<span className='text-base font-medium text-gray-1000'>{sepNumbers('17025')}</span>
				</div>
			</div>

			<div className='flex-justify-between'>
				<Badge type={status} />
			</div>
		</li>
	);
};

export default BaseSymbolStep;
