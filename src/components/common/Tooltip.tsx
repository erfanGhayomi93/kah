'use client';

import TooltipManager, { TooltipElement } from '@/classes/Tooltip';
import { cloneElement, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

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

const Tooltip = forwardRef<HTMLElement, ITooltipProps>(
	({ placement, interactive, delay, trigger, followCursor, singleton, offset, element, children, content, onShow, onHide }, ref) => {
		const childRef = useRef<HTMLElement | null>(null);

		const tooltipRef = useRef<TooltipElement | null>(null);

		useImperativeHandle(ref, () => childRef.current as HTMLElement);

		useEffect(() => {
			const eChild = childRef.current;
			if (!eChild) return;

			tooltipRef.current = new TooltipElement(eChild);
			tooltipRef.current.setContent(content);

			TooltipManager.add(tooltipRef.current);
		}, [childRef.current]);

		useEffect(() => {
			if (tooltipRef.current) tooltipRef.current.setContent(content);
		}, [content]);

		return cloneElement(children, { ref: childRef });
	},
);

export default Tooltip;
