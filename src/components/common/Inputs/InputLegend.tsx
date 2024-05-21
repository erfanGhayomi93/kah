import { cn, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';

interface InputLegendProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'placeholder' | 'onChange'> {
	onChange: (v: string) => void;
	value: string | number | null;
	prefix?: string;
	placeholder: React.ReactNode;
	separator?: boolean;
	valueSeparator?: boolean;
	inputPlaceholder?: string;
	autoTranslateLegend?: boolean;
}

const InputLegend = ({
	value,
	valueSeparator = true,
	placeholder,
	prefix,
	separator = true,
	autoTranslateLegend = false,
	inputPlaceholder,
	onChange,
	...props
}: InputLegendProps) => {
	const isActive = autoTranslateLegend || (value && String(value).length > 0);

	return (
		<label className='relative h-48 rounded flex-items-center input-group'>
			<input
				placeholder={inputPlaceholder}
				type='text'
				inputMode='numeric'
				className='h-full flex-1 bg-transparent px-8 text-left ltr'
				value={value === null ? '' : valueSeparator ? sepNumbers(String(value)) : value}
				onChange={(e) => onChange(e.target.value)}
				{...props}
			/>

			<span className={cn('flexible-placeholder', isActive && 'active')}>{placeholder}</span>

			<fieldset className={cn('flexible-fieldset', isActive && 'active')}>
				<legend>{placeholder}</legend>
			</fieldset>

			{prefix && (
				<span
					className={clsx(
						'h-24 w-36 text-tiny text-gray-700 flex-justify-center',
						separator && 'border-r border-r-input',
					)}
				>
					{prefix}
				</span>
			)}
		</label>
	);
};

export default InputLegend;
