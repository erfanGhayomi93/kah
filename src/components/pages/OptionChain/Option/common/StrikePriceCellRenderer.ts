import { type IBuySellModal } from '@/features/slices/modalSlice';
import { type ICellRendererComp, type ICellRendererParams } from '@ag-grid-community/core';
import { type ITableData } from '../OptionTable';
import StrikePriceBtnGroup from './StrikePriceBtnGroup';

export type StrikePriceCellRendererProps = ICellRendererParams<ITableData, number> & {
	activeRowId: number;
	basket: IOrderBasket[];
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

	createRowOverlay(params: StrikePriceCellRendererProps) {
		const {
			node: { data },
		} = params;
		if (!data) return;

		const buyBtnGroup = new StrikePriceBtnGroup({
			isInBasket: this.isInBasket(params, 'sell'),
			side: 'sell',
			params,
		});
		const sellBtnGroup = new StrikePriceBtnGroup({
			isInBasket: this.isInBasket(params, 'buy'),
			side: 'buy',
			params,
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

	isInBasket(params: StrikePriceCellRendererProps, side: 'buy' | 'sell') {
		return params.basket.findIndex((item) => params.data![side]?.symbolInfo.symbolISIN === item.symbolISIN) > -1;
	}
}

export default StrikePriceCellRenderer;
