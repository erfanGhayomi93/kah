import { cn, convertStringToInteger, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import React, { useMemo } from 'react';

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
				const diffLength = valueFormatter.length - value.length;
				window.requestAnimationFrame(() => {
					element.selectionStart = caret + diffLength;
					element.selectionEnd = caret + diffLength;
				});
			}
		} catch (e) {
			//
		}
	};

	const valueFormatter = useMemo(() => {
		if (!value) return '';
		return sepNumbers(String(value));
	}, [value]);

	return (
		<div className='flex h-40 items-center gap-8'>
			<label className='relative size-full rounded bg-white flex-items-center input-group'>
				<input
					{...inputProps}
					onCopy={(e) => copyNumberToClipboard(e, value)}
					type='text'
					maxLength={19}
					inputMode='numeric'
					value={valueFormatter}
					onChange={onChangeValue}
					className='h-full flex-1 border-0 bg-transparent px-8 text-left ltr'
				/>

				<span className={cn('flexible-placeholder', valueFormatter && 'active')}>{label}</span>

				<fieldset className={cn('flexible-fieldset', valueFormatter && 'active')}>
					<legend>{label}</legend>
				</fieldset>
			</label>

			{prepend}
		</div>
	);
};

export default Input;
