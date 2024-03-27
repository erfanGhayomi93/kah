'use client';

import clsx from 'clsx';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Panel.module.scss';

interface PanelProps {
	isEnable: boolean;
	width: string;
	height?: string;
	transparent?: boolean;
	onClose: () => void;
	render: () => React.ReactNode;
}

const Panel = ({ isEnable, transparent, width, height, render, onClose }: PanelProps) => {
	const panelRef = useRef<HTMLDivElement>(null);

	const onMouseDown = (e: React.MouseEvent) => {
		try {
			const ePanel = panelRef.current;
			if (!ePanel) return;

			const target = e.target as HTMLElement;
			if (ePanel.isEqualNode(target) || ePanel.contains(target)) return;

			onClose();
		} catch (e) {
			//
		}
	};

	return createPortal(
		<div onMouseDown={onMouseDown} className={styles.root}>
			{!transparent && (
				<div
					style={{ animation: `${isEnable ? 'fadeIn' : 'fadeOut'} ease-in-out 250ms 1 alternate forwards` }}
					className={styles.bg}
				/>
			)}

			<div
				ref={panelRef}
				style={{
					width,
					height: height ?? 'calc(100dvh - 1.8rem)',
					animation: `${isEnable ? 'left-to-right' : 'right-to-left'} ease-in-out 600ms 1 alternate forwards`,
				}}
				className={clsx(styles.wrapper, transparent && styles.shadow)}
			>
				{render()}
			</div>
		</div>,
		document.body,
	);
};

export default Panel;
