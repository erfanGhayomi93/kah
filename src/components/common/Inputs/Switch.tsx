import clsx from 'clsx';
import styles from './Switch.module.scss';

interface SwitchProps {
	classes?: RecordClasses<'root' | 'checkbox' | 'label' | 'thumb'>;
	disabled?: boolean;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

const Switch = ({ classes, disabled, checked, onChange }: SwitchProps) => {
	return (
		<label className={clsx(styles.root, classes?.root)}>
			<input
				disabled={disabled}
				onChange={(e) => onChange(e.target.checked)}
				type='checkbox'
				checked={checked}
				className={styles.input}
			/>
			<span className={clsx(styles.thumb, classes?.thumb)} />
		</label>
	);
};

export default Switch;
