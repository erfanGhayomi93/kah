import PriceSlider from '@/components/common/PriceSlider';

interface DeltaInputProps {
	value: IOptionWatchlistFilters['delta'];
	onChange: (value: IOptionWatchlistFilters['delta']) => void;
}

const DeltaInput = ({ value: [fromValue, toValue], onChange }: DeltaInputProps) => {
	const onChangeSlider = (value: number, type: 'start' | 'end') => {
		const formattedValue = Number(valueFormatter(value));

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

	const valueFormatter = (value: number) => value.toFixed(3);

	return (
		<PriceSlider
			step={0.025}
			min={-1}
			max={1}
			onChange={onChangeSlider}
			value={[fromValue, toValue]}
			valueFormatter={valueFormatter}
		/>
	);
};

export default DeltaInput;
