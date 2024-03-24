import { type IBuySellModal } from '@/features/slices/modalSlice';
import { type ICellRendererComp, type ICellRendererParams } from '@ag-grid-community/core';
import clsx from 'clsx';
import { type ITableData } from '../OptionTable';

type StrikePriceCellRendererProps = ICellRendererParams<ITableData, number> & {
	activeRowId: number;
	basket: TOrderBasket[];
	addBuySellModal: (props: IBuySellModal) => void;
	addSymbolToBasket: (data: Option.Root, side: TOptionSides) => void;
	removeSymbolFromBasket: (data: Option.Root) => void;
	addSymbolToWatchlist: (data: Option.Root) => void;
	addAlert: (data: Option.Root) => void;
	goToTechnicalChart: (data: Option.Root) => void;
};

class StrikePriceCellRenderer implements ICellRendererComp<ITableData> {
	eGui!: HTMLDivElement;

	eLeftOverlay: HTMLDivElement | null = null;

	eRightOverlay: HTMLDivElement | null = null;

	eBuyDropdown: HTMLUListElement | null = null;

	eSellDropdown: HTMLUListElement | null = null;

	eventListener!: () => void;

	init(params: StrikePriceCellRendererProps) {
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center w-full');

		this.eGui.textContent = String(params.valueFormatted ?? '−');
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: StrikePriceCellRendererProps) {
		try {
			const {
				activeRowId,
				node: { rowIndex },
			} = params;

			if (rowIndex === activeRowId) {
				this.removeRowOverlay();
				this.createRowOverlay(params);
			} else this.removeRowOverlay();
		} catch (e) {
			//
		}

		return true;
	}

