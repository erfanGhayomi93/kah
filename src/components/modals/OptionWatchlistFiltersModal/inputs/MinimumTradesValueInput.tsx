import { convertStringToNumber, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface MinimumTradesValueInputProps {
	value: IOptionWatchlistFilters['minimumTradesValue'];
	onChange: (value: IOptionWatchlistFilters['minimumTradesValue']) => void;
}

const MinimumTradesValueInput = ({ value, onChange }: MinimumTradesValueInputProps) => {
	const t = useTranslations();

	const valueFormatter = (value: number): string => {
		if (value < 0) return '';
		return sepNumbers(String(value));
	};

	return (
		<div className='h-full flex-1 rounded border border-gray-400 flex-items-center'>
			<input
				type='text'
				inputMode='numeric'
				maxLength={12}
				className='h-40 w-full rounded px-8 text-left text-gray-100 ltr'
				value={valueFormatter(value)}
				onChange={(e) => onChange(Number(convertStringToNumber(e.target.value)))}
			/>
			<span className='h-24 w-36 border-r border-r-gray-400 text-tiny text-gray-200 flex-justify-center'>{t('common.rial')}</span>
		</div>
	);
};

export default MinimumTradesValueInput;
