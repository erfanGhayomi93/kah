import clsx from 'clsx';
import React, { forwardRef } from 'react';
import styles from './Buttons.module.scss';

interface PlayAndPauseBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isPaused: boolean;
}

const PlayAndPauseBtn = forwardRef<HTMLButtonElement, PlayAndPauseBtnProps>(
	({ className, isPaused, ...props }, ref) => (
		<button
			type='button'
			{...props}
			ref={ref}
			className={
				className ??
				'border-gray-200 text-gray-700 hover:border-primary-100 hover:bg-primary-100 relative size-40 rounded border transition-colors flex-justify-center hover:text-white'
			}
		>
			<span className={clsx(styles.pp, isPaused && styles.paused)} />
		</button>
	),
);

export default PlayAndPauseBtn;
