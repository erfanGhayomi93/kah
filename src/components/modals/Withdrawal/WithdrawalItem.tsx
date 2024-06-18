import Radiobox from '@/components/common/Inputs/Radiobox';
import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

interface WithdrawalItemProps {
	date: number;
	amount: string;
	valid: boolean;
	checked: boolean;
	onChecked: () => void;
}

export const WithdrawalItem = ({ date, valid, amount, checked, onChecked }: WithdrawalItemProps) => {
	const t = useTranslations();

	const getPersianDate = useCallback((value: number) => {
		const weekdays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
		const d = dayjs(value).calendar('jalali').locale('fa');

		const weekdayName = weekdays[d.weekday()];

		return weekdayName + ' - ' + d.format('DD MMMM');
	}, []);

	return (
		<li
			className={clsx('flex items-center justify-between rounded-sm p-8 text-base', {
				'text-light-gray-800 bg-light-secondary-200': checked,
				'opacity-50': !valid,
			})}
		>
			<Radiobox
				onChange={onChecked}
				label={getPersianDate(date)}
				checked={checked}
				classes={{
					label: clsx('text-light-gray-800 text-base', checked && 'font-medium'),
					text: '!text-light-gray-800',
				}}
			/>
			<span
				tabIndex={-1}
				role='button'
				className={clsx('text-light-gray-800 flex-1 text-left text-base', checked && 'font-medium')}
				onClick={onChecked}
			>
				{t('withdrawal_modal.up_to', { n: Number(amount) < 0 ? '0' : sepNumbers(String(amount)) })}
			</span>
		</li>
	);
};
