import clsx from 'clsx';
import styles from './Checkbox.module.scss';

interface ICheckboxProps {
	classes?: RecordClasses<'root' | 'dark' | 'checkbox' | 'checked' | 'label' | 'text'>;
	onChange: (checked: boolean) => void;
	checked: boolean;
	label?: string | number;
	disabled?: boolean;
	readOnly?: boolean;
}

const Checkbox = ({ classes, disabled, onChange, checked, label, readOnly = false }: ICheckboxProps) => {
	return (
		<div className={clsx(styles.root, classes?.root, disabled && styles.disabled)} data-testid='checkbox_component'>
			<label className={clsx(styles.label, classes?.label)}>
				<input
					type='checkbox'
					checked={checked}
					onChange={disabled ? undefined : () => onChange(!checked)}
					className={clsx(styles.checkbox, classes?.checkbox, checked && [styles.checked, classes?.checked])}
					readOnly={readOnly}
				/>

				{label && <span className={clsx(styles.text, classes?.text)}>{label}</span>}
			</label>
		</div>
	);
};

export default Checkbox;
