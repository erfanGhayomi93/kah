import { cloneElement, useEffect, useRef } from 'react';

interface ClickProps {
	enabled: boolean;
	children: React.ReactElement;
	onClickInside?: () => void;
	onClickOutside?: () => void;
}

const Click = ({ enabled, children, onClickInside, onClickOutside }: ClickProps) => {
	const childRef = useRef<HTMLElement>(null);

	const controllerRef = useRef<AbortController>(new AbortController());

	const onDocumentClick = (e: MouseEvent) => {
		try {
			const eChild = childRef.current;
			const eTarget = e.target as HTMLElement | null;
			if (!eTarget || !eChild) return;

			if (eChild.isEqualNode(eTarget) || eChild.contains(eTarget)) {
				onClickInside?.();
				return;
			}

			abort();
			onClickOutside?.();
		} catch (e) {
			//
		}
	};

	const abort = () => {
		try {
			controllerRef.current.abort();
		} catch (e) {
			//
		}
	};

	const getSignal = () => {
		return controllerRef.current.signal;
	};

	useEffect(() => {
		abort();

		if (enabled) {
			controllerRef.current = new AbortController();

			window.addEventListener('mousedown', onDocumentClick, {
				signal: getSignal(),
			});
		}

		return () => abort();
	}, [enabled]);

	return cloneElement(children, { ref: childRef });
};

export default Click;
