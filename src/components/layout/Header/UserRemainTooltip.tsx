import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React from 'react';

interface UserRemainTooltipProps {
	data: Broker.Remain;
}

interface ValueProps {
	className: string;
	children: React.ReactNode;
}

const UserRemainTooltip = ({ data }: UserRemainTooltipProps) => {
	const t = useTranslations('header');

	return (
		<div style={{ width: '264px' }} className='rounded-md bg-white p-16 shadow-sm darkness:bg-gray-50'>
			<ul className='gap-16 flex-column *:h-20 *:text-tiny *:text-gray-700 *:flex-justify-between'>
				<li>
					<span>{t('t1_remain')}:</span>
					<Value className='text-success-100'>{sepNumbers(String(data?.remainT1 ?? 0))}</Value>
				</li>
				<li>
					<span>{t('t2_remain')}:</span>
					<Value className='text-success-100'>{sepNumbers(String(data?.remainT2 ?? 0))}</Value>
				</li>
				<li>
					<span>{t('blocked_amount')}:</span>
					<Value className='text-gray-800'>{sepNumbers(String(data?.blockValue ?? 0))}</Value>
				</li>
				<li>
					<span>{t('amount')}:</span>
					<Value className='text-gray-800'>{sepNumbers(String(data?.credit ?? 0))}</Value>
				</li>
			</ul>
		</div>
	);
};

const Value = ({ children, className }: ValueProps) => {
	const t = useTranslations('common');
	return (
		<div className='gap-4 flex-items-center'>
			<span className={clsx('font-medium', className)}>{children}</span>
			<span>{t('rial')}</span>
		</div>
	);
};

export default UserRemainTooltip;
