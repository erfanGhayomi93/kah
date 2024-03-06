declare namespace AppTooltip {
	export type Placement =
		| 'top'
		| 'top-right'
		| 'top-left'
		| 'right'
		| 'bottom'
		| 'bottom-right'
		| 'bottom-left'
		| 'left';

	export type Interactive = boolean;

	export type Delay = number | [number, number];

	export type Trigger = 'click' | 'hover';

	export type FollowCursor = boolean | 'horizontal' | 'vertical';

	export type Element = HTMLElement;

	export type Hidden = boolean;

	export type Animation = boolean;

	export type Singleton = boolean;

	export type Disabled = boolean;

	export type Offset = number | [number, number];

	export type Timeout = null | NodeJS.Timeout;

	export type Abort = AbortController;
}
