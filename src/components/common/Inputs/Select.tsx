import clsx from 'clsx';
import React, { useState } from 'react';
import { ArrowDownSVG } from '../../icons';
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

type SelectProps<T> = (IClearableProps<T> | INonClearableProps<T>) & {
	value?: T | null;
	placeholder?: string | React.ReactNode;
	defaultOpen?: boolean;
	options: T[];
	loading?: boolean;
	classes?: RecordClasses<'root' | 'focus' | 'list' | 'listItem' | 'value' | 'placeholder' | 'icon' | 'active'>;
	getOptionId: (option: T) => string | number;
	getOptionTitle: (option: T) => React.ReactNode;
};

const Select = <T,>({
	value,
	options,
	classes,
	placeholder,
	clearable,
	defaultOpen,
	getOptionId,
	getOptionTitle,
	onChange,
}: SelectProps<T>) => {
	const [focusing, setFocusing] = useState(false);

	const onClear = () => {
		if (clearable) onChange(null);
	};

	return (
		<Popup
			zIndex={9999}
			defaultOpen={defaultOpen}
			renderer={({ setOpen }) => (
				<ul className={clsx(styles.list, classes?.list)}>
					{options.map((option) => (
						<li
							onClick={() => {
								onChange(option);
								setOpen(false);
							}}
							key={getOptionId(option)}
							className={clsx(
								styles.listItem,
								classes?.listItem,
								value && getOptionId(option) === getOptionId(value) && [styles.active, classes?.active],
							)}
						>
							{getOptionTitle(option)}
						</li>
					))}
				</ul>
			)}
			onOpen={() => setFocusing(true)}
			onClose={() => setFocusing(false)}
		>
			{({ setOpen, open }) => (
				<div
					onClick={() => setOpen(!open)}
					className={clsx(
						styles.root,
						classes?.root,
						styles.clickable,
						focusing && [styles.focus, classes?.focus],
					)}
				>
					{value && (
						<span className={clsx(styles.value, classes?.value)}>
							{value ? getOptionTitle(value) : placeholder}
						</span>
					)}

					<span className={clsx('flexible-placeholder', value && 'active')}>{placeholder}</span>

					<ArrowDownSVG
						width='1.6rem'
						height='1.6rem'
						style={{ transform: open ? 'rotate(180deg)' : undefined }}
						className={clsx(styles.icon, classes?.icon)}
					/>
				</div>
			)}
		</Popup>
	);
};

export default Select;
