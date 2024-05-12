import { cn } from '@/utils/helpers';
import React, { cloneElement, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AnimatePresence from './animation/AnimatePresence';
import ErrorBoundary from './ErrorBoundary';

interface IChildrenProps {
	open: boolean;
	setOpen: (v: boolean) => void;
}

interface PopupProps {
	children: (props: IChildrenProps) => React.ReactElement;
	renderer: (props: IChildrenProps) => React.ReactElement | null;
	onClose?: () => void;
	onOpen?: () => void;
	portalElement?: HTMLElement;
	zIndex?: number;
	defaultOpen?: boolean;
	disabled?: boolean;
	margin?: Partial<Record<'x' | 'y', number>>;
	defaultPopupWidth?: number;
	className?: ClassesValue;
	dependency?: string;
}

const Popup = ({
	children,
	renderer,
	onClose,
	onOpen,
	dependency,
	portalElement,
	defaultOpen,
	defaultPopupWidth,
	className,
	disabled,
	margin = { x: 0, y: 2 },
	zIndex,
}: PopupProps) => {
	const childRef = useRef<HTMLElement>(null);

	const popupRef = useRef<HTMLElement | null>(null);

	const [open, setOpen] = useState(Boolean(!disabled && defaultOpen));

	const onWindowClick = (e: MouseEvent, abort: () => void) => {
		try {
			const eTarget = e.target as HTMLElement | null;
			const ePopup = popupRef.current as HTMLElement | null;
			const eChild = childRef.current as HTMLElement | null;
			if (!eTarget || !ePopup || !eChild) return;

			if (!eTarget.isConnected) return;

			if (
				eChild.isEqualNode(eTarget) ||
				eChild.contains(eTarget) ||
				ePopup.isEqualNode(eTarget) ||
				ePopup.contains(eTarget) ||
				(dependency && eTarget.closest(dependency))
			)
				return;

			throw new Error();
		} catch (e) {
			setOpen(false);
			abort();
		}
	};

	const onPortalLoad = useCallback((el: HTMLElement | null) => {
		popupRef.current = el;

		try {
			const eChild = childRef.current;
			if (!el || !eChild) return;

			const { width, height, top, left } = eChild.getBoundingClientRect();

			let popupWidth = (defaultPopupWidth ?? width) + 'px';

			const my = margin?.y ?? 0;
			const mx = margin?.x ?? 0;

			if (defaultPopupWidth && defaultPopupWidth !== width) {
				popupWidth = defaultPopupWidth + 'px';

				if (defaultPopupWidth > width) {
					const valueAsPx = left - (defaultPopupWidth - width);
					if (valueAsPx > 0) el.style.left = valueAsPx + mx + 'px';
					else el.style.left = left + mx + 'px';
				} else {
					const valueAsPx = left + width - defaultPopupWidth;

					if (valueAsPx > 0) el.style.left = valueAsPx - mx + 'px';
					else el.style.left = valueAsPx - mx + 'px';
				}
			} else {
				popupWidth = width + 'px';
				el.style.left = left + mx + 'px';
			}

			const popupTop = top + height + my;
			el.style.width = popupWidth;
			el.style.top = `${popupTop}px`;
			el.style.display = '';

			setTimeout(() => {
				const popupHeight = el.getBoundingClientRect().height;
				const maxTop = window.innerHeight - popupHeight - 8;

				if (popupTop > maxTop) {
					el.style.top = `${maxTop}px`;
				}
			});

			if (className) el.setAttribute('class', cn(className));
		} catch (e) {
			//
		}
	}, []);

	const handleOpen = (v: boolean) => {
		if (!disabled) setOpen(v);
	};

	const onWindowBlur = () => {
		setOpen(false);
	};

	useEffect(() => {
		if (!open) return;

		const controller = new AbortController();
		window.addEventListener('mousedown', (e) => onWindowClick(e, () => controller.abort()), {
			signal: controller.signal,
		});

		return () => controller.abort();
	}, [open]);

	useEffect(() => {
		const controller = new AbortController();

		window.addEventListener('blur', onWindowBlur, {
			signal: controller.signal,
		});

		return () => controller.abort();
	}, [open]);

	useEffect(() => {
		try {
			if (open && !disabled) onOpen?.();
			else onClose?.();
		} catch (e) {
			//
		}
	}, [open]);

	return (
		<React.Fragment>
			{cloneElement(children({ setOpen: handleOpen, open }), { ref: childRef })}

			<ErrorBoundary>
				<AnimatePresence
					initial={{ animation: 'fadeInDown' }}
					exit={{ animation: 'fadeOutDown' }}
					onRefLoad={onPortalLoad}
				>
					{!disabled && open && (
						<Child zIndex={zIndex} portalElement={portalElement}>
							{renderer({ setOpen, open })}
						</Child>
					)}
				</AnimatePresence>
			</ErrorBoundary>
		</React.Fragment>
	);
};

const Child = forwardRef<
	HTMLDivElement,
	{
		children: React.ReactNode;
		portalElement?: HTMLElement;
		zIndex?: number;
	}
>(({ zIndex, portalElement, children }, ref) => {
	const childRef = useRef<HTMLDivElement | null>(null);

	useImperativeHandle(ref, () => childRef.current!);

	return createPortal(
		<div
			ref={childRef}
			style={{
				position: 'fixed',
				zIndex: zIndex ?? 99,
				display: 'none',
			}}
		>
			{children}
		</div>,
		portalElement ?? document.body,
	);
});

export default Popup;
