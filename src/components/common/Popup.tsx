import { cn } from '@/utils/helpers';
import React, { cloneElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface IChildrenProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PopupProps {
	children: (props: IChildrenProps) => React.ReactElement;
	renderer: (props: IChildrenProps) => React.ReactElement | null;
	onClose?: () => void;
	onOpen?: () => void;
	portalElement?: HTMLElement;
	defaultOpen?: boolean;
	disabled?: boolean;
	zIndex?: number;
	margin?: Partial<Record<'x' | 'y', number>>;
	defaultPopupWidth?: number;
	className?: ClassesValue;
	animation?: string;
	dependency?: string;
}

const Popup = ({
	children,
	renderer,
	onClose,
	onOpen,
	dependency,
	portalElement,
	animation = 'slideUp',
	defaultOpen,
	defaultPopupWidth,
	className,
	disabled,
	margin,
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

	const onPortalLoad = useCallback((el: HTMLDivElement | null) => {
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

					if (valueAsPx > 0) el.style.right = valueAsPx - mx + 'px';
					else el.style.right = valueAsPx - mx + 'px';
				}
			} else {
				popupWidth = width + 'px';
				el.style.left = left + mx + 'px';
			}

			el.style.width = popupWidth;
			el.style.top = top + height + my + 'px';
			el.style.display = '';

			if (className) el.setAttribute('class', cn(className));
		} catch (e) {
			//
		}
	}, []);

	const handleOpen = () => {
		if (!disabled) setOpen(true);
	};

	const onWindowBlur = () => {
		setOpen(false);
	};

	useLayoutEffect(() => {
		if (!open) return;

		const controller = new AbortController();
		window.addEventListener('click', (e) => onWindowClick(e, () => controller.abort()), {
			signal: controller.signal,
		});

		return () => controller.abort();
	}, [open]);

	useLayoutEffect(() => {
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

			{!disabled &&
				open &&
				createPortal(
					<div
						ref={onPortalLoad}
						style={{
							position: 'fixed',
							zIndex: zIndex ?? 99,
							display: 'none',
							animation: `${animation} ease-in-out 250ms 1 alternate forwards`,
						}}
					>
						{renderer({ setOpen, open })}
					</div>,
					portalElement ?? document.body,
				)}
		</React.Fragment>
	);
};

export default Popup;
