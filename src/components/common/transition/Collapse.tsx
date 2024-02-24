import { cloneElement, forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';

interface CollapseProps {
	enabled: boolean;
	children: React.ReactElement;
}

const Collapse = forwardRef<HTMLElement, CollapseProps>(({ children, enabled }, ref) => {
	const childRef = useRef<HTMLElement>(null);

	useImperativeHandle(ref, () => childRef.current!);

	useLayoutEffect(() => {
		const eChild = childRef.current;
		if (!eChild) return;

		eChild.style.maxHeight = enabled ? `${eChild.scrollHeight}px` : '0px';
	}, [enabled, childRef.current]);

	return cloneElement(children, {
		ref: childRef,
		style: { overflow: 'hidden', transition: 'max-height 250ms ease-in-out' },
	});
});

export default Collapse;
