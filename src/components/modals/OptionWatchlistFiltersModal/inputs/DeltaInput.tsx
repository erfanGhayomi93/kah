import PriceSlider from '@/components/common/PriceSlider';

interface DeltaInputProps {
	value: IOptionWatchlistFilters['delta'];
	onChange: (value: IOptionWatchlistFilters['delta']) => void;
}

const DeltaInput = ({ value: [fromValue, toValue], onChange }: DeltaInputProps) => {
	const onChangeSlider = (value: number, type: 'start' | 'end') => {
		const formattedValue = Number(value.toFixed(3));

		onChange(
			type === 'start'
				? formattedValue > toValue
					? [toValue, formattedValue]
					: [formattedValue, toValue]
				: formattedValue < fromValue
					? [formattedValue, fromValue]
					: [fromValue, formattedValue],
		);
	};

	return (
		<PriceSlider
			labels={['-1', '0', '1']}
			step={0.05}
			min={-1}
			max={1}
			onChange={onChangeSlider}
			value={[fromValue, toValue]}
		/>
	);
};

export default DeltaInput;
