import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import num2persian from '@/utils/num2persian';
import { useTranslations } from 'next-intl';

interface MinimumTradesValueInputProps {
	value: IOptionWatchlistFilters['minimumTradesValue'];
	onChange: (value: IOptionWatchlistFilters['minimumTradesValue']) => void;
}

const MinimumTradesValueInput = ({ value, onChange }: MinimumTradesValueInputProps) => {
	const t = useTranslations();

	const valueFormatter = (value: string) => {
		return sepNumbers(String(value));
	};

	return (
		<div className='relative flex w-full flex-col gap-4'>
			<div className='border-gray-200 h-full flex-1 rounded border flex-items-center input-group'>
				<input
					type='text'
					inputMode='numeric'
					maxLength={25}
					className='h-full flex-1 rounded bg-transparent px-8 text-left ltr'
					value={valueFormatter(value)}
					onChange={(e) => onChange(convertStringToInteger(e.target.value))}
				/>
				<span className='border-r-gray-200 text-gray-500 h-24 w-36 border-r text-tiny flex-justify-center'>
					{t('common.rial')}
				</span>
			</div>

			<span style={{ top: '4.8rem' }} className='text-gray-800 absolute h-16 text-right text-sm'>
				{Number(value) > 0 && num2persian(String(value))}
			</span>
		</div>
	);
};

export default MinimumTradesValueInput;
