import { convertStringToInteger, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
	value: number;
	label: string;
	prepend?: React.ReactElement;
	onChange: (value: number) => void;
}

const Input = ({ value, label, prepend, onChange, ...inputProps }: InputProps) => {
	const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		const element = e.target;
		const value = element.value;
		const valueAsNumber = Number(convertStringToInteger(value));

		if (valueAsNumber >= Number.MAX_SAFE_INTEGER) return;
		onChange(valueAsNumber);

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
					onCopy={(e) => copyNumberToClipboard(e, value)}
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
