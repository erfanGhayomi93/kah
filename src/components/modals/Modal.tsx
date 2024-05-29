import { usePathname } from '@/navigation';
import { cn } from '@/utils/helpers';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import Moveable from '../common/Moveable';
import { EraserSVG, SessionHistorySVG, XSVG } from '../icons';
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

interface ModalHeaderChildrenProps {
	children: React.ReactNode;
}

interface ModalHeaderCustomProps {
	label?: React.ReactNode;
	CustomHeader?: React.ReactNode;
	onClose?: () => void;
	onExpanded?: () => void;
	onClear?: () => void;
}

type ModalHeaderProps = ModalHeaderChildrenProps | ModalHeaderCustomProps;

const Modal = forwardRef<HTMLDivElement, ModalProps>(
	({ portalElement, moveable = false, transparent = false, children, style, classes, size, top, onClose }, ref) => {
		const pathname = usePathname();

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

		useImperativeHandle(ref, () => rootRef.current!);

		useEffect(() => {
			const controller = new AbortController();

			window.addEventListener('mousedown', (e) => onWindowClick(e, () => controller.abort()), {
				signal: controller.signal,
			});

			window.addEventListener('keydown', (e) => onWindowKeyDown(e, () => controller.abort()), {
				signal: controller.signal,
			});

			return () => {
				controller.abort();
			};
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

		useEffect(() => () => onClose(), [pathname]);

		return createPortal(
			<div
				ref={rootRef}
				style={style?.root}
				className={cn(
					'presence',
					styles.root,
					classes?.root,
					transparent && [styles.transparent, classes?.transparent],
				)}
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
	},
);

const Header = (props: ModalHeaderProps) => {
	if ('children' in props) {
		return <div className='relative h-56 w-full bg-gray-200 flex-justify-center'>{props.children}</div>;
	}

	const { label, CustomHeader, onClose, onExpanded, onClear } = props;

	return (
		<div className='relative h-56 w-full bg-gray-200 flex-justify-center'>
			<h2 className='select-none text-xl font-medium text-gray-900'>{label}</h2>

			<button onClick={onClose} type='button' className='absolute left-24 z-10 icon-hover'>
				<XSVG width='2rem' height='2rem' />
			</button>

			{!!onExpanded && (
				<button onClick={onExpanded} type='button' className='absolute left-64 z-10 icon-hover'>
					<SessionHistorySVG width='1.8rem' height='1.8rem' />
				</button>
			)}

			{!!onClear && (
				<button onClick={onClear} type='button' className='absolute left-56 z-10 icon-hover'>
					<EraserSVG width='2rem' height='2rem' />
				</button>
			)}

			{CustomHeader}
		</div>
	);
};

export { Header };
export default Modal;
