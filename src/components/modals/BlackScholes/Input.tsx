import { cn, convertStringToDecimal, sepNumbers } from '@/utils/helpers';
import React from 'react';

interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'placeholder' | 'className' | 'onChange'> {
	onChange: (v: string) => void;
	value: string;
	prefix: string;
	placeholder: React.ReactNode;
}

const Input = ({ value, placeholder, prefix, onChange, ...props }: InputProps) => {
	const valueFormatter = (value: string) => {
		return sepNumbers(String(value));
	};

	return (
		<label className='relative h-48 rounded border border-input flex-items-center input-group'>
			<input
				{...props}
				type='text'
				inputMode='numeric'
				maxLength={25}
				className='h-full flex-1 bg-transparent px-8 text-left ltr'
				value={value ? valueFormatter(value) : ''}
				onChange={(e) => onChange(convertStringToDecimal(e.target.value))}
			/>

			<span className={cn('flexible-placeholder', value && String(value).length > 0 && 'active')}>
				{placeholder}
			</span>

			<span className='h-24 w-36 border-r border-r-input text-tiny text-gray-700 flex-justify-center'>
				{prefix}
			</span>
		</label>
	);
};

export default Input;
