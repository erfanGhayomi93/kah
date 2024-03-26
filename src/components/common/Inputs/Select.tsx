import { ArrowDownSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import React, { useLayoutEffect, useState } from 'react';
import Popup from '../Popup';
import styles from './Select.module.scss';

interface IClearableProps<T> {
	clearable: true;
	onChange: (option: T | null) => void;
}

interface INonClearableProps<T> {
	clearable?: false;
	onChange: (option: T) => void;
}

type SelectProps<T, D> = (IClearableProps<T> | INonClearableProps<T>) & {
	defaultValue?: D | T | null;
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
	getOptionId: (option: T | D) => string | number;
	getOptionTitle: (option: T | D) => React.ReactNode;
	getInputValue?: (option: T | D) => React.ReactNode;
};

const Select = <T, D = T>({
	defaultValue,
	options,
	classes,
	loading,
	disabled,
	defaultPopupWidth,
	placeholder,
	defaultOpen,
	getOptionId,
	getOptionTitle,
	getInputValue,
	onChange,
}: SelectProps<T, D>) => {
	const t = useTranslations();

	const [value, setValue] = useState<T | D | null>(defaultValue ?? null);

	const [focusing, setFocusing] = useState(false);

	const onChangeValue = (v: T) => {
		setValue(v);
		onChange(v);
	};

	useLayoutEffect(() => {
		setValue(defaultValue ?? null);
	}, [defaultValue]);

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
						<div className={cn(styles.alert, classes?.alert)}>
							<span>{t('common.no_data')}</span>
						</div>
					);

				return (
					<div className={cn(styles.box, classes?.box)}>
						<ul className={cn(styles.list, classes?.list)}>
							{options.map((option) => (
								<li
									onClick={() => {
										onChangeValue(option);
										setOpen(false);
									}}
									key={getOptionId(option)}
									className={cn(
										styles.listItem,
										classes?.listItem,
										value &&
											getOptionId(option) === getOptionId(value) && [
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
					className={cn(
						'input-group',
						styles.root,
						classes?.root,
						!placeholder && [styles.border, classes?.border],
						disabled ? ['disabled', styles.disabled, classes?.disabled] : styles.clickable,
						focusing && [styles.focus, classes?.focus],
					)}
				>
					{value && (
						<span className={cn(styles.value, classes?.value)}>
							{value ? (getInputValue ? getInputValue(value) : getOptionTitle(value)) : placeholder}
						</span>
					)}

					{placeholder && (
						<>
							<span className={cn('flexible-placeholder', value && 'active', open && 'colorful')}>
								{placeholder}
							</span>
							<fieldset className={cn('flexible-fieldset', placeholder && value && 'active')}>
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
							className={cn(styles.icon, classes?.icon)}
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

export default Select;
