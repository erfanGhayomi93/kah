import { cn } from '@/utils/helpers';
import React from 'react';
import styles from './Checkbox.module.scss';

export interface ICheckboxProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'checked' | 'onChange'> {
	classes?: RecordClasses<'root' | 'checkbox' | 'disabled' | 'checked' | 'label' | 'text'>;
	label?: React.ReactNode;
	disabled?: boolean;
	checked: boolean;
	onChange?: (checked: boolean) => void;
}

const Checkbox = ({ classes, disabled, checked, label, onChange, ...props }: ICheckboxProps) => {
	const onChangeVal = () => {
		if (!disabled) onChange?.(!checked);
	};

	return (
		<div className={cn(styles.root, classes?.root, disabled && [styles.disabled, classes?.disabled])}>
			<label className={cn(styles.label, classes?.label)}>
				<input
					type='checkbox'
					checked={checked}
					onChange={onChangeVal}
					className={cn(
						styles.checkbox,
						classes?.checkbox,
						disabled && styles.disabled,
						checked && ['i-checked', styles.checked, classes?.checked],
					)}
					{...props}
				/>

				{label && <span className={cn(styles.text, classes?.text)}>{label}</span>}
			</label>
		</div>
	);
};

export default Checkbox;
