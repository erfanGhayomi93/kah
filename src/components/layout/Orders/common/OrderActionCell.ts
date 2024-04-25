import { TooltipElement } from '@/classes/Tooltip';
import { editableOrdersStatus } from '@/constants';
import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';
import ActionCell from './ActionCell';

type TOrder = Order.TodayOrder | Order.ExecutedOrder | Order.OpenOrder;

interface OrderActionCellProps extends ICellRendererParams<TOrder, unknown> {
	onDelete: (order: TOrder) => void;
	onEdit: (order: TOrder) => void;
	showDetails: (order: TOrder) => void;
	onCopy: (order: TOrder) => void;
}

class OrderActionCell extends ActionCell implements ICellRendererComp<TOrder> {
	params!: OrderActionCellProps;

	eGui!: HTMLDivElement;

	eDelete!: HTMLButtonElement;

	eEdit!: HTMLButtonElement;

	tooltip: TooltipElement | null = null;

	init(params: OrderActionCellProps) {
		this.params = params;
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center text-gray-900 gap-8');

		this.eGui.appendChild(this.deleteBtn());
		this.eGui.appendChild(this.editBtn());
		this.eGui.appendChild(this.copyBtn());
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
		this.eEdit = this.createEdit();
		this.updateEditBtn();

		return this.eEdit;
	}

	copyBtn() {
		const btn = this.createCopy();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.onCopy(this.params.data!);
		};

		return btn;
	}

	deleteBtn() {
		this.eDelete = this.createTrash();
		this.updateDeleteBtn();

		return this.eDelete;
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: OrderActionCellProps) {
		this.params = params;
		this.updateDeleteBtn();
		this.updateEditBtn();

		return true;
	}

	updateEditBtn() {
		const isEnable = this.editable;

		if (!isEnable) {
			this.eEdit.disabled = true;
			this.eEdit.classList.add('text-gray-700');
			this.setTooltip(this.eEdit, 'غیرفعال');
		}

		this.eEdit.onclick = (e) => {
			e.stopPropagation();
			if (isEnable) this.params.onEdit(this.params.data!);
		};
	}

	updateDeleteBtn() {
		const isEnable = this.editable;

		if (!isEnable) {
			this.eDelete.disabled = true;
			this.eDelete.classList.add('text-gray-700');
			this.setTooltip(this.eDelete, 'غیرفعال');
		}

		this.eDelete.onclick = (e) => {
			e.stopPropagation();
			if (isEnable) this.params.onDelete(this.params.data!);
		};
	}

	setTooltip(element: HTMLElement, content: string) {
		if (!this.tooltip) this.tooltip = new TooltipElement(element);
		else this.tooltip.element = element;

		this.tooltip.setContent(content);
	}

	get editable() {
		return editableOrdersStatus.includes(this.params.data!.orderStatus);
	}
}

export default OrderActionCell;
