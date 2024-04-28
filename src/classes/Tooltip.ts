import { cn, getRndInteger } from '@/utils/helpers';

class TooltipWrapper {
	private readonly _wrapperId = '__tooltip';

	protected readonly eWrapper: HTMLDivElement;

	constructor() {
		this.eWrapper = document.getElementById(this._wrapperId) as HTMLDivElement;
	}
}

class TooltipElement extends TooltipWrapper {
	private _id: string;

	private readonly _defaultId = 'app-tooltip-ykMAPxAQtQ';

	private _placement: AppTooltip.Placement = 'top';

	private _interactive: AppTooltip.Interactive = false;

	private _delay: AppTooltip.Delay = [0, 100];

	private _animation: AppTooltip.Animation = true;

	private _trigger: AppTooltip.Trigger = 'hover';

	private readonly _followCursor: AppTooltip.FollowCursor = false;

	private _offsetY: AppTooltip.Offset = [0, 4]; // top - bottom

	private _offsetX: AppTooltip.Offset = [4, 0]; // left - right

	private _offsetXY: AppTooltip.Offset = [4, 4]; // top-left - bottom-right

	private _disabled: AppTooltip.Disabled = false;

	private _eTooltip?: AppTooltip.Element = undefined;

	private _element: AppTooltip.Element;

	private _content: HTMLElement | string | null = null;

	private readonly _abortController: AppTooltip.Abort;

	public isHidden: AppTooltip.Hidden = true;

	constructor(element: AppTooltip.Element) {
		super();

		this._id = this._defaultId;
		this._element = element;
		this._abortController = new AbortController();
	}

	public create() {
		if (this.isActive) {
			this.update();
			return;
		}

		this._eTooltip = document.createElement('div');
		this._eTooltip.id = this._id;
		this._eTooltip.setAttribute(
			'class',
			cn(
				'common-tooltip-container common-tooltip-hidden',
				`common-tooltip-${this._placement}`,
				this._interactive && 'common-tooltip-interactive',
				!this.isHidden && this._animation && 'common-tooltip-animation',
			),
		);

		const tooltipBody = document.createElement('div');
		tooltipBody.classList.add('common-tooltip-body');

		if (typeof this._content === 'string') tooltipBody.textContent = this._content;
		else if (this._content === null) tooltipBody.innerHTML = '';
		else tooltipBody.appendChild(this._content);

		this._eTooltip.appendChild(tooltipBody);
	}

	public update() {
		const eTooltip = this._eTooltip;
		if (!eTooltip) return;

		if (this.disabled) {
			if (this.isActive) this.hide();
			return;
		}

		eTooltip.setAttribute(
			'class',
			cn(
				'common-tooltip-container',
				`common-tooltip-${this._placement}`,
				this._interactive && 'common-tooltip-interactive',
				!this.isHidden && this._animation && 'common-tooltip-animation',
			),
		);
		eTooltip.innerHTML = '';

		const tooltipBody = document.createElement('div');
		tooltipBody.classList.add('common-tooltip-body');

		if (typeof this._content === 'string') tooltipBody.textContent = this._content;
		else if (this._content === null) tooltipBody.innerHTML = '';
		else tooltipBody.appendChild(this._content);

		eTooltip.appendChild(tooltipBody);
	}

	public append() {
		this.eWrapper.appendChild(this.eTooltip!);
	}

	public hide() {
		if (this._eTooltip) this._eTooltip.classList.add('common-tooltip-hidden');
	}

	public unhide() {
		if (this._eTooltip) this._eTooltip.classList.remove('common-tooltip-hidden');
	}

	public destroy() {
		if (this._eTooltip) {
			this.hide();
			this._eTooltip.remove();
			this.abortController.abort();
		}
		this._eTooltip = undefined;
	}

	public adjust() {
		if (!this._eTooltip) return;

		const offset = this._element.getBoundingClientRect();
		const { width: tooltipWidth, height: tooltipHeight } = this._eTooltip.getBoundingClientRect();

		const [paddingX, paddingY] = this.padding;

		let left = 0;
		let top = 0;

		switch (this._placement) {
			case 'bottom':
				left = offset.left + offset.width / 2 - tooltipWidth / 2 + paddingX;
				top = offset.top + offset.height + paddingY;
				break;
			case 'top':
				left = offset.left + offset.width / 2 - tooltipWidth / 2 + paddingX;
				top = offset.top - tooltipHeight - paddingY;
				break;
			case 'left':
				left = offset.left - tooltipWidth - paddingX;
				top = offset.top + offset.height / 2 - tooltipHeight / 2 - paddingY;
				break;
			case 'right':
				left = offset.left + offset.width + tooltipWidth + paddingX;
				top = offset.top + offset.height / 2 - tooltipHeight / 2 - paddingY;
				break;
			default:
				break;
		}

		left = Math.max(0, Math.min(window.innerWidth - offset.width, left));
		top = Math.max(0, Math.min(window.innerHeight - offset.height, top));

		this._eTooltip.style.transform = `translate(${left}px,${top}px)`;
	}

	public setContent(value: string | HTMLElement) {
		this._content = value;
	}

	public setSingleton(value: AppTooltip.Singleton) {
		if (!value) this._id = `app-tooltip-${getRndInteger(10000, 99999)}`;
		else this._id = this._defaultId;
	}

