import PriceSlider from '@/components/common/PriceSlider';

interface EndDateInputProps {
	value: IOptionWatchlistFilters['dueDays'];
	onChange: (value: IOptionWatchlistFilters['dueDays']) => void;
}

const EndDateInput = ({ value: [fromEndDate, toEndDate], onChange }: EndDateInputProps) => {
	const onChangeSlider = (value: number, type: 'start' | 'end') => {
		const formattedValue = Math.round(Number(value.toFixed(3)));

		onChange(
			type === 'start'
				? formattedValue > toEndDate
					? [toEndDate, formattedValue]
					: [formattedValue, toEndDate]
				: formattedValue < fromEndDate
					? [formattedValue, fromEndDate]
					: [fromEndDate, formattedValue],
		);
	};

	const valueFormatter = (value: number) => String(Math.round(Number(value.toFixed(3))));

	return (
		<PriceSlider
			min={0}
			max={365}
			onChange={onChangeSlider}
			value={[fromEndDate, toEndDate]}
			valueFormatter={valueFormatter}
		/>
	);
};

export default EndDateInput;