	createDropdown(params: StrikePriceCellRendererProps, parent: HTMLElement, side: 'buy' | 'sell') {
		try {
			if ((side === 'buy' && this.eBuyDropdown) || (side === 'sell' && this.eSellDropdown)) {
				this.removeDropdown(side);
				return;
			}

			const eDropdown = document.createElement('ul');
			eDropdown.setAttribute('class', 'absolute overflow-hidden bg-white rounded');
			eDropdown.setAttribute('data-side', side);
			eDropdown.style.boxShadow = '0px 2px 22px 0px rgba(0, 0, 0, 0.07)';
			eDropdown.style.zIndex = '999';
			eDropdown.style.width = '248px';
			eDropdown.style[side === 'buy' ? 'left' : 'right'] = '0px';
			eDropdown.style.top = '40px';

			const a = document.createElement('li');
			const aBtn = document.createElement('button');
			aBtn.setAttribute(
				'class',
				'w-full h-48 text-base px-16 gap-8 text-gray-900 flex-justify-end hover:bg-primary-100 transition-colors',
			);
			aBtn.type = 'button';
			aBtn.innerHTML =
				'افزودن به دیده‌بان<svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6648 11.123C17.9784 7.9163 15.1115 6 12 6C8.88854 6 6.02161 7.9163 4.33518 11.123C3.88827 11.9704 3.88827 13.0296 4.33518 13.877C6.02161 17.0837 8.88854 19 12 19C15.1115 19 17.9784 17.0837 19.6648 13.877C20.1117 13.0296 20.1117 11.9704 19.6648 11.123ZM18.5771 13.1356C17.1183 15.8993 14.6646 17.5556 12 17.5556C9.33544 17.5556 6.87325 15.8993 5.42292 13.1356C5.22055 12.7407 5.22055 12.2593 5.42292 11.8644C6.88169 9.09111 9.33544 7.44444 12 7.44444C14.6646 7.44444 17.1267 9.10074 18.5771 11.8644C18.7794 12.2593 18.7794 12.7407 18.5771 13.1356Z" fill="currentColor" /><path d="M12.1621 8.88672C10.4166 8.88672 9 10.5045 9 12.4978C9 14.4912 10.4166 16.1089 12.1621 16.1089C13.9075 16.1089 15.3241 14.4912 15.3241 12.4978C15.3241 10.5045 13.9075 8.88672 12.1621 8.88672ZM12.1621 14.6645C11.1165 14.6645 10.2648 13.6919 10.2648 12.4978C10.2648 11.3038 11.1165 10.3312 12.1621 10.3312C13.2076 10.3312 14.0593 11.3038 14.0593 12.4978C14.0593 13.6919 13.2076 14.6645 12.1621 14.6645Z" fill="currentColor" /></svg>';
			aBtn.onclick = (e) => {
				e.stopPropagation();
				params.addSymbolToWatchlist(params.node.data![side]!);
				this.removeDropdown(side);
			};

			const b = document.createElement('li');
			const bBtn = document.createElement('button');
			bBtn.setAttribute(
				'class',
				'w-full h-48 text-base px-16 gap-8 text-gray-900 flex-justify-end hover:bg-primary-100 transition-colors',
			);
			bBtn.type = 'button';
			bBtn.innerHTML =
				'افزودن هشدار<svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.42514 16.8743V17.518C9.42514 18.2009 9.69642 18.8558 10.1793 19.3387C10.6622 19.8216 11.3171 20.0929 12 20.0929C12.6829 20.0929 13.3378 19.8216 13.8207 19.3387C14.3036 18.8558 14.5749 18.2009 14.5749 17.518V16.8743M6.22289 9.7934C6.22183 9.02996 6.37187 8.27386 6.66439 7.56867C6.9569 6.86349 7.38609 6.22318 7.92722 5.68465C8.46836 5.14612 9.11073 4.72001 9.81731 4.43089C10.5239 4.14178 11.2807 3.99537 12.0441 4.00011C15.2297 4.02379 17.7778 6.67164 17.7778 9.86613V10.4371C17.7778 13.319 18.3807 14.9913 18.9117 15.9053C18.9689 16.003 18.9994 16.114 19 16.2272C19.0006 16.3404 18.9713 16.4517 18.9152 16.55C18.859 16.6483 18.7779 16.73 18.6801 16.7869C18.5823 16.8439 18.4712 16.874 18.358 16.8743H5.64199C5.52879 16.874 5.41767 16.8438 5.31984 16.7869C5.22201 16.73 5.14093 16.6482 5.08478 16.5499C5.02862 16.4516 4.99938 16.3403 5.00001 16.2271C5.00064 16.1139 5.0311 16.0029 5.08834 15.9052C5.61967 14.9912 6.22289 13.3189 6.22289 10.4371L6.22289 9.7934Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>';
			bBtn.onclick = (e) => {
				e.stopPropagation();
				params.addAlert(params.node.data![side]!);
				this.removeDropdown(side);
			};

			const c = document.createElement('li');
			const cBtn = document.createElement('button');
			cBtn.setAttribute(
				'class',
				'w-full h-48 text-base px-16 gap-8 text-gray-900 flex-justify-end hover:bg-primary-100 transition-colors',
			);
			cBtn.type = 'button';
			cBtn.innerHTML =
				'ابزار تکنیکال<svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.29395 10.5625V16.0505" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path d="M12.0312 7.9375V16.0519" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path d="M15.7061 13.4609V16.0489" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path fill-rule="evenodd" clip-rule="evenodd" d="M15.7486 4H8.25143C5.6381 4 4 5.84967 4 8.46813V15.5319C4 18.1503 5.63048 20 8.25143 20H15.7486C18.3695 20 20 18.1503 20 15.5319V8.46813C20 5.84967 18.3695 4 15.7486 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>';
			cBtn.onclick = (e) => {
				e.stopPropagation();
				params.goToTechnicalChart(params.node.data![side]!);
				this.removeDropdown(side);
			};

			a.appendChild(aBtn);
			b.appendChild(bBtn);
			c.appendChild(cBtn);
			eDropdown.appendChild(a);
			eDropdown.appendChild(b);
			eDropdown.appendChild(c);
			parent.appendChild(eDropdown);

			if (side === 'buy') this.eBuyDropdown = eDropdown;
			else this.eSellDropdown = eDropdown;
		} catch (e) {
			//
		}
	}

	removeDropdown(side: 'buy' | 'sell') {
		if (side === 'buy') {
			if (this.eBuyDropdown) this.eBuyDropdown.remove();
			this.eBuyDropdown = null;
		} else {
			if (this.eSellDropdown) this.eSellDropdown.remove();
			this.eSellDropdown = null;
		}
	}

	createButton() {
		const btn = document.createElement('button');
		btn.setAttribute(
			'class',
			'size-32 bg-white rounded hover:bg-gray-200 text-base text-gray-900 flex-justify-center  transition-colors',
		);

		return btn;
	}

