import { TooltipElement } from '@/classes/Tooltip';
import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';

type StatusColumnCellProps = ICellRendererParams<Reports.IOrdersReports, unknown>;

class StatusColumnCell implements ICellRendererComp<Reports.IOrdersReports> {

	params!: StatusColumnCellProps;


	eGui!: HTMLDivElement;

	init(params: StatusColumnCellProps) {
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'text-gray-900');
		this.eGui.textContent = String(params.value);

		this.addTooltip(String(params.value), this.eGui);

	}

	getGui() {
		return this.eGui;
	}

	refresh(params: StatusColumnCellProps) {
		this.params = params;
		return true;
	}

	addTooltip(content: string, children: HTMLElement) {
		const tooltip = new TooltipElement(children);
		tooltip.animation = false;
		tooltip.setContent(content).add();
	}
}

export default StatusColumnCell;
