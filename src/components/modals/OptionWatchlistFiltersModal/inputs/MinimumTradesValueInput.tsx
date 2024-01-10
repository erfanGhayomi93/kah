import { convertStringToNumber, sepNumbers, tomanToRial } from '@/utils/helpers';
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
		<div className='flex flex-col gap-4'>
			<div className='input-group h-full flex-1 rounded border border-gray-400 flex-items-center'>
				<input
					type='text'
					inputMode='numeric'
					maxLength={12}
					className='h-40 flex-1 rounded px-8 text-left text-gray-100 ltr'
					value={valueFormatter(value)}
					onChange={(e) => onChange(Number(convertStringToNumber(e.target.value)))}
				/>
				<span className='h-24 w-36 border-r border-r-inherit text-tiny text-gray-200 flex-justify-center'>{t('common.rial')}</span>
			</div>

			<span className='h-16 text-right text-sm text-gray-100'>{tomanToRial(value)}</span>
		</div>
	);
};

export default MinimumTradesValueInput;
