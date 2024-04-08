import { useDebounce } from '@/hooks';
import { cloneElement, forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';

interface FadeProps {
	enabled: boolean;
	dependencies?: unknown[];
	children: React.ReactElement;
}

const Fade = forwardRef<HTMLElement, FadeProps>(({ children, dependencies = [], enabled }, ref) => {
	const childRef = useRef<HTMLElement>(null);

	const { setDebounce } = useDebounce();

	const [isRendered, setIsRendered] = useState(enabled);

	useImperativeHandle(ref, () => childRef.current!);

	useLayoutEffect(() => {
		if (enabled) setIsRendered(true);

		const eChild = childRef.current;
		if (!eChild) return;

		eChild.style.pointerEvents = enabled ? '' : 'none';
		eChild.style.opacity = enabled ? '1' : '0';

		if (!enabled) setDebounce(() => setIsRendered(false), 500);
	}, [childRef.current, JSON.stringify([enabled, ...dependencies])]);

	if (!isRendered) return null;

	return cloneElement(children, {
		ref: childRef,
		style: { overflow: 'hidden', transition: 'opacity 250ms ease-in-out' },
	});
});

export default Fade;
