'use client';

import clsx from 'clsx';
import { forwardRef, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Panel.module.scss';

interface PanelProps {
	width: string;
	height?: string;
	transparent?: boolean;
	dependency?: string;
	classes?: RecordClasses<'root' | 'wrapper' | 'bg' | 'shadow'>;
	onClose: () => void;
	render: () => React.ReactNode;
}

const Panel = forwardRef<HTMLDivElement, PanelProps>(
	({ transparent = false, dependency, width, height, classes, render, onClose }, ref) => {
		const panelRef = useRef<HTMLDivElement>(null);

		const onMouseDown = (e: React.MouseEvent) => {
			try {
				const ePanel = panelRef.current;
				if (!ePanel) return;

				const eTarget = e.target as HTMLElement;
				if (
					ePanel.isEqualNode(eTarget) ||
					ePanel.contains(eTarget) ||
					(dependency && eTarget.closest(dependency))
				)
					return;

				onClose();
			} catch (e) {
				//
			}
		};

		return createPortal(
			<div ref={ref} onMouseDown={onMouseDown} className={clsx(styles.root, classes?.root)}>
				{!transparent && <div className={clsx(styles.bg, classes?.bg)} />}

				<div
					ref={panelRef}
					style={{
						width,
						height: height ?? 'calc(100dvh - 1.8rem)',
					}}
					className={clsx(styles.wrapper, classes?.wrapper, transparent && [styles.shadow, classes?.shadow])}
				>
					{render()}
				</div>
			</div>,
			document.body,
		);
	},
);

export default Panel;
