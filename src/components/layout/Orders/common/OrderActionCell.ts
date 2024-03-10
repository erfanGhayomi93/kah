import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';
import ActionCell from './ActionCell';

type TOrder = Order.TodayOrder | Order.ExecutedOrder | Order.OpenOrder;

interface OrderActionCellProps extends ICellRendererParams<TOrder, unknown> {
	onDelete: (order: TOrder) => void;
	onEdit: (order: TOrder) => void;
	showDetails: (order: TOrder) => void;
}

class OrderActionCell extends ActionCell implements ICellRendererComp<TOrder> {
	params!: OrderActionCellProps;

	eGui!: HTMLDivElement;

	init(params: OrderActionCellProps) {
		this.params = params;
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center text-gray-900 gap-16');

		this.eGui.appendChild(this.deleteBtn());
		this.eGui.appendChild(this.editBtn());
		this.eGui.appendChild(this.detailsBtn());
	}

	detailsBtn() {
		const btn = this.createDetails();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.showDetails(this.params.data!);
		};

		return btn;
	}

	editBtn() {
		const btn = this.createEdit();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.onEdit(this.params.data!);
		};

		return btn;
	}

	deleteBtn() {
		const btn = this.createTrash();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.onDelete(this.params.data!);
		};

		return btn;
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: OrderActionCellProps) {
		this.params = params;
		return true;
	}
}

export default OrderActionCell;
