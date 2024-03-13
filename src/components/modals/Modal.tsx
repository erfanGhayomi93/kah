import { cn } from '@/utils/helpers';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Moveable from '../common/Moveable';
import { XSVG } from '../icons';
import styles from './Modal.module.scss';

interface ModalProps extends IBaseModalConfiguration {
	portalElement?: HTMLElement;
	style?: Partial<Record<'root' | 'container' | 'modal', React.CSSProperties>>;
	size?: 'lg' | 'md' | 'sm' | 'xs' | 'xxs';
	classes?: RecordClasses<'root' | 'container' | 'modal' | 'transparent'>;
	children: React.ReactNode;
	top?: string | number;
	transparent?: boolean;
	onClose: () => void;
}

interface ModalHeaderProps {
	label: React.ReactNode;
	onClose: () => void;
}

const Modal = ({
	portalElement,
	moveable = false,
	transparent,
	children,
	style,
	classes,
	size,
	top,
	animation = true,
	onClose,
}: ModalProps) => {
	const rootRef = useRef<HTMLDivElement>(null);

	const modalRef = useRef<HTMLDivElement | null>(null);

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

	useLayoutEffect(() => {
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
			style={{
				...style?.root,
				animation: animation ? 'fadeIn ease-in-out 250ms 1 alternate forwards' : undefined,
			}}
			className={cn(styles.root, classes?.root, transparent && [styles.transparent, classes?.transparent])}
		>
			<div style={style?.container} className={cn(styles.container, classes?.container)}>
				<Moveable ref={modalRef} enabled={moveable}>
					<div
						style={{ top, ...style?.modal }}
						className={cn(styles.modal, size && styles[size], classes?.modal)}
					>
						{children}
					</div>
				</Moveable>
			</div>
		</div>,
		portalElement ?? document.body,
	);
};

const Header = ({ label, onClose }: ModalHeaderProps) => (
	<div className='relative h-56 bg-gray-200 flex-justify-center'>
		<h2 className='text-xl font-medium'>{label}</h2>

		<button onClick={onClose} type='button' className='absolute left-24 z-10 icon-hover'>
			<XSVG width='2rem' height='2rem' />
		</button>
	</div>
);

Modal.Header = Header;

export { Header };
export default Modal;
