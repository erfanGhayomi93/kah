import { TooltipElement } from '@/classes/Tooltip';
import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';



type TDepositWithReceiptReportsActionCellProps = ICellRendererParams<Reports.IDepositWithReceipt[], string> & {
	onDelete?: (data: Reports.IDepositWithReceipt[] | undefined) => Promise<void>;
	onEdit?: (data: Reports.IDepositWithReceipt[] | undefined) => Promise<void>;
};

class DepositWithReceiptReportsActionCell implements ICellRendererComp<Reports.IDepositWithReceipt[]> {
	eGui!: HTMLDivElement;

	getGui() {
		return this.eGui;
	}

	init(params: TDepositWithReceiptReportsActionCellProps) {

		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center gap-4 h-full w-full');

		this.eGui.appendChild(this.createDeleteBtn(params));
		this.eGui.appendChild(this.createEditBtn(params));
	}

	refresh(params: TDepositWithReceiptReportsActionCellProps) {
		return true;
	}

	private createDeleteBtn(params: TDepositWithReceiptReportsActionCellProps): HTMLButtonElement {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'flex-justify-center text-gray-900 rounded px-4');
		btn.onclick = () => params.onDelete?.(params.data);
		btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none"stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" /><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352" /><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224"fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" /></svg>';
		this.addTooltip('حذف', btn);

		return btn;
	}

	private createEditBtn(params: TDepositWithReceiptReportsActionCellProps): HTMLButtonElement {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'flex-justify-center text-gray-900 rounded px-4');
		btn.onclick = () => params.onDelete?.(params.data);
		btn.innerHTML = '<svg width="2.4rem" height="2.4rem" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d = "M12.3529 4.04383L15.1765 6.86736M10.4706 17.2203H18M2.94118 13.4556L2 17.2203L5.76471 16.2791L16.6692 5.37466C17.0221 5.02166 17.2203 4.54297 17.2203 4.04383C17.2203 3.5447 17.0221 3.066 16.6692 2.71301L16.5073 2.55113C16.1543 2.19824 15.6756 2 15.1765 2C14.6773 2 14.1986 2.19824 13.8456 2.55113L2.94118 13.4556Z" stroke = "currentColor" stroke - width="1.2" stroke - linecap="round" stroke - linejoin="round" /></svg >';
		this.addTooltip('ویرایش', btn);

		return btn;
	}

	addTooltip(content: string, children: HTMLElement) {
		const tooltip = new TooltipElement(children);
		tooltip.animation = false;
		tooltip.setContent(content).add();
	}
}

export default DepositWithReceiptReportsActionCell;
