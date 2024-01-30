import { ChartDownSVG, ChartUpSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface StatusInputProps {
	value: IOptionWatchlistFilters['status'];
	onChange: (value: IOptionWatchlistFilters['status']) => void;
}

const StatusInput = ({ value, onChange }: StatusInputProps) => {
	const t = useTranslations();

	const onChangeValue = (v: 'ITM' | 'OTM' | 'ATM') => {
		if (value.includes(v)) onChange(value.filter((val) => val !== v));
		else onChange([...value, v]);
	};

	const isITM = value.includes('ITM');

	const isOTM = value.includes('OTM');

	const isATM = value.includes('ATM');

	return (
		<div className='flex-1 gap-8 flex-justify-end *:h-40 *:flex-1 *:gap-8 *:rounded *:border-2 *:font-medium *:transition-colors *:flex-justify-center'>
			<button
				type='button'
				onClick={() => onChangeValue('ITM')}
				className={clsx(
					isITM
						? 'border-link bg-link text-white'
						: 'border-2 border-link text-primary-400 hover:bg-link hover:text-white',
				)}
			>
				<span style={{ height: '2px' }} className='w-24 rounded bg-current' />
				{t('option_watchlist_filters_modal.status_itm')}
			</button>
			<button
				type='button'
				onClick={() => onChangeValue('OTM')}
				className={clsx(
					isOTM
						? 'border-error-100 bg-error-100 text-white'
						: 'border-2 border-error-100 text-error-100 hover:bg-error-100 hover:text-white',
				)}
			>
				<ChartDownSVG />
				{t('option_watchlist_filters_modal.status_otm')}
			</button>
			<button
				type='button'
				onClick={() => onChangeValue('ATM')}
				className={clsx(
					isATM
						? 'border-success-100 bg-success-100 text-white'
						: 'border-2 border-success-100 text-success-100 hover:bg-success-100 hover:text-white',
				)}
			>
				<ChartUpSVG />
				{t('option_watchlist_filters_modal.status_atm')}
			</button>
		</div>
	);
};

export default StatusInput;
