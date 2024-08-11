import { type ITableData } from '@/components/pages/OptionChain/Option/OptionTable';
import { type ICellRendererComp, type ICellRendererParams } from '@ag-grid-community/core';
import StrikePriceBtnGroup from './StrikePriceBtnGroup';

export type StrikePriceCellRendererProps = ICellRendererParams<ITableData, number> & {
	activeRowId: number;
	disabled: boolean;
	buy: (data: Option.Root) => void;
	sell: (data: Option.Root) => void;
};

class StrikePriceCellRenderer implements ICellRendererComp<ITableData> {
	eGui!: HTMLDivElement;

	eLeftOverlay: HTMLDivElement | null = null;

	eRightOverlay: HTMLDivElement | null = null;

	eBuyDropdown: HTMLUListElement | null = null;

	eSellDropdown: HTMLUListElement | null = null;

	eCall: HTMLSpanElement | null = null;

	ePut: HTMLSpanElement | null = null;

	buyBtnGroup: StrikePriceBtnGroup | null = null;

	sellBtnGroup: StrikePriceBtnGroup | null = null;

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

			if (rowIndex === activeRowId) {
				this.removeRowOverlay();
				this.createRowOverlay();
				this.update();
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
			'size-32 bg-white darkness:bg-gray-50 rounded hover:bg-gray-100 text-base text-gray-700 flex-justify-center transition-colors',
		);

		return btn;
	}

	createOverlay() {
		const overlay = document.createElement('div');
		overlay.style.backgroundColor = 'var(--ag-row-hover-color)';
		overlay.style.zIndex = '99';
		overlay.style.height = '48px';
		overlay.style.position = 'absolute';
		overlay.style.top = '0';
		overlay.style.width = '104px';
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

		this.buyBtnGroup = new StrikePriceBtnGroup({
			side: 'buy',
			params: this.params,
		});
		this.sellBtnGroup = new StrikePriceBtnGroup({
			side: 'sell',
			params: this.params,
		});

		this.eLeftOverlay = this.createOverlay();
		this.eLeftOverlay.style.right = '100%';

		this.eRightOverlay = this.createOverlay();
		this.eRightOverlay.style.left = '100%';

		this.eLeftOverlay.appendChild(this.sellBtnGroup.eGroup!);
		this.eRightOverlay.appendChild(this.buyBtnGroup.eGroup!);
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

	createBtn() {
		const b = document.createElement('button');
		b.setAttribute('class', 'size-28 top-4 flex-justify-center rounded');

		return b;
	}

	update() {
		this.buyBtnGroup?.setDisabled(this.params.disabled);
		this.sellBtnGroup?.setDisabled(this.params.disabled);
	}
}

export default StrikePriceCellRenderer;
