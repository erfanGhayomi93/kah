import { convertStringToInteger, copyNumberToClipboard, isBetween, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';

interface TotalTradeValueInputProps {
	value: number;
	setToMinimum: () => void;
	onChange: (value: number) => void;
}

const TotalTradeValueInput = ({ value, setToMinimum, onChange }: TotalTradeValueInputProps) => {
	const t = useTranslations('bs_modal');

	const setInputValue = (v: number) => {
		if (isBetween(0, v, Number.MAX_SAFE_INTEGER)) onChange(v);
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
		<div className='flex h-64 items-start'>
			<label className='relative h-48 w-full flex-1 rounded bg-white flex-items-center input-group'>
				<input
					onCopy={(e) => copyNumberToClipboard(e, Number(value))}
					type='text'
					inputMode='numeric'
					value={!value ? '' : sepNumbers(String(value))}
					onChange={onChangeValue}
					className='h-full flex-1 border-0 bg-transparent px-8 text-left ltr'
				/>

				<span className={clsx('flexible-placeholder', value && 'active')}>{t('trade_value_label')}</span>

				<fieldset className={clsx('flexible-fieldset', value && 'active')}>
					<legend>{t('trade_value_label')}</legend>
				</fieldset>

				<div className='flex-items-center'>
					<span className='w-1 h-16 bg-light-gray-200' />
					<button onClick={setToMinimum} type='button' className='h-full px-8 text-tiny text-light-gray-500'>
						{t('minimum_amount')}
					</button>
				</div>
			</label>
		</div>
	);
};

export default TotalTradeValueInput;
