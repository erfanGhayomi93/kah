import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';
import ActionCell from './ActionCell';

interface OptionActionCellProps extends ICellRendererParams<Order.OptionOrder, unknown> {
	showDetails: (order: Order.OptionOrder) => void;
	onClosePosition: (order: Order.OptionOrder) => void;
	onChangeCollateral: (order: Order.OptionOrder) => void;
}

class OptionActionCell extends ActionCell implements ICellRendererComp<Order.OptionOrder> {
	params!: OptionActionCellProps;

	eGui!: HTMLDivElement;

	init(params: OptionActionCellProps) {
		this.params = params;
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center text-gray-900 gap-8');

		this.eGui.appendChild(this.collateralBtn());
		this.eGui.appendChild(this.closePositionBtn());
		this.eGui.appendChild(this.detailsBtn());
	}

	closePositionBtn() {
		const btn = this.createClosePosition();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.onClosePosition(this.params.data!);
		};

		return btn;
	}

	collateralBtn() {
		const btn = this.blockType === 'Portfolio' ? this.createStockCollateral() : this.createCashCollateral();
		const isDisabled = this.isSwapDisabled;

		if (isDisabled) {
			btn.classList.add('text-gray-700');
			btn.disabled = true;
		}

		btn.onclick = (e) => {
			e.stopPropagation();
			if (!isDisabled) this.params.onChangeCollateral(this.params.data!);
		};

		return btn;
	}

	detailsBtn() {
		const btn = this.createDetails();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.showDetails(this.params.data!);
		};

		return btn;
	}

	getGui() {
		return this.eGui;
	}

	get blockType() {
		return this.params.data!.blockType;
	}

	get isSwapDisabled() {
		return Boolean(this.params.data?.side === 'Call' || !this.params.data?.isFreeze);
	}

	refresh(params: OptionActionCellProps) {
		this.params = params;
		return true;
	}
}

export default OptionActionCell;
