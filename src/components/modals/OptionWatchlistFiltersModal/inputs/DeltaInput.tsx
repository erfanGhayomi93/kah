import PriceSlider from '@/components/common/PriceSlider';
import clsx from 'clsx';

interface DeltaInputProps {
	value: IOptionWatchlistFilters['delta'];
	onChange: (value: IOptionWatchlistFilters['delta']) => void;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	borderClass?: ClassesValue;
}

const Input = ({ borderClass, ...props }: InputProps) => (
	<input
		type='text'
		inputMode='decimal'
		maxLength={12}
		className={clsx(
			'h-40 w-full rounded border px-8 text-left text-gray-1000 ltr',
			borderClass || 'border-gray-500',
		)}
		{...props}
	/>
);

const DeltaInput = ({ value: [fromValue, toValue], onChange }: DeltaInputProps) => {
	return <PriceSlider min={-1} max={1} onChange={console.log} value={[-0.5, 0.5]} />;
};

export default DeltaInput;
