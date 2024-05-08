import { cn, convertStringToInteger, sepNumbers } from '@/utils/helpers';
import React from 'react';

interface InputProps<T extends string | number>
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'placeholder' | 'className' | 'onChange'> {
	onChange: (v: string) => void;
	value: T;
	prefix: string;
	placeholder: React.ReactNode;
}

const InputLegend = <T extends string | number>({ value, placeholder, prefix, onChange, ...props }: InputProps<T>) => {
	const valueFormatter = (value: number | string) => {
		if (!value) return '';
		return sepNumbers(String(value));
	};

	const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		const element = e.target;
		const value = element.value;
		const valueAsNumber = Number(convertStringToInteger(value));

		if (valueAsNumber >= Number.MAX_SAFE_INTEGER) return;
		onChange(String(valueAsNumber));

		try {
			const caret = element.selectionStart;

			if (caret && caret !== value.length) {
				const diffLength = valueFormatter(valueAsNumber).length - value.length;
				window.requestAnimationFrame(() => {
					element.selectionStart = caret + diffLength;
					element.selectionEnd = caret + diffLength;
				});
			}
		} catch (e) {
			//
		}
	};

	const isActive = value && String(value).length > 0;

	return (
		<label className='relative h-48 flex-1 rounded flex-items-center input-group'>
			<input
				{...props}
				type='text'
				inputMode='numeric'
				className='h-full flex-1 bg-transparent px-8 text-left ltr'
				value={valueFormatter(value)}
				onChange={onChangeValue}
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

export default InputLegend;
