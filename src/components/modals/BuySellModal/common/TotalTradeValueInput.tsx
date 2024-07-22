import RangeSlider from '@/components/common/Slider/RangeSlider';
import { convertStringToInteger, copyNumberToClipboard, isBetween, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';

interface TotalTradeValueInputProps {
	value: number;
	purchasePower: null | number;
	setToMinimum: undefined | (() => void);
	onChange: (value: number) => void;
}

const TotalTradeValueInput = ({ value, purchasePower, setToMinimum, onChange }: TotalTradeValueInputProps) => {
	const t = useTranslations();

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
		<div className='gap-4 pb-16 flex-column'>
			<label className='relative w-full flex-48 rounded bg-white flex-items-center input-group'>
				<input
					onCopy={(e) => copyNumberToClipboard(e, Number(value))}
					type='text'
					inputMode='numeric'
					value={!value ? '' : sepNumbers(String(value))}
					onChange={onChangeValue}
					className='h-full flex-1 border-0 bg-transparent px-8 text-left ltr'
				/>

				<span className={clsx('flexible-placeholder', value && 'active')}>
					{t('bs_modal.trade_value_label')}
				</span>

				<fieldset className={clsx('flexible-fieldset', value && 'active')}>
					<legend>{t('bs_modal.trade_value_label')}</legend>
				</fieldset>

				{setToMinimum && (
					<div className='flex-items-center'>
						<span className='h-16 w-1 bg-light-gray-200' />
						<button
							onClick={setToMinimum}
							type='button'
							className='h-full px-8 text-tiny text-light-gray-500'
						>
							{t('bs_modal.minimum_amount')}
						</button>
					</div>
				)}
			</label>

			{purchasePower !== null && (
				<div className='gap-4 flex-column'>
					<span className='text-tiny flex-justify-between'>
						<span className='text-light-gray-700'>{t('bs_modal.purchase_power')}:</span>

						<span>
							<span className='font-medium text-light-gray-800'>{sepNumbers(String(purchasePower))}</span>
							<span className='text-light-gray-700'>{' ' + t('common.rial')}</span>
						</span>
					</span>

					<RangeSlider
						disabled={purchasePower === 0}
						max={purchasePower}
						value={value}
						onChange={(value) => onChange(value)}
					/>
				</div>
			)}
		</div>
	);
};

export default TotalTradeValueInput;
