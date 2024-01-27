import clsx from 'clsx';
import React, { useState } from 'react';
import { ArrowDownSVG } from '../icons';
import Portal from './Portal';
import styles from './Select.module.scss';

export interface TSelectOptions {
	id: string | number;
	title: string | React.ReactNode;
}

interface IClearableSelectProps {
	clearable: true;
	onChange: (option: TSelectOptions | null) => void;
}

interface INonClearableSelectProps {
	clearable?: false;
	onChange: (option: TSelectOptions) => void;
}

type SelectProps = (IClearableSelectProps | INonClearableSelectProps) & {
	value?: TSelectOptions | null;
	placeholder?: string | React.ReactNode;
	defaultOpen?: boolean;
	options: TSelectOptions[];
	classes?: RecordClasses<'root' | 'focus' | 'list' | 'listItem' | 'value' | 'placeholder' | 'icon' | 'active'>;
};

const Select = ({ value, options, classes, placeholder, clearable, defaultOpen, onChange }: SelectProps) => {
	const [focusing, setFocusing] = useState(false);

	return (
		<Portal
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
							key={option.id}
							className={clsx(
								styles.listItem,
								classes?.listItem,
								value && option.id === value.id && [styles.active, classes?.active],
							)}
						>
							{option.title}
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
					className={clsx(styles.root, classes?.root, focusing && [styles.focus, classes?.focus])}
				>
					<span
						className={clsx(
							styles.value,
							classes?.value,
							!value && [styles.placeholder, classes?.placeholder],
						)}
					>
						{value ? value.title : placeholder}
					</span>

					<ArrowDownSVG
						width='1.2rem'
						height='1.2rem'
						style={{ transform: open ? 'rotate(180deg)' : undefined }}
						className={clsx(styles.icon, classes?.icon)}
					/>
				</div>
			)}
		</Portal>
	);
};

export default Select;
