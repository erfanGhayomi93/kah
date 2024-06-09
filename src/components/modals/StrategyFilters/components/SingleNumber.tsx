import InputLegend from '@/components/common/Inputs/InputLegend';
import { type NStrategyFilter } from '@/features/slices/types/modalSlice.interfaces';
import { convertStringToInteger } from '@/utils/helpers';
import PercentPrefix from './PercentPrefix';

type TValue = number | null;

interface SingleNumberProps extends NStrategyFilter.ISingleNumber {
	value: TValue;
	onChange: (v: TValue) => void;
}

const SingleNumber = ({ value, placeholder, label, type, initialValue, onChange }: SingleNumberProps) => {
	return (
		<InputLegend
			value={value === null ? '' : value}
			onChange={(v) => {
				const valueAsNumber = convertStringToInteger(v);
				onChange(valueAsNumber === '' ? null : Number(valueAsNumber));
			}}
			placeholder={label}
			inputPlaceholder={placeholder}
			maxLength={16}
			className='size-full bg-transparent px-8 text-left ltr placeholder:text-right'
			autoTranslateLegend
			prefix={type === 'percent' ? <PercentPrefix /> : undefined}
		/>
	);
};

export default SingleNumber;
