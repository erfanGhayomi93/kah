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
			<div className='h-full flex-1 rounded border border-light-gray-200 flex-items-center input-group'>
				<input
					type='text'
					inputMode='numeric'
					maxLength={25}
					className='h-full flex-1 rounded bg-transparent px-8 text-left ltr'
					value={valueFormatter(value)}
					onChange={(e) => onChange(convertStringToInteger(e.target.value))}
				/>
				<span className='h-24 w-36 border-r border-r-light-gray-200 text-tiny text-light-gray-500 flex-justify-center'>
					{t('common.rial')}
				</span>
			</div>

			<span style={{ top: '4.8rem' }} className='absolute h-16 text-right text-sm text-light-gray-800'>
				{Number(value) > 0 && num2persian(String(value))}
			</span>
		</div>
	);
};

export default MinimumTradesValueInput;
