import { cn } from '@/utils/helpers';
import { forwardRef } from 'react';
import { ArrowLeftSVG } from '../icons';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
	children: React.ReactNode;
	afterArrow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, className, loading, disabled, afterArrow, ...props }, ref) => {
		return (
			<button
				ref={ref}
				role='button'
				disabled={disabled ?? loading}
				className={cn(styles.btn, loading && styles.loading, className)}
				{...props}
			>
				{loading ? <div className={styles.spinner} /> : children}
				{afterArrow && !loading && <ArrowLeftSVG width='2.4rem' height='2.4rem' />}
			</button>
		);
	},
);

export default Button;
