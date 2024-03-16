import clsx from 'clsx';
import styles from './Main.module.scss';

interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
}

const Main = ({ children, className, ...props }: MainProps) => (
	<div {...props} className={clsx(styles.root, className)}>
		{children}
	</div>
);

export default Main;
