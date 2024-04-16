import { type ICellRendererComp, type ICellRendererParams } from '@ag-grid-community/core';
import { type ITableData } from '../OptionTable';
import StrikePriceBtnGroup from './StrikePriceBtnGroup';

export type StrikePriceCellRendererProps = ICellRendererParams<ITableData, number> & {
	activeRowId: number;
	basket: IOrderBasket[];
	addSymbolToBasket: (data: Option.Root, side: TBsSides) => void;
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

	eBuy: HTMLButtonElement | null = null;

	eSell: HTMLButtonElement | null = null;

	params!: StrikePriceCellRendererProps;

	eventListener!: () => void;

	init(params: StrikePriceCellRendererProps) {
		this.params = params;

		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center w-full');

		this.eGui.textContent = String(this.params.valueFormatted ?? '−');
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: StrikePriceCellRendererProps) {
		try {
			this.params = params;

			const {
				activeRowId,
				node: { rowIndex },
			} = params;

			// this.renderBuySellBtn();

			if (rowIndex === activeRowId) {
				this.removeRowOverlay();
				this.createRowOverlay();
			} else {
				this.removeRowOverlay();
			}
		} catch (e) {
			//
		}

		return true;
	}

	createButton() {
		const btn = document.createElement('button');
		btn.setAttribute(
			'class',
			'size-32 bg-white rounded hover:bg-gray-200 text-base text-gray-900 flex-justify-center transition-colors',
		);

		return btn;
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

	createRowOverlay() {
		const {
			node: { data },
		} = this.params;
		if (!data) return;

		const buyBtnGroup = new StrikePriceBtnGroup({
			isInBasket: this.isInBasket('buy'),
			side: 'buy',
			params: this.params,
		});
		const sellBtnGroup = new StrikePriceBtnGroup({
			isInBasket: this.isInBasket('sell'),
			side: 'sell',
			params: this.params,
		});

		this.eLeftOverlay = this.createOverlay();
		this.eLeftOverlay.style.right = '100%';

		this.eRightOverlay = this.createOverlay();
		this.eRightOverlay.style.left = '100%';

		this.eLeftOverlay.appendChild(sellBtnGroup.eGroup!);
		this.eRightOverlay.appendChild(buyBtnGroup.eGroup!);
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

	renderBuySellBtn() {
		const isInBuyBasket = this.isInBasket('sell');
		const isInSellBasket = this.isInBasket('buy');

		if (isInBuyBasket) {
			if (!this.eBuy) {
				this.eBuy = this.createBtn();
				this.eBuy.classList.add('absolute', 'right-8', 'bg-success-100/10', 'text-success-100');
				this.eBuy.textContent = 'B';

				this.eGui.appendChild(this.eBuy);
			}
		} else {
			if (this.eBuy) this.eBuy.remove();
			this.eBuy = null;
		}

		if (isInSellBasket) {
			if (!this.eSell) {
				this.eSell = this.createBtn();
				this.eSell.classList.add('absolute', 'left-8', 'bg-error-100/10', 'text-error-100');
				this.eSell.textContent = 'S';

				this.eGui.appendChild(this.eSell);
			}
		} else {
			if (this.eSell) this.eSell.remove();
			this.eSell = null;
		}
	}

	createBtn() {
		const b = document.createElement('button');
		b.setAttribute('class', 'size-28 top-4 flex-justify-center rounded');

		return b;
	}

	isInBasket(side: 'buy' | 'sell') {
		try {
			const { basket, data } = this.params;
			return basket.findIndex((item) => data![side]?.symbolInfo.symbolISIN === item.symbolISIN) > -1;
		} catch (e) {
			return false;
		}
	}
}

export default StrikePriceCellRenderer;
