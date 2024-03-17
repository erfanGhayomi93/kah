import { cn } from '@/utils/helpers';
import styles from './Switch.module.scss';

interface SwitchProps {
	classes?: RecordClasses<'root' | 'circle' | 'ripple' | 'checkbox' | 'label' | 'thumb'>;
	disabled?: boolean;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

const Switch = ({ classes, disabled, checked, onChange }: SwitchProps) => {
	return (
		<label className={cn(styles.root, classes?.root)}>
			<input
				disabled={disabled}
				onChange={(e) => onChange(e.target.checked)}
				type='checkbox'
				checked={checked}
				className={styles.input}
			/>
			<span className={cn(styles.thumb, classes?.thumb)}>
				<span className={cn(styles.circle, classes?.circle)} />
			</span>
		</label>
	);
};

export default Switch;
