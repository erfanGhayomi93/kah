import InputLegend from '@/components/common/Inputs/InputLegend';
import { type NStrategyFilter } from '@/features/slices/types/modalSlice.interfaces';
import { convertStringToInteger } from '@/utils/helpers';
import PercentPrefix from './PercentPrefix';

type TValue = [number | null, number | null];

interface RangeNumberProps extends NStrategyFilter.IRangeNumber {
	value: TValue;
	onChange: (v: TValue) => void;
}

const RangeNumber = ({ value, label, placeholder, type, onChange, initialValue, ...item }: RangeNumberProps) => {
	return (
		<>
			<InputLegend
				{...item}
				value={value[0] === null ? '' : value[0]}
				onChange={(v) => {
					const valueAsNumber = convertStringToInteger(v);
					onChange([valueAsNumber === '' ? null : Number(valueAsNumber), value[1]]);
				}}
				placeholder={label ? label[0] : undefined}
				inputPlaceholder={placeholder ? placeholder[0] : undefined}
				className='size-full bg-transparent px-8 text-center ltr placeholder:text-center'
				prefix={type === 'percent' ? <PercentPrefix /> : undefined}
				autoTranslateLegend
			/>

			<InputLegend
				{...item}
				value={value[1] === null ? '' : value[1]}
				onChange={(v) => {
					const valueAsNumber = convertStringToInteger(v);
					onChange([value[0], valueAsNumber === '' ? null : Number(valueAsNumber)]);
				}}
				placeholder={label ? label[1] : undefined}
				inputPlaceholder={placeholder ? placeholder[1] : undefined}
				className='size-full bg-transparent px-8 text-center ltr placeholder:text-center'
				prefix={type === 'percent' ? <PercentPrefix /> : undefined}
				autoTranslateLegend
			/>
		</>
	);
};

export default RangeNumber;
