import clsx from 'clsx';
import styles from './Checkbox.module.scss';

interface ICheckboxProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'checked' | 'onChange'> {
	classes?: RecordClasses<'root' | 'checkbox' | 'checked' | 'label' | 'text'>;
	label?: string | number;
	disabled?: boolean;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

const Checkbox = ({ classes, disabled, onChange, checked, label, ...props }: ICheckboxProps) => {
	return (
		<div className={clsx(styles.root, classes?.root, disabled && styles.disabled)}>
			<label className={clsx(styles.label, classes?.label)}>
				<input
					type='checkbox'
					checked={checked}
					onChange={disabled ? undefined : () => onChange(!checked)}
					className={clsx(styles.checkbox, classes?.checkbox, checked && [styles.checked, classes?.checked])}
					{...props}
				/>

				{label && <span className={clsx(styles.text, classes?.text)}>{label}</span>}
			</label>
		</div>
	);
};

export default Checkbox;
