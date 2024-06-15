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

	init(params: OrderActionCellProps) {
		this.params = params;
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center text-light-gray-700 gap-8');

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

		this.addTooltip('جزئیات سفارش', btn);

		return btn;
	}

	editBtn() {
		this.eEdit = this.createEdit();
		this.updateEditBtn();

		this.addTooltip('ویرایش سفارش', this.eEdit);

		return this.eEdit;
	}

	copyBtn() {
		const btn = this.createCopy();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.onCopy(this.params.data!);
		};

		this.addTooltip('کپی سفارش', btn);

		return btn;
	}

	deleteBtn() {
		this.eDelete = this.createTrash();
		this.updateDeleteBtn();

		this.addTooltip('حذف سفارش', this.eDelete);

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
			this.eEdit.classList.add('text-light-gray-500');
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
			this.eDelete.classList.add('text-light-gray-500');
		}

		this.eDelete.onclick = (e) => {
			e.stopPropagation();
			if (isEnable) this.params.onDelete(this.params.data!);
		};
	}

	addTooltip(content: string, children: HTMLElement) {
		const tooltip = new TooltipElement(children);
		tooltip.animation = false;
		tooltip.setContent(content).add();
	}

	get editable() {
		return editableOrdersStatus.includes(this.params.data!.orderStatus);
	}
}

export default OrderActionCell;
