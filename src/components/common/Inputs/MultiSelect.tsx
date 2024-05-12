/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ArrowDownSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useLayoutEffect, useState } from 'react';
import Popup from '../Popup';
import styles from './Select.module.scss';

interface SelectProps<T> {
	clearable?: boolean;
	defaultValues?: T[] | null;
	placeholder?: string | React.ReactNode;
	defaultOpen?: boolean;
	defaultPopupWidth?: number;
	options: T[];
	loading?: boolean;
	disabled?: boolean;
	classes?: RecordClasses<
		| 'root'
		| 'focus'
		| 'disabled'
		| 'box'
		| 'list'
		| 'alert'
		| 'border'
		| 'listItem'
		| 'value'
		| 'placeholder'
		| 'icon'
		| 'active'
	>;
	getOptionId: (option: T) => string | number;
	getOptionTitle: (option: T) => React.ReactNode;
	getInputValue?: (option: T) => React.ReactNode;
	onChange: (option: T[]) => void;
}

const MultiSelect = <T, _D = T>({
	defaultValues,
	options,
	classes,
	loading,
	disabled,
	defaultPopupWidth,
	placeholder,
	defaultOpen,
	getOptionId,
	getOptionTitle,
	onChange,
}: SelectProps<T>) => {
	const t = useTranslations();

	const [values, setValues] = useState<T[]>(defaultValues ?? []);

	const [focusing, setFocusing] = useState(false);

	const onChangeValue = (v: T) => {
		// @ts-expect-error
		const optionIndex = values.findIndex((item) => item.id === v.id);

		if (optionIndex === -1) {
			setValues((prev) => [...prev, v]);
			onChange([...values, v]);
		} else {
			setValues((prev) => {
				const spliceValue = prev.splice(optionIndex, 1);
				// @ts-expect-error
				return [...prev].filter((value) => value.id !== spliceValue.id);
			});
			onChange([...values]);
		}
	};

	useLayoutEffect(() => {
		setValues(defaultValues ?? []);
	}, [defaultValues]);

	return (
		<Popup
			zIndex={9999}
			defaultPopupWidth={defaultPopupWidth}
			defaultOpen={defaultOpen}
			disabled={disabled}
			onOpen={() => setFocusing(true)}
			onClose={() => setFocusing(false)}
			renderer={({ setOpen }) => {
				if (!Array.isArray(options) || options.length === 0)
					return (
						<div className={clsx(styles.alert, classes?.alert)}>
							<span>{t('common.no_data')}</span>
						</div>
					);

				return (
					<div className={clsx(styles.box, classes?.box)}>
						<ul className={clsx(styles.list, classes?.list)}>
							{options.map((option) => (
								<li
									onClick={(e) => {
										onChangeValue(option);
										// setOpen(false);
									}}
									key={getOptionId(option)}
									className={clsx(
										styles.listItem,
										classes?.listItem,
										// @ts-expect-error
										values.some((value) => value.id === getOptionId(option)) && [
											styles.active,
											classes?.active,
										],
									)}
								>
									{getOptionTitle(option)}
								</li>
							))}
						</ul>
					</div>
				);
			}}
		>
			{({ setOpen, open }) => (
				<div
					onClick={() => setOpen(!open)}
					className={clsx(
						'input-group',
						styles.root,
						classes?.root,
						!placeholder && [styles.border, classes?.border],
						disabled ? ['disabled', styles.disabled, classes?.disabled] : styles.clickable,
						focusing && ['focus', styles.focus, classes?.focus],
					)}
				>
					{values && (
						<span className={clsx(styles.value, classes?.value)}>
							{values.length === 0 && !placeholder ? (
								placeholder
							) : (
								<ul className='flex items-center gap-2'>
									{values.map((value, index, array) => (
										<li className='rounded-md bg-primary-300 px-8 py-2 text-gray-200' key={index}>
											{getOptionTitle(value)}
										</li>
									))}
								</ul>
							)}
						</span>
					)}

					{placeholder && (
						<>
							<span
								className={clsx(
									'flexible-placeholder',
									values.length !== 0 && 'active',
									open && 'colorful',
								)}
							>
								{placeholder}
							</span>
							<fieldset
								className={clsx('flexible-fieldset', placeholder && values.length !== 0 && 'active')}
							>
								<legend>{placeholder}</legend>
							</fieldset>
						</>
					)}

					{loading ? (
						<div className='!absolute left-8 min-h-20 min-w-20 spinner' />
					) : (
						<button
							type='button'
							style={{ transform: open ? 'rotate(180deg)' : undefined }}
							className={clsx(styles.icon, classes?.icon)}
							onClick={() => setOpen(!open)}
						>
							<ArrowDownSVG width='1.6rem' height='1.6rem' />
						</button>
					)}
				</div>
			)}
		</Popup>
	);
};

export default MultiSelect;
