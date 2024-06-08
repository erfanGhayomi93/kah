import { cloneElement, useCallback, useEffect, useRef, useState } from 'react';

interface IAnimation {
	animation: string;
	duration?: number;
}

interface AnimatePresenceProps {
	children: ReactNode;
	exit: IAnimation;
	initial: IAnimation;
	disabled?:
		| boolean
		| {
				exit: boolean;
				initial: boolean;
		  };
	onRefLoad?: (el: HTMLElement | null) => void;
}

const AnimatePresence = ({ exit, initial, children, disabled, onRefLoad }: AnimatePresenceProps) => {
	const elRef = useRef<HTMLElement | null>(null);

	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	const [component, setComponent] = useState<React.ReactElement | null>(children || null);

	const [isRender, setIsRender] = useState(Boolean(children));

	const clearDebounce = () => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
	};

	const toggleAnimation = () => {
		if (!elRef.current || disabled) return;

		const isInitial = Boolean(children);
		const { animation, duration } = isInitial ? initial : exit;

		elRef.current.style.animation = `${animation} ${duration ?? 250}ms 1 forwards ease-in-out`;
	};

	const onElementLoad = useCallback(
		(el: HTMLElement | null) => {
			elRef.current = el;

			try {
				onRefLoad?.(elRef.current);
			} catch (e) {
				//
			}

			if (!elRef.current) return;

			toggleAnimation();
		},
		[children],
	);

	useEffect(() => {
		const isVisible = Boolean(children);

		clearDebounce();
		toggleAnimation();

		if (isVisible) {
			setComponent(children as React.ReactElement);
			setIsRender(true);
		} else {
			debounceRef.current = setTimeout(() => {
				setIsRender(false);
				setComponent(null);
			}, exit.duration ?? 250);
		}
	}, [children]);

	if (!isRender) return null;
	return component ? cloneElement(component, { ref: onElementLoad }) : null;
};

export default AnimatePresence;
