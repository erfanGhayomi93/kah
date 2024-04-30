import { cloneElement, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface ClickProps {
	enabled?: boolean;
	children: React.ReactElement;
	dependency?: string;
	onClickInside?: () => void;
	onClickOutside?: () => void;
}

const Click = forwardRef<HTMLElement, ClickProps>(
	({ enabled = true, dependency, children, onClickInside, onClickOutside }: ClickProps, ref) => {
		const childRef = useRef<HTMLElement>(null);

		const controllerRef = useRef<AbortController>(new AbortController());

		useImperativeHandle(ref, () => childRef.current!);

		const onDocumentClick = (e: MouseEvent) => {
			try {
				const eChild = childRef.current;
				const eTarget = e.target as HTMLElement | null;
				if (!eTarget || !eChild) return;

				if (
					eChild.isEqualNode(eTarget) ||
					eChild.contains(eTarget) ||
					(dependency && eTarget.closest(dependency))
				) {
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
	},
);

export default Click;
