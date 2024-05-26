import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import Input, { Prefix } from './Input';

interface YTMInputProps {
	value: ICoveredCallFiltersModalStates['ytm'];
	onChange: (v: ICoveredCallFiltersModalStates['ytm']) => void;
}

const YTMInput = ({ value, onChange }: YTMInputProps) => {
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

export default YTMInput;
