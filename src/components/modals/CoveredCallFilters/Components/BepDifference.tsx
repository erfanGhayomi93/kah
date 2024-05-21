import { PercentSVG } from '@/components/icons';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import Input from './Input';

interface BepDifferenceProps {
	value: ICoveredCallFiltersModalStates['bepDifference'];
	onChange: (v: ICoveredCallFiltersModalStates['bepDifference']) => void;
}

const BepDifference = ({ value, onChange }: BepDifferenceProps) => {
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
			maxLength={16}
			prefix={
				<div className='h-32 cursor-default select-none pl-8 flex-items-center'>
					<span className='h-16 w-2 bg-gray-500' />
					<span className='size-32 text-gray-700 flex-justify-center'>
						<PercentSVG width='1.4rem' height='1.4rem' />
					</span>
				</div>
			}
		/>
	);
};

export default BepDifference;
