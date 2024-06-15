import { ChartDownSVG, ChartUpSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
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
				onClick={() => onChangeValue('ATM')}
				className={cn(
					isATM
						? 'border-secondary-300 bg-secondary-300 hover:border-secondary-300/10 hover:bg-secondary-300/80 text-white'
						: 'border-secondary-300 text-secondary-300 hover:bg-secondary-300 border-2 hover:text-white',
				)}
			>
				<span style={{ height: '2px' }} className='w-24 rounded bg-current' />
				{t('option_watchlist_filters_modal.status_atm')}
			</button>
			<button
				type='button'
				onClick={() => onChangeValue('OTM')}
				className={cn(
					isOTM
						? 'border-light-error-100 bg-light-error-100 text-white hover:border-light-error-100/10 hover:bg-light-error-100/80'
						: 'border-2 border-light-error-100 text-light-error-100 hover:bg-light-error-100 hover:text-white',
				)}
			>
				<ChartDownSVG />
				{t('option_watchlist_filters_modal.status_otm')}
			</button>
			<button
				type='button'
				onClick={() => onChangeValue('ITM')}
				className={cn(
					isITM
						? 'border-light-success-100 bg-light-success-100 text-white hover:border-light-success-100/10 hover:bg-light-success-100/80'
						: 'border-2 border-light-success-100 text-light-success-100 hover:bg-light-success-100 hover:text-white',
				)}
			>
				<ChartUpSVG />
				{t('option_watchlist_filters_modal.status_itm')}
			</button>
		</div>
	);
};

export default StatusInput;
