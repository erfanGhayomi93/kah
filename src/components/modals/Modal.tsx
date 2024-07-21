import { usePathname } from '@/navigation';
import clsx from 'clsx';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import Moveable from '../common/Moveable';
import { EraserSVG, RefreshSVG, SessionHistorySVG, XSVG } from '../icons';
import styles from './Modal.module.scss';

interface ModalProps extends IBaseModalConfiguration {
	suppressClickOutside?: boolean;
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
	onClose?: () => void;
	onExpanded?: () => void;
	onClear?: () => void;
	onReset?: () => void;
}

interface WrapperProps {
	children: React.ReactNode;
	suppress: boolean;
	style: Partial<Record<'root' | 'container', React.CSSProperties>>;
	classes: RecordClasses<'root' | 'container'>;
}

type ModalHeaderProps = ModalHeaderChildrenProps | ModalHeaderCustomProps;

const Modal = forwardRef<HTMLDivElement, ModalProps>(
	(
		{
			portalElement,
			moveable = false,
			transparent = false,
			suppressClickOutside = false,
			children,
			style,
			classes,
			size,
			top,
			onClose,
		},
		ref,
	) => {
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

			if (!suppressClickOutside) {
				window.addEventListener('mousedown', (e) => onWindowClick(e, () => controller.abort()), {
					signal: controller.signal,
				});
			}

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
			<Wrapper
				ref={rootRef}
				suppress={suppressClickOutside}
				style={{
					container: style?.container,
					root: style?.root,
				}}
				classes={{
					container: [styles.container, classes?.container],
					root: [
						'presence',
						styles.root,
						classes?.root,
						transparent && [styles.transparent, classes?.transparent],
					],
				}}
			>
				<Moveable ref={modalRef} enabled={moveable}>
					<div
						style={{ top, ...style?.modal }}
						className={clsx(
							styles.modal,
							size && styles[size],
							classes?.modal,
							(suppressClickOutside || transparent) && [styles.shadow],
						)}
					>
						{children}
					</div>
				</Moveable>
			</Wrapper>,
			portalElement ?? document.body,
		);
	},
);

const Header = (props: ModalHeaderProps) => {
	if ('children' in props) {
		return <div className='relative h-56 w-full bg-light-gray-100 flex-justify-center'>{props.children}</div>;
	}

	const { label, onClose, onExpanded, onClear, onReset } = props;

	return (
		<div className='relative h-56 w-full bg-light-gray-100 flex-justify-center'>
			<h2 className='select-none text-xl font-medium text-light-gray-700'>{label}</h2>

			<div className='absolute left-24 z-10 gap-8 ltr flex-items-end *:size-24 *:flex-justify-center *:icon-hover'>
				<button onClick={onClose} type='button'>
					<XSVG width='2rem' height='2rem' />
				</button>

				{!!onReset && (
					<button onClick={onReset} type='button'>
						<RefreshSVG width='2rem' height='2rem' />
					</button>
				)}

				{!!onExpanded && (
					<button onClick={onExpanded} type='button'>
						<SessionHistorySVG width='2rem' height='2rem' />
					</button>
				)}

				{!!onClear && (
					<button onClick={onClear} type='button'>
						<EraserSVG width='2rem' height='2rem' />
					</button>
				)}
			</div>
		</div>
	);
};

const Wrapper = forwardRef<HTMLDivElement, WrapperProps>(({ children, classes, style, suppress }, ref) => {
	if (suppress) return children;

	return (
		<div ref={ref} style={style?.root} className={clsx(classes?.root)}>
			<div style={style?.container} className={clsx(classes?.container)}>
				{children}
			</div>
		</div>
	);
});

export { Header };
export default Modal;
