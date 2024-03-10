import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';
import ActionCell from './ActionCell';

interface OptionActionCellProps extends ICellRendererParams<Order.OptionOrder, unknown> {
	showDetails: (order: Order.OptionOrder) => void;
}

class OptionActionCell extends ActionCell implements ICellRendererComp<Order.OptionOrder> {
	params!: OptionActionCellProps;

	eGui!: HTMLDivElement;

	init(params: OptionActionCellProps) {
		this.params = params;
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center text-gray-900 gap-16');

		this.eGui.appendChild(this.detailsBtn());
	}

	detailsBtn() {
		const btn = this.createDetails();
		btn.onclick = () => this.params.showDetails(this.params.data!);

		return btn;
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: OptionActionCellProps) {
		this.params = params;
		return true;
	}
}

export default OptionActionCell;
