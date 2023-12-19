import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';

interface ModalProps {
	portalElement?: HTMLElement;
	style?: Record<'root' | 'container' | 'modal', React.CSSProperties>;
	size?: 'lg' | 'md' | 'sm' | 'xs' | 'xxs';
	classes?: RecordClasses<'root' | 'container' | 'modal'>;
	children: React.ReactNode;
	onClose: () => void;
}

const Modal = ({ portalElement, children, style, classes, size, onClose }: ModalProps) => {
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

	useEffect(() => {
		const controller = new AbortController();
		window.addEventListener('click', (e) => onWindowClick(e, () => controller.abort()), {
			signal: controller.signal,
		});

		return () => controller.abort();
	}, []);

	return createPortal(
		<div ref={rootRef} style={style?.root} className={clsx(styles.root, classes?.root)}>
			<div style={style?.container} className={clsx(styles.container, classes?.container)}>
				<div ref={modalRef} style={style?.modal} className={clsx(styles.modal, size && styles[size], classes?.modal)}>
					{children}
				</div>
			</div>
		</div>,
		portalElement ?? document.body,
	);
};

export default Modal;
