import { cn } from '@/utils/helpers';
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
		<div className={cn(styles.root, classes?.root, disabled && styles.disabled)}>
			<label className={cn(styles.label, classes?.label)}>
				<input
					type='checkbox'
					checked={checked}
					onChange={disabled ? undefined : () => onChange(!checked)}
					className={cn(styles.checkbox, classes?.checkbox, checked && [styles.checked, classes?.checked])}
					{...props}
				/>

				{label && <span className={cn(styles.text, classes?.text)}>{label}</span>}
			</label>
		</div>
	);
};

export default Checkbox;