	createBtnGroup(params: StrikePriceCellRendererProps, side: 'buy' | 'sell', data: Option.Root | undefined) {
		const isInBasket =
			params.basket.findIndex((item) => params.data![side]?.symbolInfo.symbolISIN === item.symbolISIN) > -1;
		const g = document.createElement('div');
		g.setAttribute('class', clsx('relative gap-8 flex-items-center', side === 'buy' && 'flex-row-reverse'));

		if (!data) return g;

		const a = this.createButton();
		a.type = 'button';
		a.textContent = 'B';
		a.onclick = (e) => {
			e.stopPropagation();
			params.addBuySellModal({
				side: 'buy',
				mode: 'create',
				symbolType: 'option',
				symbolISIN: data.symbolInfo.symbolISIN,
				symbolTitle: data.symbolInfo.symbolTitle,
			});
		};

		const b = this.createButton();
		b.type = 'button';
		b.textContent = 'S';
		b.onclick = (e) => {
			e.stopPropagation();
			params.addBuySellModal({
				side: 'sell',
				mode: 'create',
				symbolType: 'option',
				symbolISIN: data.symbolInfo.symbolISIN,
				symbolTitle: data.symbolInfo.symbolTitle,
			});
		};

		const c = this.createButton();
		c.type = 'button';
		c.innerHTML = isInBasket
			? '<svg width="2rem" height="2rem" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.18773 4.0097C4.86229 3.68427 4.33465 3.68427 4.00921 4.0097C3.68378 4.33514 3.68378 4.86277 4.00921 5.18822L8.82148 10.0005L4.00926 14.8127C3.68383 15.1381 3.68383 15.6658 4.00926 15.9912C4.3347 16.3166 4.86234 16.3166 5.18777 15.9912L9.99998 11.179L14.8122 15.9912C15.1376 16.3166 15.6653 16.3166 15.9907 15.9912C16.3161 15.6658 16.3161 15.1381 15.9907 14.8127L11.1785 10.0005L15.9908 5.18822C16.3162 4.86277 16.3162 4.33514 15.9908 4.0097C15.6654 3.68427 15.1377 3.68427 14.8123 4.0097L9.99998 8.82197L5.18773 4.0097Z" fill="currentColor" /></svg>'
			: '<svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5249 18.7505H8.47494C7.77912 18.7492 7.10537 18.5062 6.56904 18.0629C6.03271 17.6196 5.66715 17.0036 5.53494 16.3205L4.53744 11.1305C4.48642 10.8715 4.49348 10.6044 4.5581 10.3485C4.62273 10.0925 4.74331 9.85412 4.91117 9.6504C5.07903 9.44667 5.28998 9.28271 5.52882 9.17033C5.76767 9.05795 6.02848 8.99994 6.29244 9.00048H17.7074C17.9746 8.9943 18.2396 9.04817 18.4832 9.1581C18.7267 9.26804 18.9424 9.43124 19.1144 9.63566C19.2865 9.84009 19.4104 10.0805 19.4771 10.3392C19.5439 10.598 19.5517 10.8683 19.4999 11.1305L18.5024 16.3205C18.369 17.01 17.998 17.6308 17.4539 18.0749C16.9098 18.5189 16.2272 18.758 15.5249 18.7505Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 5.25L8.25 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.5 5.25L15.75 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.75 12.75V14.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.25 12.75V14.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
		c.onclick = (e) => {
			e.stopPropagation();

			if (isInBasket) params.removeSymbolFromBasket(data);
			else params.addSymbolToBasket(data, side === 'buy' ? 'call' : 'put');
		};

		const d = this.createButton();
		d.type = 'button';
		d.innerHTML =
			'<svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 11L12 14L9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
		d.onclick = (e) => {
			e.stopPropagation();
			this.createDropdown(params, g, side);
		};

		g.appendChild(a);
		g.appendChild(b);
		g.appendChild(c);
		g.appendChild(d);

		return g;
	}

	createOverlay() {
		const overlay = document.createElement('div');
		overlay.style.backgroundColor = 'rgba(229, 238, 255, 0.8)';
		overlay.style.zIndex = '99';
		overlay.style.height = '48px';
		overlay.style.position = 'absolute';
		overlay.style.top = '0';
		overlay.style.width = '192px';
		overlay.style.display = 'flex';
		overlay.style.justifyContent = 'center';
		overlay.style.alignItems = 'center';

		return overlay;
	}

	createRowOverlay(params: StrikePriceCellRendererProps) {
		const {
			node: { data },
		} = params;
		if (!data) return;

		const leftButtons = this.createBtnGroup(params, 'sell', data.sell);
		const rightButtons = this.createBtnGroup(params, 'buy', data.buy);

		this.eLeftOverlay = this.createOverlay();
		this.eLeftOverlay.style.right = '100%';

		this.eRightOverlay = this.createOverlay();
		this.eRightOverlay.style.left = '100%';

		this.eLeftOverlay.appendChild(leftButtons);
		this.eRightOverlay.appendChild(rightButtons);
		this.eGui.appendChild(this.eLeftOverlay);
		this.eGui.appendChild(this.eRightOverlay);
	}

	removeRowOverlay() {
		if (this.eLeftOverlay) {
			this.eLeftOverlay.remove();
			this.eLeftOverlay = null;
		}

		if (this.eRightOverlay) {
			this.eRightOverlay.remove();
			this.eRightOverlay = null;
		}

		this.eBuyDropdown = null;
		this.eSellDropdown = null;
	}
}

export default StrikePriceCellRenderer;
