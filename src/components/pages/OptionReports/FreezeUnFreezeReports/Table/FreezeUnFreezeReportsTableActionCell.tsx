import { TooltipElement } from '@/classes/Tooltip';
import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';



type TFreezeUnFreezeReportsTableActionCellProps = ICellRendererParams<Reports.IFreezeUnfreezeReports[], string> & {
	onDelete?: (data: Reports.IFreezeUnfreezeReports[] | undefined) => Promise<void>;
};

class FreezeUnFreezeReportsTableActionCell implements ICellRendererComp<Reports.IFreezeUnfreezeReports[]> {
	eGui!: HTMLDivElement;

	getGui() {
		return this.eGui;
	}

	init(params: TFreezeUnFreezeReportsTableActionCellProps) {

		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center gap-4 h-full w-full');

		// this.eGui.appendChild(this.createDeleteBtn(params));
	}

	refresh(params: TFreezeUnFreezeReportsTableActionCellProps) {
		return true;
	}

	// private createDeleteBtn(params: TFreezeUnFreezeReportsTableActionCellProps): HTMLButtonElement {
	// 	const btn = document.createElement('button');
	// 	btn.setAttribute('class', 'flex-justify-center text-gray-900 rounded px-4');
	// 	btn.onclick = () => params.onDelete?.(params.data);
	// 	btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none"stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" /><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352" /><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224"fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" /></svg>';
	// 	this.addTooltip('حذف', btn);

	// 	return btn;
	// }



	addTooltip(content: string, children: HTMLElement) {
		const tooltip = new TooltipElement(children);
		tooltip.animation = false;
		tooltip.setContent(content).add();
	}
}

export default FreezeUnFreezeReportsTableActionCell;
