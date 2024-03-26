import { cn } from '@/utils/helpers';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
	children: React.ReactNode;
}

const Button = ({ children, className, loading, disabled, ...props }: ButtonProps) => {
	return (
		<button
			role='button'
			disabled={disabled ?? loading}
			className={cn(styles.btn, loading && styles.loading, className)}
			{...props}
		>
			{loading ? <div className={styles.spinner} /> : children}
		</button>
	);
};

export default Button;
