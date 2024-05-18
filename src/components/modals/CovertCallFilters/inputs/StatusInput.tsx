import { ChartDownSVG, ChartUpSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import React from 'react';

const StatusInput = () => {
	const t = useTranslations();

	const condition = false;

	return (
		<div className='gap-8 flex-justify-end *:h-40 *:gap-8 *:rounded *:px-20 *:font-medium *:transition-colors *:flex-justify-center'>
			<button
				type='button'
				onClick={() => {}}
				className={cn(
					condition
						? 'border-secondary-300 bg-secondary-300 text-white hover:border-secondary-300/10 hover:bg-secondary-300/80'
						: 'border border-secondary-300 text-secondary-300 hover:bg-secondary-300 hover:text-white',
				)}
			>
				<span className='h-2 w-20 rounded bg-current' />
				{t('CoveredCall.status_atm')}
			</button>
			<button
				type='button'
				onClick={() => {}}
				className={cn(
					condition
						? 'border-error-100 bg-error-100 text-white hover:border-error-100/10 hover:bg-error-100/80'
						: 'border border-error-100 text-error-100 hover:bg-error-100 hover:text-white',
				)}
			>
				<ChartDownSVG />
				{t('CoveredCall.status_otm')}
			</button>
			<button
				type='button'
				onClick={() => {}}
				className={cn(
					condition
						? 'border-success-100 bg-success-100 text-white hover:border-success-100/10 hover:bg-success-100/80'
						: 'border border-success-100 text-success-100 hover:bg-success-100 hover:text-white',
				)}
			>
				<ChartUpSVG />
				{t('CoveredCall.status_itm')}
			</button>
		</div>
	);
};

export default StatusInput;
