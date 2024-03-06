import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import styles from './Panel.module.scss';

const Wrapper = styled.div<{ $enabled: boolean }>`
	position: fixed;
	top: 5.6rem;
	left: 0;
	gap: 1.6rem;
	display: flex;
	flex-direction: column;
	border-radius: 0 1.6rem 1.6rem 0;
	padding: 0 0 1.6rem 0;
	z-index: 999;
	box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.2);
	animation: ${({ $enabled }) =>
		`${$enabled ? 'left-to-right' : 'right-to-left'} ease-in-out ${
			$enabled ? '700ms' : '600ms'
		} 1 alternate forwards`};
`;

interface PanelProps {
	onClose: () => void;
	isEnable: boolean;
	width: string;
	height?: string;
	transparent?: boolean;
	children?: React.ReactNode;
}

const Panel = ({ transparent, width, height, isEnable, children, onClose }: PanelProps) => {
	const panelRef = useRef<HTMLDivElement>(null);

	const [rendered, setRendered] = useState(isEnable);

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

	useLayoutEffect(() => {
		let timer: NodeJS.Timeout | null = null;

		if (!isEnable) timer = setTimeout(() => setRendered(false), 600);
		else setRendered(true);

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [isEnable]);

	if (!rendered) return null;

	return createPortal(
		<div onMouseDown={onMouseDown} className={styles.root}>
			{!transparent && (
				<div style={{ animation: 'fadeIn ease-in-out 250ms 1 alternate forwards' }} className={styles.bg} />
			)}

			<Wrapper
				ref={panelRef}
				$enabled={isEnable}
				style={{ width, height: height ?? 'calc(100dvh - 6.4rem)' }}
				className='overflow-auto bg-white'
			>
				{children}
			</Wrapper>
		</div>,
		document.body,
	);
};

export default Panel;
