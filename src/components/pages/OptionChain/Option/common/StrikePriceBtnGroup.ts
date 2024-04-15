import clsx from 'clsx';
import { type StrikePriceCellRendererProps } from './StrikePriceCellRenderer';

interface IParams {
	isInBasket: boolean;
	side: 'buy' | 'sell';
	params: StrikePriceCellRendererProps;
}

class StrikePriceBtnGroup {
	eGroup!: HTMLDivElement;

	eDropdown!: HTMLUListElement;

	eDropdownBtn!: HTMLButtonElement;

	eDropdownSvg!: SVGSVGElement;

	params: StrikePriceCellRendererProps;

	isInBasket: IParams['isInBasket'];

	data: Option.Root;

	side: IParams['side'];

	private _isActive = false;

	constructor({ isInBasket, params, side }: IParams) {
		this.isInBasket = isInBasket;
		this.data = params.node.data![side]!;
		this.side = side;
		this.params = params;

		this.createGroup();
	}

	private createGroup() {
		this.eGroup = document.createElement('div');
		this.eGroup.setAttribute(
			'class',
			clsx('relative gap-8 flex-items-center', this.side === 'sell' && 'flex-row-reverse'),
		);

		this.eGroup.appendChild(this._createBuyBtn());
		this.eGroup.appendChild(this._createSellBtn());
		this.eGroup.appendChild(this._createTechnicalChartBtn());
		this.eGroup.appendChild(this._createDropdownBtn());
	}

	private createBtn() {
		const btn = document.createElement('button');
		btn.setAttribute(
			'class',
			'size-32 bg-white rounded text-base text-gray-900 flex-justify-center transition-colors',
		);

		return btn;
	}

	private _createBuyBtn() {
		const btn = this.createBtn();
		btn.type = 'button';
		btn.classList.add('hover:bg-success-100', 'hover:text-white');
		btn.textContent = 'B';
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.addSymbolToBasket(this.data, 'buy');
		};

