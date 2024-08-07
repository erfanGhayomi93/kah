import { ArrowDownSVG, ArrowUpSVG } from '@/components/icons';
import { convertStringToInteger, copyNumberToClipboard, isBetween, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import React, { forwardRef, useMemo } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'prefix'> {
	value: number;
	label: string;
	tickSize: number;
	min?: number;
	max?: number;
	low: number;
	high: number;
	prefix?: React.ReactElement;
	hasError?: boolean;
	onChange: (value: number) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{ value, label, prefix, low, high, tickSize, hasError = false, min = 0, max = 1e12, onChange, ...inputProps },
		ref,
	) => {
		const setInputValue = (v: number) => {
			if (isBetween(min, v, Math.min(max, Number.MAX_SAFE_INTEGER))) onChange(v);
		};

		const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
			const element = e.target;
			const value = element.value;

			setInputValue(Number(convertStringToInteger(value)));

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
			<div
				className={clsx(
					'flex h-48 items-center overflow-hidden rounded bg-white input-group darkness:bg-gray-50',
					hasError && 'error',
				)}
			>
				<label className='relative size-full flex-1 flex-items-center'>
					<input
						{...inputProps}
						ref={ref}
						onCopy={(e) => copyNumberToClipboard(e, value)}
						type='text'
						inputMode='numeric'
						value={valueFormatter}
						onChange={onChangeValue}
						className='h-full flex-1 border-0 bg-transparent px-8 text-left ltr'
					/>

					<span className={clsx('flexible-placeholder', valueFormatter && 'active')}>{label}</span>

					<fieldset className={clsx('flexible-fieldset', valueFormatter && 'active')}>
						<legend>{label}</legend>
					</fieldset>

					<div
						style={{ flex: '0 0 12rem' }}
						className={clsx('h-full bg-gray-100 py-4 pr-8 flex-justify-between', prefix ? 'pl-8' : 'pl-16')}
					>
						<div className='flex-column flex-justify-between'>
							<button
								type='button'
								className='size-16 text-gray-700 flex-justify-center'
								onClick={() => setInputValue(value + tickSize)}
							>
								<ArrowUpSVG width='1.4rem' height='1.4rem' />
							</button>
							<button
								type='button'
								className='size-16 text-gray-700 flex-justify-center'
								onClick={() => setInputValue(value - tickSize)}
							>
								<ArrowDownSVG width='1.4rem' height='1.4rem' />
							</button>
						</div>

						<div className='gap-8 flex-items-center'>
							<div className='flex-1 flex-column flex-justify-between *:flex *:h-16 *:w-56 *:justify-end *:text-left *:text-tiny *:text-gray-700'>
								<button type='button' className='items-end' onClick={() => setInputValue(high)}>
									{sepNumbers(String(high))}
								</button>

								<button type='button' className='items-start' onClick={() => setInputValue(low)}>
									{sepNumbers(String(low))}
								</button>
							</div>

							{prefix}
						</div>
					</div>
				</label>
			</div>
		);
	},
);

export default Input;
