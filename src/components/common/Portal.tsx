import clsx from 'clsx';
import React, { cloneElement, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface IChildrenProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PortalProps {
	children: (props: IChildrenProps) => React.ReactElement;
	renderer: (props: IChildrenProps) => React.ReactElement;
	onClose?: () => void;
	onOpen?: () => void;
	portalElement?: HTMLElement;
	defaultOpen?: boolean;
	disabled?: boolean;
	zIndex?: number;
	defaultPopupWidth?: number;
	className?: ClassesValue;
}

const Portal = ({
	children,
	renderer,
	onClose,
	onOpen,
	portalElement,
	defaultOpen,
	defaultPopupWidth,
	className,
	disabled,
	zIndex,
}: PortalProps) => {
	const childRef = useRef<HTMLElement>(null);

	const popupRef = useRef<HTMLElement | null>(null);

	const [open, setOpen] = useState(Boolean(defaultOpen));

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
				ePopup.contains(eTarget)
			)
				return;

			throw new Error();
		} catch (e) {
			setOpen(false);
			abort();
		}
	};

	const onPortalLoad = useCallback((el: HTMLDivElement | null) => {
		popupRef.current = el;

		try {
			const eChild = childRef.current;
			if (!el || !eChild) return;

			const { width, height, top, left } = eChild.getBoundingClientRect();

			el.style.width = (defaultPopupWidth ?? width) + 'px';
			el.style.top = top + height + 'px';
			if (defaultPopupWidth && defaultPopupWidth !== width) {
				el.style.width = defaultPopupWidth + 'px';
				if (defaultPopupWidth > width) el.style.left = left - (defaultPopupWidth - width) + 'px';
				else el.style.right = left + width - defaultPopupWidth + 'px';
			} else {
				el.style.width = width + 'px';
				el.style.left = left + 'px';
			}

			el.style.display = '';
			if (className) el.setAttribute('class', clsx(className));
		} catch (e) {
			//
		}
	}, []);

	useEffect(() => {
		if (!open) return;

		const controller = new AbortController();
		window.addEventListener('click', (e) => onWindowClick(e, () => controller.abort()), {
			signal: controller.signal,
		});
	}, [open]);

	useEffect(() => {
		try {
			if (open) onOpen?.();
			else onClose?.();
		} catch (e) {
			//
		}
	}, [open]);

	return (
		<React.Fragment>
			{cloneElement(children({ setOpen, open }), { ref: childRef })}

			{!disabled &&
				open &&
				createPortal(
					<div ref={onPortalLoad} style={{ position: 'absolute', zIndex: zIndex ?? 99, display: 'none' }}>
						{renderer({ setOpen, open })}
					</div>,
					portalElement ?? document.body,
				)}
		</React.Fragment>
	);
};

export default Portal;
