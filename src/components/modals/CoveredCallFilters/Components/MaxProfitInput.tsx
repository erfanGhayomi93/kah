import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import Input, { Prefix } from './Input';

interface MaxProfitInputProps {
	value: ICoveredCallFiltersModalStates['maxProfit'];
	onChange: (v: ICoveredCallFiltersModalStates['maxProfit']) => void;
}

const MaxProfitInput = ({ value, onChange }: MaxProfitInputProps) => {
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
			prefix={<Prefix />}
			maxLength={16}
		/>
	);
};

export default MaxProfitInput;
