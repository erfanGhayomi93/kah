import clsx from 'clsx';
import React, { forwardRef } from 'react';
import styles from './Buttons.module.scss';

interface PauseAndPlayBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isPaused: boolean;
}

const PauseAndPlayBtn = forwardRef<HTMLButtonElement, PauseAndPlayBtnProps>(
	({ className, isPaused, ...props }, ref) => (
		<button
			type='button'
			{...props}
			ref={ref}
			className={
				className ??
				'relative size-40 rounded border border-light-gray-200 text-light-gray-700 transition-colors flex-justify-center hover:border-light-primary-100 hover:bg-light-primary-100 hover:text-white'
			}
		>
			<span className={clsx(styles.pp, isPaused && styles.paused)} />
		</button>
	),
);

export default PauseAndPlayBtn;
