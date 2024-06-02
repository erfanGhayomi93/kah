import { forwardRef } from 'react';
import styles from './Loading.module.scss';

const Loading = forwardRef<HTMLDivElement>((_, ref) => (
	<div ref={ref} className={styles.root}>
		<div className={styles.spinner}>
			<div className={styles.line} />
			<div className={styles.line} />
			<div className={styles.line} />
		</div>
	</div>
));

export default Loading;
