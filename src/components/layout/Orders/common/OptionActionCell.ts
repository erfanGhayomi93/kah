import { addTooltip } from '@/utils/helpers';
import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';
import ActionCell from './ActionCell';

interface OptionActionCellProps extends ICellRendererParams<Order.OptionOrder, unknown> {
	onClosePosition: (order: Order.OptionOrder) => void;
}

class OptionActionCell extends ActionCell implements ICellRendererComp<Order.OptionOrder> {
	params!: OptionActionCellProps;

	eGui!: HTMLDivElement;

	eCollateral!: HTMLButtonElement;

	init(params: OptionActionCellProps) {
		this.params = params;
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center text-gray-700 gap-8');

		this.eGui.appendChild(this.closePositionBtn());
	}

	closePositionBtn() {
		const btn = this.createClosePosition();
		btn.disabled = !this.params.data?.canClosePosition;
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.onClosePosition(this.params.data!);
		};

		addTooltip('بستن موقعیت', btn);

		return btn;
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: OptionActionCellProps) {
		this.params = params;

		return true;
	}

	get blockType() {
		return this.params.data!.blockType;
	}
}

export default OptionActionCell;
