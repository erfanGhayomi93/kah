import styles from './Loading.module.scss';
const Loading = () => {
	return (
		<div className={styles.root}>
			<div className={styles.spinner}>
				<div className={styles.line} />
				<div className={styles.line} />
				<div className={styles.line} />
			</div>
		</div>
	);
};

export default Loading;
