import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';

type SymbolTitleHeaderProps = ICellRendererParams<Order.TOrder, string>;

class SymbolTitleCell implements ICellRendererComp<Order.TOrder> {
	eGui!: HTMLDivElement;

	eValue!: HTMLSpanElement;

	eventListener!: () => void;

	init(params: SymbolTitleHeaderProps) {
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-end');

		this.eValue = document.createElement('span');
		this.eValue.textContent = String(params.value);

		this.eGui.appendChild(this.eValue);
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: SymbolTitleHeaderProps) {
		this.eValue.textContent = String(params?.value ?? '');
		return true;
	}
}

export default SymbolTitleCell;
