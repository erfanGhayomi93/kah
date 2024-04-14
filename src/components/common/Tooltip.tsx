'use client';

import TooltipManager, { TooltipElement } from '@/classes/Tooltip';
import { cloneElement, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

export interface ITooltipProps {
	placement?: AppTooltip.Placement;
	interactive?: AppTooltip.Interactive;
	delay?: AppTooltip.Delay;
	trigger?: AppTooltip.Trigger;
	followCursor?: AppTooltip.FollowCursor;
	animation?: AppTooltip.Animation;
	offset?: AppTooltip.Offset;
	disabled?: AppTooltip.Disabled;
	element?: AppTooltip.Element;
	children: React.ReactElement;
	content: string;
	onShow?: () => void;
	onHide?: () => void;
}

const Tooltip = forwardRef<HTMLElement, ITooltipProps>(
	({ children, animation = true, disabled, placement, content, offset }, ref) => {
		const childRef = useRef<HTMLElement | null>(null);

		const tooltipRef = useRef<TooltipElement | null>(null);

		useImperativeHandle(ref, () => childRef.current!);

		useLayoutEffect(
			() => () => {
				if (tooltipRef.current) tooltipRef.current.abortController.abort();
			},
			[],
		);

		useLayoutEffect(() => {
			const eChild = childRef.current;
			if (!eChild || tooltipRef.current) return;

			tooltipRef.current = new TooltipElement(eChild);
			tooltipRef.current.setContent(content);
			tooltipRef.current.disabled = Boolean(disabled);
			tooltipRef.current.animation = Boolean(animation);
			if (offset) tooltipRef.current.setOffset(offset);
			if (placement) tooltipRef.current.placement = placement;

			TooltipManager.add(tooltipRef.current);
		}, [childRef.current]);

		useEffect(() => {
			if (tooltipRef.current) tooltipRef.current.setContent(content);
		}, [content]);

		useEffect(() => {
			if (tooltipRef.current) tooltipRef.current.disabled = Boolean(disabled);
		}, [disabled]);

		useEffect(() => {
			if (tooltipRef.current && placement) tooltipRef.current.placement = placement;
		}, [placement]);

		useEffect(() => {
			if (tooltipRef.current && offset) tooltipRef.current.setOffset(offset);
		}, [offset]);

		useEffect(() => {
			if (tooltipRef.current) tooltipRef.current.animation = Boolean(animation);
		}, [animation]);

		return cloneElement(children, { ref: childRef });
	},
);

export default Tooltip;
