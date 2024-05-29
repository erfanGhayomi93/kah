import clsx from 'clsx';
import styles from './Main.module.scss';

interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
}

const Main = ({ children, className, ...props }: MainProps) => (
	<main {...props} className={clsx(styles.root, className)}>
		{children}
	</main>
);

export default Main;
