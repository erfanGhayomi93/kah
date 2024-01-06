import { ChartDownSVG, ChartUpSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface StatusInputProps {
	value: IOptionWatchlistFilters['status'];
	onChange: (value: IOptionWatchlistFilters['status']) => void;
}

const StatusInput = ({ value, onChange }: StatusInputProps) => {
	const t = useTranslations();

	return (
		<div className='flex-1 gap-8 flex-justify-end *:h-40 *:flex-1 *:gap-8 *:rounded *:border-half *:font-medium *:transition-colors *:flex-justify-center'>
			<button
				onClick={() => onChange(value === 'itm' ? null : 'itm')}
				className={clsx(value === 'itm' ? 'border-link bg-link text-white' : 'border-half border-link text-link')}
			>
				<span style={{ height: '2px' }} className='w-24 rounded bg-current' />
				{t('option_watchlist_filters_modal.status_itm')}
			</button>
			<button
				onClick={() => onChange(value === 'otm' ? null : 'otm')}
				className={clsx(
					value === 'otm' ? 'border-error-100 bg-error-100 text-white' : 'border-half border-error-100 text-error-100',
				)}
			>
				<ChartDownSVG />
				{t('option_watchlist_filters_modal.status_otm')}
			</button>
			<button
				onClick={() => onChange(value === 'atm' ? null : 'atm')}
				className={clsx(
					value === 'atm' ? 'border-success-100 bg-success-100 text-white' : 'border-half border-success-100 text-success-100',
				)}
			>
				<ChartUpSVG />
				{t('option_watchlist_filters_modal.status_atm')}
			</button>
		</div>
	);
};

export default StatusInput;
