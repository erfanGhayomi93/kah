import { cloneElement, forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';

interface FadeProps {
	enabled: boolean;
	children: React.ReactElement;
}

const Fade = forwardRef<HTMLElement, FadeProps>(({ children, enabled }, ref) => {
	const childRef = useRef<HTMLElement>(null);

	useImperativeHandle(ref, () => childRef.current!);

	useLayoutEffect(() => {
		const eChild = childRef.current;
		if (!eChild) return;

		if (!enabled) eChild.style.pointerEvents = 'none';
		eChild.style.opacity = enabled ? '1' : '0';
	}, [enabled]);

	return cloneElement(children, {
		ref: childRef,
		style: { overflow: 'hidden', transition: 'opacity 250ms ease-in-out' },
	});
});

export default Fade;