	public setOffset(value: AppTooltip.Offset, placement?: AppTooltip.Placement) {
		const p = placement ?? this._placement;
		this._placement = p;

		switch (p) {
			case 'top':
			case 'bottom':
				this._offsetY = value;
				break;
			case 'left':
			case 'right':
				this._offsetX = value;
				break;
			default:
				this._offsetXY = value;
				break;
		}
	}

	// Getter
	public get id() {
		return this._id;
	}

	public get padding(): [number, number] {
		switch (this._placement) {
			case 'top':
			case 'bottom':
				return Array.isArray(this._offsetY) ? this._offsetY : [this._offsetY, this._offsetY];
			case 'left':
			case 'right':
				return Array.isArray(this._offsetX) ? this._offsetX : [this._offsetX, this._offsetX];
			default:
				return Array.isArray(this._offsetXY) ? this._offsetXY : [this._offsetXY, this._offsetXY];
		}
	}

	public get element() {
		return this._element;
	}

	public get followCursor() {
		return this._followCursor;
	}

	public get abortController() {
		return this._abortController;
	}

	public get placement() {
		return this._placement;
	}

	public get interactive() {
		return this._interactive;
	}

	public get delay() {
		return this._delay;
	}

	public get trigger() {
		return this._trigger;
	}

	public get isActive() {
		this._eTooltip = document.getElementById(this._id) ?? undefined;
		return Boolean(this._eTooltip);
	}

	public get content() {
		return this._content;
	}

	public get eTooltip() {
		return this._eTooltip;
	}

	public get disabled() {
		return this._disabled;
	}

	// Setter
	set disabled(value: AppTooltip.Disabled) {
		this._disabled = value;

		if (value && this.isActive) this.hide();
		else if (!value && !this.isActive) this.unhide();
	}

	set element(el: AppTooltip.Element) {
		this._element = el;
	}

	set placement(value: AppTooltip.Placement) {
		this._placement = value;
	}

	set animation(value: AppTooltip.Animation) {
		this._animation = value;
	}

	set interactive(value: AppTooltip.Interactive) {
		this._interactive = value;
	}

	set delay(value: AppTooltip.Delay) {
		this._delay = value;
	}

	set trigger(value: AppTooltip.Trigger) {
		this._trigger = value;
	}
}

class TooltipManager extends TooltipWrapper {
	private _tooltip?: TooltipElement = undefined;

	private _timeout?: AppTooltip.Timeout = null;

	private _hidden: AppTooltip.Hidden = true;

	constructor() {
		super();
		Object.seal(this);
	}

	public add(tooltip: TooltipElement) {
		if (tooltip.trigger === 'click') this.addClickEvents(tooltip);
		else if (tooltip.trigger === 'hover') this.addMouseEvents(tooltip);
	}

	public removeListeners(tooltip: TooltipElement) {
		tooltip.abortController.abort();
	}

	// Add events
	private addMouseEvents(tooltip: TooltipElement) {
		tooltip.element.addEventListener('mouseenter', () => this.onMouseenterEvent(tooltip), {
			signal: tooltip.abortController.signal,
		});

		tooltip.element.addEventListener('mouseleave', () => this.onMouseleaveEvent(), {
			signal: tooltip.abortController.signal,
		});

		tooltip.element.addEventListener('blur', () => this.onMouseleaveEvent(), {
			signal: tooltip.abortController.signal,
		});

		if (tooltip.followCursor === false) {
			tooltip.element.addEventListener('mousemove', (e) => this.onMousemoveEvent(e), {
				signal: tooltip.abortController.signal,
			});
		}
	}

	private addClickEvents(tooltip: TooltipElement) {
		tooltip.element.addEventListener('click', () => this.onClickEvent(), {
			signal: tooltip.abortController.signal,
		});
	}

	// Listeners
	private onMouseenterEvent(tooltip: TooltipElement) {
		this._tooltip = tooltip;
		if (this._tooltip.disabled) return;

		this.clearDelay();

		if (!this._hidden) this._tooltip.isHidden = false;

		if (this._tooltip.isActive) {
			if (this._hidden) {
				this.setDelay(() => {
					if (!this._tooltip) return;

					this._tooltip.update();
					this._tooltip.adjust();

					this._hidden = false;
					this._tooltip.isHidden = false;
				}, 0);
			} else {
				this._tooltip.update();
				this._tooltip.adjust();

				this._hidden = false;
				this._tooltip.isHidden = false;
			}
		} else {
			this._tooltip!.create();
			this._tooltip!.append();
			this.setDelay(() => {
				this._tooltip!.unhide();
				this._tooltip!.adjust();
			}, 0);

			this._hidden = false;
		}
	}

	private onMouseleaveEvent() {
		if (this._tooltip) this._tooltip.isHidden = true;

		this.setDelay(() => {
			this._hidden = true;

			if (!this._tooltip) return;
			this._tooltip.hide();
		}, 1);
	}

	private onMousemoveEvent(e: MouseEvent) {
		//
	}

	private onClickEvent() {
		//
	}

	setDelay(callback: () => void, delayIndex: number) {
		if (!this._tooltip) return;

		this.clearDelay();

		const delay = this._tooltip.delay;

		if (typeof delay === 'number' && delay > 0) this._timeout = setTimeout(() => callback(), delay);
		else if (Array.isArray(delay) && delay[delayIndex] > 0)
			this._timeout = setTimeout(() => callback(), delay[delayIndex]);
		else callback();
	}

	clearDelay() {
		if (this._timeout) clearTimeout(this._timeout);
	}
}

const Tooltip = new TooltipManager();

export { TooltipElement };
export default Tooltip;
