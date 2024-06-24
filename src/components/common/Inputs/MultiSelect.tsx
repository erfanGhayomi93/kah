import { ArrowDownSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useLayoutEffect, useState } from 'react';
import Popup from '../Popup';
import styles from './MultiSelect.module.scss';

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

const MultiSelect = <T,>({
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
		const optionIndex = values.findIndex((item) => {
			if (typeof item === 'object' && item !== null) {
				// @ts-expect-error: doesn't have type id in array type
				return item.id === v.id;
			} else {
				return item === v;
			}
		});

		if (optionIndex === -1) {
			setValues((prev) => [...prev, v]);
			onChange([...values, v]);
		} else {
			setValues((prev) => {
				const spliceValue = prev.splice(optionIndex, 1);
				return [...prev].filter((value) => {
					if (typeof value === 'object' && value !== null) {
						// @ts-expect-error: doesn't have type id in array type
						return value.id !== spliceValue.id;
					} else {
						return value === spliceValue;
					}
				});
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
							{options?.map((option) => (
								<li
									onClick={() => onChangeValue(option)}
									key={getOptionId(option)}
									className={clsx(
										styles.listItem,
										classes?.listItem,
										values.some((value) =>
											typeof value === 'object' && value !== null
												? // @ts-expect-error: doesn't have type id in array type
													value.id === getOptionId(option)
												: value === getOptionId(option),
										) && [styles.active, classes?.active],
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
								<ul className='flex items-center gap-2 truncate'>
									{values.map((value, index, array) => (
										<li
											className='text-gray-00 rounded-md  bg-light-secondary-100 px-8 py-2'
											key={index}
										>
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
