import clsx from 'clsx';
import React, { useState } from 'react';
import styles from './Buttons.module.scss';

interface PauseAndPlayBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PauseAndPlayBtn = ({ className, ...props }: PauseAndPlayBtnProps) => {
	const [paused, setPaused] = useState(false);

	return (
		<button
			type='button'
			{...props}
			onClick={() => setPaused(!paused)}
			className={
				className ??
				'relative size-40 rounded border border-light-gray-200 text-light-gray-700 transition-colors flex-justify-center hover:border-light-primary-100 hover:bg-light-primary-100 hover:text-white'
			}
		>
			<span className={clsx(styles.pp, paused && styles.paused)} />
		</button>
	);
};

export default PauseAndPlayBtn;
