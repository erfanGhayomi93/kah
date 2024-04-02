'use client';

import clsx from 'clsx';
import { forwardRef, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Panel.module.scss';

interface PanelProps {
	width: string;
	height?: string;
	transparent?: boolean;
	onClose: () => void;
	render: () => React.ReactNode;
}

const Panel = forwardRef<HTMLDivElement, PanelProps>(({ transparent, width, height, render, onClose }, ref) => {
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
		<div ref={ref} onMouseDown={onMouseDown} className={styles.root}>
			{!transparent && <div className={styles.bg} />}

			<div
				ref={panelRef}
				style={{
					width,
					height: height ?? 'calc(100dvh - 1.8rem)',
				}}
				className={clsx(styles.wrapper, transparent && styles.shadow)}
			>
				{render()}
			</div>
		</div>,
		document.body,
	);
});

export default Panel;
