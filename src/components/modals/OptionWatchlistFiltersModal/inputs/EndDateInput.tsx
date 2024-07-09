import InputLegend from '@/components/common/Inputs/InputLegend';
import { convertStringToInteger } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface EndDateInputProps {
	value: IOptionWatchlistFilters['dueDays'];
	onChange: (value: IOptionWatchlistFilters['dueDays']) => void;
}

const EndDateInput = ({ value: [fromEndDate, toEndDate], onChange }: EndDateInputProps) => {
	const t = useTranslations('option_watchlist_filters_modal');

	return (
		<>
			<InputLegend
				value={fromEndDate}
				onChange={(v) => {
					const valueAsNumber = Number(convertStringToInteger(v));
					onChange([valueAsNumber, toEndDate]);
				}}
				placeholder={t('from')}
				className='size-full bg-transparent px-8 text-center ltr placeholder:text-center'
				autoTranslateLegend
			/>

			<InputLegend
				value={toEndDate}
				onChange={(v) => {
					const valueAsNumber = Number(convertStringToInteger(v));
					onChange([fromEndDate, valueAsNumber]);
				}}
				placeholder={t('to')}
				className='size-full bg-transparent px-8 text-center ltr placeholder:text-center'
				autoTranslateLegend
			/>
		</>
	);
};

export default EndDateInput;
