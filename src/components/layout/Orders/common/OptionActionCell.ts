import { addTooltip } from '@/utils/helpers';
import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';
import ActionCell from './ActionCell';

interface OptionActionCellProps extends ICellRendererParams<Order.OptionOrder, unknown> {
	onClosePosition: (order: Order.OptionOrder) => void;
	onChangeCollateral: (order: Order.OptionOrder) => void;
}

class OptionActionCell extends ActionCell implements ICellRendererComp<Order.OptionOrder> {
	params!: OptionActionCellProps;

	eGui!: HTMLDivElement;

	eCollateral!: HTMLButtonElement;

	init(params: OptionActionCellProps) {
		this.params = params;
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center text-light-gray-700 gap-8');

		this.eGui.appendChild(this.collateralBtn());
		this.eGui.appendChild(this.closePositionBtn());
	}

	closePositionBtn() {
		const btn = this.createClosePosition();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.onClosePosition(this.params.data!);
		};

		addTooltip('بستن موقعیت', btn);

		return btn;
	}

	collateralBtn() {
		this.eCollateral = this.blockType === 'Portfolio' ? this.createStockCollateral() : this.createCashCollateral();
		this.updateCollateral();

		return this.eCollateral;
	}

	getGui() {
		return this.eGui;
	}

	updateCollateral() {
		const isDisabled = this.isSwapDisabled;

		if (isDisabled) {
			this.eCollateral.classList.add('text-light-gray-500');
			this.eCollateral.disabled = true;
		} else {
			this.eCollateral.disabled = false;
		}

		this.eCollateral.onclick = (e) => {
			e.stopPropagation();
			if (!isDisabled) this.params.onChangeCollateral(this.params.data!);
		};

		addTooltip('تغییر روش تضمین', this.eCollateral);
	}

	refresh(params: OptionActionCellProps) {
		this.params = params;
		this.updateCollateral();

		return true;
	}

	get blockType() {
		return this.params.data!.blockType;
	}

	get isSwapDisabled() {
		return Boolean(this.params.data?.side === 'Buy' || !this.params.data?.isFreeze);
	}
}

export default OptionActionCell;
