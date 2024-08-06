import { cloneElement, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface KeyDownProps {
	keys: string[];
	enabled?: boolean;
	children: React.ReactElement;
	dependencies?: unknown[];
	onKeyDown: (key: string) => void;
}

const KeyDown = forwardRef<HTMLElement, KeyDownProps>(
	({ keys, enabled = true, dependencies = [], children, onKeyDown }, ref) => {
		const childRef = useRef<HTMLElement>(null);

		const controllerRef = useRef<AbortController>(new AbortController());

		useImperativeHandle(ref, () => childRef.current!);

		const onDocumentKeyDown = (e: KeyboardEvent) => {
			try {
				const { code } = e;
				if (!keys.includes(code)) return;

				e.preventDefault();
				e.stopPropagation();

				onKeyDown(code);
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

				window.addEventListener('keydown', onDocumentKeyDown, {
					signal: getSignal(),
					capture: true,
				});
			}

			return () => {
				abort();
			};
		}, [JSON.stringify({ enabled, dependencies })]);

		useEffect(
			() => () => {
				abort();
			},
			[],
		);

		return cloneElement(children, { ref: childRef });
	},
);

export default KeyDown;
