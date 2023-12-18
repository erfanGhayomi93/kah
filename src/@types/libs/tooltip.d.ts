namespace AppTooltip {
	export type Placement =
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'right'
		| 'right-start'
		| 'right-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'left'
		| 'left-start'
		| 'left-end';

	export type Interactive = boolean;

	export type Delay = number | [number, number];

	export type Trigger = 'click' | 'hover';

	export type FollowCursor = boolean | 'horizontal' | 'vertical';

	export type Element = HTMLElement;

	export type Singleton = boolean;

	export type Offset = number | [number, number];

	export type Timeout = null | NodeJS.Timeout;

	export type AbortController = AbortController;
}