		return btn;
	}

	private _createSellBtn() {
		const btn = this.createBtn();
		btn.type = 'button';
		btn.classList.add('hover:bg-error-100', 'hover:text-white');
		btn.textContent = 'S';
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.addSymbolToBasket(this.data, 'sell');
		};

		return btn;
	}

	private _createTechnicalChartBtn() {
		const btn = this.createBtn();
		btn.type = 'button';
		btn.classList.add('hover:bg-gray-200');
		btn.innerHTML =
			'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="path-1-inside-1_752_14024" fill="white"><path d="M19.9999 20H4V4H5.23079V17.352L8.21226 12.8799L10.6348 15.3026L13.1611 10.8814L15.1136 13.4848L18.9212 9.13303L19.8479 9.94377L15.0404 15.4379L13.3007 13.1183L10.9038 17.3123L8.40317 14.8121L5.76524 18.7692L20 18.769L19.9999 20Z"/></mask><path d="M19.9999 20V21.5H21.4997L21.4999 20.0001L19.9999 20ZM4 20H2.5V21.5H4V20ZM4 4V2.5H2.5V4H4ZM5.23079 4H6.73079V2.5H5.23079V4ZM5.23079 17.352H3.73079V22.3061L6.47886 18.1841L5.23079 17.352ZM8.21226 12.8799L9.27296 11.8193L7.97917 10.5254L6.96419 12.0478L8.21226 12.8799ZM10.6348 15.3026L9.57411 16.3632L10.9628 17.752L11.9372 16.0468L10.6348 15.3026ZM13.1611 10.8814L14.3612 9.98145L12.9914 8.15505L11.8588 10.1372L13.1611 10.8814ZM15.1136 13.4848L13.9136 14.3848L15.0239 15.8653L16.2425 14.4725L15.1136 13.4848ZM18.9212 9.13303L19.9088 8.00404L18.7799 7.01652L17.7923 8.14531L18.9212 9.13303ZM19.8479 9.94377L20.9768 10.9315L21.9647 9.80254L20.8356 8.81478L19.8479 9.94377ZM15.0404 15.4379L13.8404 16.3379L14.9506 17.8183L16.1692 16.4257L15.0404 15.4379ZM13.3007 13.1183L14.5007 12.2183L13.131 10.392L11.9983 12.374L13.3007 13.1183ZM10.9038 17.3123L9.84327 18.373L11.2319 19.7614L12.2062 18.0566L10.9038 17.3123ZM8.40317 14.8121L9.46373 13.7513L8.1699 12.4577L7.15507 13.98L8.40317 14.8121ZM5.76524 18.7692L4.51714 17.9372L2.96254 20.2692L5.76527 20.2692L5.76524 18.7692ZM20 18.769L21.5 18.7691L21.5001 17.269L20 17.269L20 18.769ZM19.9999 18.5H4V21.5H19.9999V18.5ZM5.5 20V4H2.5V20H5.5ZM4 5.5H5.23079V2.5H4V5.5ZM3.73079 4V17.352H6.73079V4H3.73079ZM6.47886 18.1841L9.46032 13.7119L6.96419 12.0478L3.98272 16.5199L6.47886 18.1841ZM7.15156 13.9405L9.57411 16.3632L11.6955 14.242L9.27296 11.8193L7.15156 13.9405ZM11.9372 16.0468L14.4635 11.6256L11.8588 10.1372L9.33244 14.5584L11.9372 16.0468ZM11.9611 11.7814L13.9136 14.3848L16.3136 12.5848L14.3612 9.98145L11.9611 11.7814ZM16.2425 14.4725L20.05 10.1208L17.7923 8.14531L13.9847 12.4971L16.2425 14.4725ZM17.9335 10.262L18.8603 11.0728L20.8356 8.81478L19.9088 8.00404L17.9335 10.262ZM18.7191 8.956L13.9115 14.4502L16.1692 16.4257L20.9768 10.9315L18.7191 8.956ZM16.2404 14.538L14.5007 12.2183L12.1007 14.0183L13.8404 16.3379L16.2404 14.538ZM11.9983 12.374L9.60151 16.568L12.2062 18.0566L14.603 13.8626L11.9983 12.374ZM11.9644 16.2515L9.46373 13.7513L7.3426 15.8728L9.84327 18.373L11.9644 16.2515ZM7.15507 13.98L4.51714 17.9372L7.01335 19.6012L9.65127 15.6441L7.15507 13.98ZM5.76527 20.2692L20 20.269L20 17.269L5.76522 17.2692L5.76527 20.2692ZM18.5 18.7688L18.4999 19.9999L21.4999 20.0001L21.5 18.7691L18.5 18.7688Z" fill="#5D606D" mask="url(#path-1-inside-1_752_14024)"/></svg>';
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.goToTechnicalChart(this.params.data![this.side]!);
		};

		return btn;
	}

	private _createDropdownBtn() {
		this.eDropdownBtn = this.createBtn();
		this.eDropdownBtn.type = 'button';
		this.eDropdownBtn.classList.add('hover:bg-gray-200');
		this.eDropdownBtn.innerHTML =
			'<svg width="2.4rem" height="2.4rem" class="transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 11L12 14L9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
		this.eDropdownSvg = this.eDropdownBtn.querySelector('svg')!;

		this.eDropdownBtn.onclick = () => {
			this.eDropdownSvg.classList[this.isActive ? 'remove' : 'add']('rotate-180');
			this.isActive = !this._isActive;
		};

		return this.eDropdownBtn;
	}

	private createDropdown() {
		try {
			const root = document.querySelector('[grid-id="option-chain"]') as HTMLDivElement | null;
			if (!root) return;

			const btnOffset = this.eDropdownBtn.getBoundingClientRect();
			const gridOffset = root.getBoundingClientRect();

			const dropdownOriginalTop = btnOffset.top + btnOffset.height + 8;
			const maxTop = gridOffset.height;

			this.eDropdown = document.createElement('ul');
			this.eDropdown.setAttribute('class', 'absolute overflow-hidden bg-white rounded');
			this.eDropdown.setAttribute('data-side', this.side);
			this.eDropdown.style.boxShadow = '0px 2px 22px 0px rgba(0, 0, 0, 0.07)';
			this.eDropdown.style.zIndex = '999';
			this.eDropdown.style.width = '248px';
			this.eDropdown.style[this.side === 'buy' ? 'left' : 'right'] = '0px';
			this.eDropdown.style.top = dropdownOriginalTop > maxTop ? '-104px' : '40px';

			const a = document.createElement('li');
			const aBtn = document.createElement('button');
			aBtn.setAttribute(
				'class',
				'w-full h-48 text-base px-16 gap-8 text-gray-900 flex-justify-end hover:btn-hover transition-colors',
			);
			aBtn.type = 'button';
			aBtn.innerHTML =
				'افزودن به دیده‌بان<svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6648 11.123C17.9784 7.9163 15.1115 6 12 6C8.88854 6 6.02161 7.9163 4.33518 11.123C3.88827 11.9704 3.88827 13.0296 4.33518 13.877C6.02161 17.0837 8.88854 19 12 19C15.1115 19 17.9784 17.0837 19.6648 13.877C20.1117 13.0296 20.1117 11.9704 19.6648 11.123ZM18.5771 13.1356C17.1183 15.8993 14.6646 17.5556 12 17.5556C9.33544 17.5556 6.87325 15.8993 5.42292 13.1356C5.22055 12.7407 5.22055 12.2593 5.42292 11.8644C6.88169 9.09111 9.33544 7.44444 12 7.44444C14.6646 7.44444 17.1267 9.10074 18.5771 11.8644C18.7794 12.2593 18.7794 12.7407 18.5771 13.1356Z" fill="currentColor" /><path d="M12.1621 8.88672C10.4166 8.88672 9 10.5045 9 12.4978C9 14.4912 10.4166 16.1089 12.1621 16.1089C13.9075 16.1089 15.3241 14.4912 15.3241 12.4978C15.3241 10.5045 13.9075 8.88672 12.1621 8.88672ZM12.1621 14.6645C11.1165 14.6645 10.2648 13.6919 10.2648 12.4978C10.2648 11.3038 11.1165 10.3312 12.1621 10.3312C13.2076 10.3312 14.0593 11.3038 14.0593 12.4978C14.0593 13.6919 13.2076 14.6645 12.1621 14.6645Z" fill="currentColor" /></svg>';
			aBtn.onclick = (e) => {
				e.stopPropagation();
				this.params.addSymbolToWatchlist(this.data);
				this.removeDropdown();
			};

			const b = document.createElement('li');
			const bBtn = document.createElement('button');
			bBtn.setAttribute(
				'class',
				'w-full h-48 text-base px-16 gap-8 text-gray-900 flex-justify-end hover:btn-hover transition-colors',
			);
			bBtn.type = 'button';
			bBtn.innerHTML =
				'افزودن هشدار<svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.42514 16.8743V17.518C9.42514 18.2009 9.69642 18.8558 10.1793 19.3387C10.6622 19.8216 11.3171 20.0929 12 20.0929C12.6829 20.0929 13.3378 19.8216 13.8207 19.3387C14.3036 18.8558 14.5749 18.2009 14.5749 17.518V16.8743M6.22289 9.7934C6.22183 9.02996 6.37187 8.27386 6.66439 7.56867C6.9569 6.86349 7.38609 6.22318 7.92722 5.68465C8.46836 5.14612 9.11073 4.72001 9.81731 4.43089C10.5239 4.14178 11.2807 3.99537 12.0441 4.00011C15.2297 4.02379 17.7778 6.67164 17.7778 9.86613V10.4371C17.7778 13.319 18.3807 14.9913 18.9117 15.9053C18.9689 16.003 18.9994 16.114 19 16.2272C19.0006 16.3404 18.9713 16.4517 18.9152 16.55C18.859 16.6483 18.7779 16.73 18.6801 16.7869C18.5823 16.8439 18.4712 16.874 18.358 16.8743H5.64199C5.52879 16.874 5.41767 16.8438 5.31984 16.7869C5.22201 16.73 5.14093 16.6482 5.08478 16.5499C5.02862 16.4516 4.99938 16.3403 5.00001 16.2271C5.00064 16.1139 5.0311 16.0029 5.08834 15.9052C5.61967 14.9912 6.22289 13.3189 6.22289 10.4371L6.22289 9.7934Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>';
			bBtn.onclick = (e) => {
				e.stopPropagation();
				this.params.addAlert(this.data);
				this.removeDropdown();
			};

			a.appendChild(aBtn);
			b.appendChild(bBtn);
			this.eDropdown.appendChild(a);
			this.eDropdown.appendChild(b);

			this.eGroup.appendChild(this.eDropdown);
		} catch (e) {
			//
		}
	}

	private removeDropdown() {
		if (this.eDropdown) this.eDropdown.remove();
	}

	private onWindowClick(e: MouseEvent) {
		const eTarget = e.target as HTMLElement;

		if (!eTarget.isConnected || !this.eDropdown) return;

		if (
			this.eDropdownBtn.isEqualNode(eTarget) ||
			this.eDropdownBtn.contains(eTarget) ||
			this.eDropdown.isEqualNode(eTarget) ||
			this.eDropdown.contains(eTarget)
		)
			return;

		this.isActive = false;
	}

	private set isActive(value: boolean) {
		this._isActive = value;
		this.eDropdownSvg.classList[value ? 'add' : 'remove']('rotate-180');

		if (value) {
			this.createDropdown();
			window.addEventListener('click', (e) => this.onWindowClick(e));
		} else this.eDropdown?.remove();
	}
}

export default StrikePriceBtnGroup;
