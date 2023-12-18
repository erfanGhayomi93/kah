import { getRndInteger } from '@/utils/helpers';
import clsx from 'clsx';

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

	private _delay: AppTooltip.Delay = [500, 50];

	private _trigger: AppTooltip.Trigger = 'hover';

	private readonly _followCursor: AppTooltip.FollowCursor = false;

	private _offset: AppTooltip.Offset = 0;

	private _eTooltip?: AppTooltip.Element = undefined;

	private readonly _element: AppTooltip.Element;

	private _content: HTMLElement | string | null = null;

	private readonly _abortController: AppTooltip.AbortController;

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
			clsx(
				'common-tooltip-container common-tooltip-hidden',
				`common-tooltip-${this._placement}`,
				this._interactive && 'common-tooltip-interactive',
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
		const eTooltip = this._eTooltip!;

		eTooltip.setAttribute(
			'class',
			clsx('common-tooltip-container', `common-tooltip-${this._placement}`, this._interactive && 'common-tooltip-interactive'),
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
		if (this._eTooltip) this._eTooltip.remove();
		this._eTooltip = undefined;
	}

	public adjust() {
		if (!this._eTooltip) return;

		const offset = this._element.getBoundingClientRect();
		const { width: tooltipWidth, height: tooltipHeight } = this._eTooltip.getBoundingClientRect();

		const [paddingX, paddingY] = Array.isArray(this._offset) ? this._offset : [this._offset, this._offset];

		let left = offset.left + offset.width / 2 - tooltipWidth / 2;
		left += paddingY;
		left = Math.max(0, Math.min(window.innerWidth - offset.width, left));

		let top = offset.top - tooltipHeight;
		top += paddingX - 4;
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

	// Getter
	public get id() {
		return this._id;
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

	public get offset() {
		return this._offset;
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

	// Setter
	set offset(value: AppTooltip.Offset) {
		this._offset = value;
	}

	set placement(value: AppTooltip.Placement) {
		this._placement = value;
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

	constructor() {
		super();

		Object.seal(this);
	}

	public add(tooltip: TooltipElement) {
		if (tooltip.trigger === 'click') this.addClickEvents(tooltip);
		else if (tooltip.trigger === 'hover') this.addMouseEvents(tooltip);
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
		this.clearDelay();
		this._tooltip = tooltip;

		if (this._tooltip.isActive) {
			this._tooltip.update();
			this._tooltip.adjust();
		} else {
			this._tooltip!.create();
			this._tooltip!.append();
			this.setDelay(() => {
				this._tooltip!.unhide();
				this._tooltip!.adjust();
			}, 0);
		}
	}

	private onMouseleaveEvent() {
		this.setDelay(() => {
			if (this._tooltip) this._tooltip.hide();
		}, 0);
	}

	private onMousemoveEvent(e: MouseEvent) {
		//
	}

	private onClickEvent() {
		//
	}

	setDelay(callback: () => void, delayIndex: number) {
		if (!this._tooltip) return;

		const delay = this._tooltip.delay;

		if (typeof delay === 'number' && delay > 0) this._timeout = setTimeout(() => callback(), delay);
		else if (Array.isArray(delay) && delay[delayIndex] > 0) this._timeout = setTimeout(() => callback(), delay[delayIndex]);
		else callback();
	}

	clearDelay() {
		if (this._timeout) clearTimeout(this._timeout);
	}
}

const Tooltip = new TooltipManager();

export { TooltipElement };
export default Tooltip;
