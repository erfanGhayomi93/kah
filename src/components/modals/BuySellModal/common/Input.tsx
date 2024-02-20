import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import React from 'react';

interface InputProps {
	value: number;
	label: string;
	prepend?: React.ReactElement;
	onChange: (value: number) => void;
}

const Input = ({ value, label, prepend, onChange }: InputProps) => {
	const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		const valueAsNumber = Number(convertStringToInteger(e.target.value));
		if (valueAsNumber >= Number.MAX_SAFE_INTEGER) return;

		onChange(valueAsNumber);
	};

	return (
		<div className='flex h-40 items-center gap-8'>
			<div className='size-full overflow-hidden rounded border border-gray-500 bg-white flex-items-center'>
				<span className='pr-8 text-base text-gray-900'>{label}</span>
				<input
					type='text'
					maxLength={19}
					inputMode='numeric'
					value={sepNumbers(String(value))}
					onChange={onChangeValue}
					className='h-full flex-1 px-8 text-left ltr'
				/>
			</div>

			{prepend}
		</div>
	);
};

export default Input;
