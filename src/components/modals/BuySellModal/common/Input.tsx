import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
	value: number;
	label: string;
	prepend?: React.ReactElement;
	onChange: (value: number) => void;
}

const Input = ({ value, label, prepend, onChange, ...inputProps }: InputProps) => {
	const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		const valueAsNumber = Number(convertStringToInteger(e.target.value));
		if (valueAsNumber >= Number.MAX_SAFE_INTEGER) return;

		onChange(valueAsNumber);
	};

	const onCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();

		try {
			e.clipboardData.setData('text/plain', String(value));
		} catch (e) {
			//
		}
	};

	const valueFormatter = (value: number) => {
		if (!value) return '';
		return sepNumbers(String(value));
	};

	return (
		<div className='flex h-40 items-center gap-8'>
			<div className='size-full overflow-hidden flex-items-center gray-box'>
				<span className='pr-8 text-base text-gray-900'>{label}</span>
				<input
					{...inputProps}
					onCopy={onCopy}
					type='text'
					maxLength={19}
					inputMode='numeric'
					value={valueFormatter(value)}
					onChange={onChangeValue}
					className='h-full flex-1 px-8 text-left ltr'
				/>
			</div>

			{prepend}
		</div>
	);
};

export default Input;
