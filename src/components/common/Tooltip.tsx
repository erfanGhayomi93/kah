'use client';

import Tippy, { TippyProps } from '@tippyjs/react';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface ITooltipProps extends TippyProps {}

const Tooltip = forwardRef<HTMLElement, ITooltipProps>(({ children, ...props }, ref) => {
	const childRef = useRef<HTMLElement>();

	useImperativeHandle(ref, () => childRef.current!);

	return (
		<Tippy {...props} ref={ref}>
			{children}
		</Tippy>
	);
});

export default Tooltip;
