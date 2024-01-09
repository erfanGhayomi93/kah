import { ChartDownSVG, ChartUpSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface StatusInputProps {
	value: IOptionWatchlistFilters['status'];
	onChange: (value: IOptionWatchlistFilters['status']) => void;
}

const StatusInput = ({ value, onChange }: StatusInputProps) => {
	const t = useTranslations();

	const onChangeValue = (v: 'itm' | 'otm' | 'atm') => {
		if (value.includes(v)) onChange(value.filter((val) => val !== v));
		else onChange([...value, v]);
	};

	const isITM = value.includes('itm');

	const isOTM = value.includes('otm');

	const isATM = value.includes('atm');

	return (
		<div className='flex-1 gap-8 flex-justify-end *:h-40 *:flex-1 *:gap-8 *:rounded *:border-2 *:font-medium *:transition-colors *:flex-justify-center'>
			<button
				onClick={() => onChangeValue('itm')}
				className={clsx(isITM ? 'border-link bg-link text-white' : 'border-2 border-link text-link hover:bg-link hover:text-white')}
			>
				<span style={{ height: '2px' }} className='w-24 rounded bg-current' />
				{t('option_watchlist_filters_modal.status_itm')}
			</button>
			<button
				onClick={() => onChangeValue('otm')}
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
				onClick={() => onChangeValue('atm')}
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
