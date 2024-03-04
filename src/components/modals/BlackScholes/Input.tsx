import { cn, convertStringToDecimal, sepNumbers } from '@/utils/helpers';
import React from 'react';

interface InputProps<T extends string | number>
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'placeholder' | 'className' | 'onChange'> {
	onChange: (v: string) => void;
	value: T;
	prefix: string;
	placeholder: React.ReactNode;
}

const Input = <T extends string | number>({ value, placeholder, prefix, onChange, ...props }: InputProps<T>) => {
	const valueFormatter = (value: string) => {
		return sepNumbers(String(value));
	};

	const isActive = value && String(value).length > 0;

	return (
		<label className='relative h-48 rounded flex-items-center input-group'>
			<input
				{...props}
				type='text'
				inputMode='numeric'
				className='h-full flex-1 bg-transparent px-8 text-left ltr'
				value={value ? valueFormatter(String(value)) : ''}
				onChange={(e) => onChange(convertStringToDecimal(e.target.value))}
			/>

			<span className={cn('flexible-placeholder', isActive && 'active')}>{placeholder}</span>

			<fieldset className={cn('flexible-fieldset', isActive && 'active')}>
				<legend>{placeholder}</legend>
			</fieldset>

			<span className='h-24 w-36 border-r border-r-input text-tiny text-gray-700 flex-justify-center'>
				{prefix}
			</span>
		</label>
	);
};

export default Input;
