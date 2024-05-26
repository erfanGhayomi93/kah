import { cn, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';

interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'placeholder' | 'className' | 'onChange'> {
	onChange: (v: string) => void;
	value: string | number;
	prefix?: string;
	placeholder: React.ReactNode;
	separator?: boolean;
	valueSeparator?: boolean;
}

const InputLegend = ({
	value,
	valueSeparator = true,
	placeholder,
	prefix,
	separator = true,
	onChange,
	...props
}: InputProps) => {
	const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		const element = e.target;
		const value = element.value;

		onChange(value);
	};

	const isActive = value && String(value).length > 0;

	return (
		<label className='relative h-48 rounded flex-items-center input-group'>
			<input
				{...props}
				type='text'
				inputMode='numeric'
				className='h-full flex-1 bg-transparent px-8 text-left ltr'
				value={valueSeparator ? sepNumbers(String(value)) : value}
				onChange={onChangeValue}
			/>

			<span className={cn('flexible-placeholder', isActive && 'active')}>{placeholder}</span>

			<fieldset className={cn('flexible-fieldset', isActive && 'active')}>
				<legend>{placeholder}</legend>
			</fieldset>

			{prefix && (
				<span
					className={clsx(
						'h-24 px-8 text-tiny text-gray-700 flex-justify-center',
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
