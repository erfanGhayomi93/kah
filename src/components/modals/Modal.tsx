import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';

interface ModalProps {
	portalElement?: HTMLElement;
	style?: Partial<Record<'root' | 'container' | 'modal', React.CSSProperties>>;
	size?: 'lg' | 'md' | 'sm' | 'xs' | 'xxs';
	classes?: RecordClasses<'root' | 'container' | 'modal' | 'transparent'>;
	children: React.ReactNode;
	top?: string | number;
	transparent?: boolean;
	onClose: () => void;
}

const Modal = ({ portalElement, transparent, children, style, classes, size, top, onClose }: ModalProps) => {
	const rootRef = useRef<HTMLDivElement>(null);

	const modalRef = useRef<HTMLDivElement>(null);

	const onWindowClick = (e: MouseEvent, removeListener: () => void) => {
		try {
			const eModal = modalRef.current;
			const eRoot = rootRef.current;
			if (!eRoot || !eModal) return;

			const target = (e.target ?? e.currentTarget) as Node;
			if (target && !eModal.contains(target) && eRoot.contains(target)) {
				onClose();
				removeListener();
			}
		} catch (e) {
			//
		}
	};

	const onWindowKeyDown = (e: KeyboardEvent, removeListener: () => void) => {
		try {
			if (e.key !== 'Escape') return;
			onClose();

			removeListener();
		} catch (e) {
			//
		}
	};

	useEffect(() => {
		const controller = new AbortController();

		window.addEventListener('mousedown', (e) => onWindowClick(e, () => controller.abort()), {
			signal: controller.signal,
		});

		window.addEventListener('keydown', (e) => onWindowKeyDown(e, () => controller.abort()), {
			signal: controller.signal,
		});

		return () => controller.abort();
	}, []);

	useEffect(() => {
		try {
			document.body.style.overflow = 'hidden';

			return () => {
				document.body.style.overflow = '';
			};
		} catch (e) {
			//
		}
	}, []);

	return createPortal(
		<div
			ref={rootRef}
			style={{ ...style?.root, animation: 'fadeIn ease-in-out 250ms 1 alternate forwards' }}
			className={clsx(styles.root, classes?.root, transparent && [styles.transparent, classes?.transparent])}
		>
			<div style={style?.container} className={clsx(styles.container, classes?.container)}>
				<div
					ref={modalRef}
					style={{ top, ...style?.modal }}
					className={clsx(styles.modal, size && styles[size], classes?.modal)}
				>
					{children}
				</div>
			</div>
		</div>,
		portalElement ?? document.body,
	);
};

export default Modal;
