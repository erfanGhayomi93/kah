import { TooltipElement } from '@/classes/Tooltip';
import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';
import ActionCell from './ActionCell';

interface DraftActionCellProps extends ICellRendererParams<Order.DraftOrder, unknown> {
	onSend: (order: Order.DraftOrder) => void;
	onDelete: (order: Order.DraftOrder) => void;
	onEdit: (order: Order.DraftOrder) => void;
	onCopy: (order: Order.DraftOrder) => void;
}

class DraftActionCell extends ActionCell implements ICellRendererComp<Order.DraftOrder> {
	params!: DraftActionCellProps;

	eGui!: HTMLDivElement;

	init(params: DraftActionCellProps) {
		this.params = params;
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center text-gray-900 gap-8');

		this.eGui.appendChild(this.deleteBtn());
		this.eGui.appendChild(this.editBtn());
		this.eGui.appendChild(this.copyBtn());
		this.eGui.appendChild(this.sendBtn());
	}

	sendBtn() {
		const btn = this.createSend();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.onSend(this.params.data!);
		};

		this.addTooltip('ارسال پیش‌نویس', btn);

		return btn;
	}

	copyBtn() {
		const btn = this.createCopy();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.onCopy(this.params.data!);
		};

		this.addTooltip('کپی پیش‌نویس', btn);

		return btn;
	}

	editBtn() {
		const btn = this.createEdit();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.onEdit(this.params.data!);
		};

		this.addTooltip('ویرایش پیش‌نویس', btn);

		return btn;
	}

	deleteBtn() {
		const btn = this.createTrash();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.onDelete(this.params.data!);
		};

		this.addTooltip('حذف پیش‌نویس', btn);

		return btn;
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: DraftActionCellProps) {
		this.params = params;
		return true;
	}

	addTooltip(content: string, children: HTMLElement) {
		const tooltip = new TooltipElement(children);
		tooltip.animation = false;
		tooltip.setContent(content).add();
	}
}

export default DraftActionCell;
