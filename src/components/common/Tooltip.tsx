'use client';

import TooltipManager, { TooltipElement } from '@/classes/Tooltip';
import { cloneElement, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

export interface ITooltipProps {
	placement?: AppTooltip.Placement;
	interactive?: AppTooltip.Interactive;
	delay?: AppTooltip.Delay;
	trigger?: AppTooltip.Trigger;
	followCursor?: AppTooltip.FollowCursor;
	singleton?: AppTooltip.Singleton;
	offset?: AppTooltip.Offset;
	element?: AppTooltip.Element;
	children: React.ReactElement;
	content: string;
	onShow?: () => void;
	onHide?: () => void;
}

const Tooltip = forwardRef<HTMLElement, ITooltipProps>(({ children, placement, content, offset }, ref) => {
	const childRef = useRef<HTMLElement | null>(null);

	const tooltipRef = useRef<TooltipElement | null>(null);

	useImperativeHandle(ref, () => childRef.current!);

	useLayoutEffect(() => {
		const eChild = childRef.current;
		if (!eChild) return;

		tooltipRef.current = new TooltipElement(eChild);
		tooltipRef.current.setContent(content);
		if (offset) tooltipRef.current.offset = offset;
		if (placement) tooltipRef.current.placement = placement;

		TooltipManager.add(tooltipRef.current);
	}, [childRef.current]);

	useEffect(() => {
		if (tooltipRef.current) tooltipRef.current.setContent(content);
	}, [content]);

	return cloneElement(children, { ref: childRef });
});

export default Tooltip;
