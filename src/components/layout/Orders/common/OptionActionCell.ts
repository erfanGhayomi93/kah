import { TooltipElement } from '@/classes/Tooltip';
import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';
import ActionCell from './ActionCell';

interface OptionActionCellProps extends ICellRendererParams<Order.OptionOrder, unknown> {
	onClosePosition: (order: Order.OptionOrder) => void;
	onChangeCollateral: (order: Order.OptionOrder) => void;
	showDetails: (order: Order.OptionOrder) => void;
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
		this.eGui.appendChild(this.detailsBtn());
	}

	closePositionBtn() {
		const btn = this.createClosePosition();
		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.onClosePosition(this.params.data!);
		};

		this.addTooltip('بستن موقعیت', btn);

		return btn;
	}

	collateralBtn() {
		this.eCollateral = this.blockType === 'Portfolio' ? this.createStockCollateral() : this.createCashCollateral();
		this.updateCollateral();

		return this.eCollateral;
	}

	detailsBtn() {
		const btn = this.createDetails();

		btn.onclick = (e) => {
			e.stopPropagation();
			this.params.showDetails(this.params.data!);
		};

		this.addTooltip('جزئیات موقعیت', btn);

		return btn;
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

		this.addTooltip('تغییر روش تضمین', this.eCollateral);
	}

	refresh(params: OptionActionCellProps) {
		this.params = params;
		this.updateCollateral();

		return true;
	}

	addTooltip(content: string, children: HTMLElement) {
		const tooltip = new TooltipElement(children);
		tooltip.animation = false;
		tooltip.setContent(content).add();
	}

	get blockType() {
		return this.params.data!.blockType;
	}

	get isSwapDisabled() {
		return Boolean(this.params.data?.side === 'Call' || !this.params.data?.isFreeze);
	}
}

export default OptionActionCell;
