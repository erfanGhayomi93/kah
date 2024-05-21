import { PercentSVG } from '@/components/icons';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import Input from './Input';

interface MaxProfitInputProps {
	value: ICoveredCallFiltersModalStates['maxProfit'];
	onChange: (v: ICoveredCallFiltersModalStates['maxProfit']) => void;
}

const MaxProfitInput = ({ value, onChange }: MaxProfitInputProps) => {
	const t = useTranslations('common');

	const onChangeValue = (newValue: string) => {
		const v = convertStringToInteger(newValue);

		if (v === '') onChange(null);
		else onChange(Number(v));
	};

	return (
		<Input
			type='text'
			value={value === null ? '' : sepNumbers(String(value))}
			onChange={(e) => onChangeValue(e.target.value)}
			prefix={
				<div className='h-32 cursor-default select-none gap-8 pl-8 flex-items-center'>
					<span className='h-16 w-2 bg-gray-500' />
					<span className='no-hover size-32 rounded !border-0 text-tiny btn-select'>{t('rial')}</span>
					<span className='size-32 text-gray-700 flex-justify-center'>
						<PercentSVG width='1.4rem' height='1.4rem' />
					</span>
				</div>
			}
			maxLength={16}
		/>
	);
};

export default MaxProfitInput;
