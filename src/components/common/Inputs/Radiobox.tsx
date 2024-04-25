import { cn } from '@/utils/helpers';
import styles from './Radiobox.module.scss';

interface ICheckboxProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'checked' | 'onChange'> {
	classes?: RecordClasses<'root' | 'active' | 'radiobox' | 'checked' | 'label' | 'text'>;
	label?: string | number;
	disabled?: boolean;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

const Radiobox = ({ classes, disabled, onChange, checked, label, ...props }: ICheckboxProps) => {
	return (
		<div className={cn(styles.root, classes?.root, disabled && styles.disabled)}>
			<label className={cn(styles.label, classes?.label)}>
				<input
					type='radio'
					checked={checked}
					onChange={disabled ? undefined : () => onChange(!checked)}
					className={cn(styles.radiobox, classes?.radiobox, checked && [styles.checked, classes?.checked])}
					{...props}
				/>

				{label && (
					<span className={cn(styles.text, classes?.text, checked && [styles.active, classes?.active])}>
						{label}
					</span>
				)}
			</label>
		</div>
	);
};

export default Radiobox;
