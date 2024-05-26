import { TooltipElement } from '@/classes/Tooltip';
import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';

type TPhysicalSettlementReportsTableActionCellProps = ICellRendererParams<Reports.ICashSettlementReports, string> & {
	onDeleteRow?: (data: Reports.ICashSettlementReports | undefined) => Promise<void>;
	onRequest?: (data: Reports.ICashSettlementReports | undefined) => Promise<void>;
	onHistory?: (data: Reports.ICashSettlementReports | undefined) => Promise<void>;
};

class PhysicalSettlementReportsTableActionCell implements ICellRendererComp<Reports.ICashSettlementReports> {
	params!: TPhysicalSettlementReportsTableActionCellProps;

	eGui!: HTMLDivElement;

	eventListener!: () => void;

	getGui() {
		return this.eGui;
	}

	init(params: TPhysicalSettlementReportsTableActionCellProps) {
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center gap-4 h-full w-full');

		this.eGui.appendChild(this.createDeleteBtn(params));
		this.eGui.appendChild(this.createHistoryBtn(params));
		this.eGui.appendChild(this.createRequestBtn(params));
	}

	refresh(params: TPhysicalSettlementReportsTableActionCellProps) {
		this.params = params;
		return true;
	}

	private createDeleteBtn(params: TPhysicalSettlementReportsTableActionCellProps): HTMLButtonElement {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'flex-justify-center text-gray-900 rounded px-4');
		btn.disabled =
			params.data?.enabled ||
			!(String(params.data?.status) === 'InSendQueue' || String(params.data?.status) === 'Registered');
		btn.onclick = () => params.onDeleteRow?.(params.data);
		btn.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none"stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" /><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352" /><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224"fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" /></svg>';
		this.addTooltip('حذف', btn);

		return btn;
	}

	private createHistoryBtn(params: TPhysicalSettlementReportsTableActionCellProps): HTMLButtonElement {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'flex-justify-center text-gray-900 rounded px-4');
		btn.disabled = String(params.data?.status) !== 'Registeration';
		btn.onclick = () => params.onHistory?.(params.data);
		btn.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none"><path d="M3.80514 3.32038C4.88807 2.23386 6.31432 1.55659 7.84074 1.40402C9.36716 1.25145 10.8992 1.63303 12.1758 2.48371C13.4524 3.33438 14.3943 4.60149 14.8412 6.069C15.288 7.53652 15.212 9.11357 14.6261 10.5313C14.0402 11.9491 12.9807 13.1197 11.6283 13.8437C10.2759 14.5676 8.71417 14.8001 7.2095 14.5015C5.70482 14.2028 4.35031 13.3915 3.3769 12.2059C2.40348 11.0203 1.87142 9.53372 1.87143 7.99969C1.87143 7.81783 1.79918 7.64342 1.67059 7.51482C1.54199 7.38622 1.36758 7.31398 1.18571 7.31398C1.00385 7.31398 0.829437 7.38622 0.700841 7.51482C0.572245 7.64342 0.5 7.81783 0.5 7.99969C0.499926 9.85115 1.14203 11.6453 2.31685 13.0763C3.49166 14.5073 5.12645 15.4865 6.94247 15.8469C8.7585 16.2074 10.6433 15.9268 12.2756 15.053C13.9079 14.1792 15.1866 12.7663 15.8936 11.0552C16.6007 9.34403 16.6924 7.44063 16.153 5.66948C15.6137 3.89833 14.4767 2.36908 12.9359 1.34247C11.3951 0.315865 9.54598 -0.144545 7.70371 0.0397407C5.86145 0.224027 4.14014 1.0416 2.83326 2.35306C2.81023 2.37591 2.78885 2.40035 2.76926 2.42621L1.62 1.27604C1.55854 1.21443 1.48077 1.17166 1.39584 1.15272C1.3109 1.13379 1.22233 1.1395 1.14052 1.16917C1.05872 1.19883 0.987082 1.25124 0.93403 1.32021C0.880977 1.38919 0.848713 1.47187 0.841028 1.55855L0.518286 5.11421C0.512253 5.18091 0.520953 5.24813 0.543769 5.3111C0.566585 5.37408 0.602961 5.43127 0.650322 5.47863C0.697683 5.52599 0.754873 5.56236 0.817846 5.58518C0.880819 5.608 0.948036 5.6167 1.01474 5.61066L4.57131 5.28701C4.65765 5.27887 4.7399 5.24635 4.80845 5.19323C4.877 5.14011 4.92902 5.06859 4.95845 4.98701C4.98788 4.90543 4.99349 4.81717 4.97465 4.73252C4.9558 4.64787 4.91326 4.57033 4.852 4.50895L3.72926 3.38621C3.75611 3.36613 3.78148 3.34413 3.80514 3.32038Z" fill="#5D606D"/><path d="M9.18588 3.4279C9.18588 3.24604 9.11364 3.07162 8.98504 2.94303C8.85644 2.81443 8.68203 2.74219 8.50017 2.74219C8.3183 2.74219 8.14389 2.81443 8.01529 2.94303C7.8867 3.07162 7.81445 3.24604 7.81445 3.4279V7.99933C7.8144 8.11559 7.84392 8.22995 7.90021 8.33167C7.95651 8.43339 8.03774 8.51912 8.13628 8.58082L10.8791 10.2951C11.0334 10.3916 11.2196 10.4229 11.3969 10.3821C11.4847 10.3619 11.5676 10.3246 11.641 10.2723C11.7144 10.2201 11.7767 10.1539 11.8245 10.0775C11.8723 10.0011 11.9046 9.91611 11.9195 9.82728C11.9344 9.73844 11.9317 9.64754 11.9115 9.55975C11.8913 9.47196 11.854 9.38902 11.8017 9.31565C11.7495 9.24227 11.6833 9.17992 11.6069 9.13213L9.18588 7.61899V3.4279Z" fill="#5D606D"/></svg>';
		this.addTooltip('مشاهده تاریخچه', btn);

		return btn;
	}

	private createRequestBtn(params: TPhysicalSettlementReportsTableActionCellProps): HTMLButtonElement {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'flex-justify-center text-gray-900 rounded px-4');
		btn.disabled =
			!params.data?.enabled || String(params.data?.status) !== 'Draft' || !params.data?.openPositionCount;
		btn.onclick = () => params.onRequest?.(params.data);
		btn.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none"><path d="M21.0635 19.86L22.5556 18.6997V11.2274C22.5556 10.9304 22.2136 10.8561 22.0427 10.8561H20.2709V19.5815C20.4574 20.0642 20.877 19.9683 21.0635 19.86Z" fill="#5D606D"/><path d="M19.0586 18.0499V10.9026H18.0328L14.396 9.09251L11.6451 13.0839C12.1673 13.121 12.7952 12.759 13.0439 12.5734C13.1216 12.3877 13.4169 12.0164 13.9764 12.0164C14.5359 12.0164 14.5204 12.4187 14.4426 12.6198C13.6966 13.9564 12.2357 14.2906 11.5985 14.2906H7.82176C7.3555 14.3834 6.42299 14.8568 6.42299 16.0078C6.42299 17.1588 7.3555 17.6322 7.82176 17.7251H11.5518C14.2748 19.5444 17.6909 18.6997 19.0586 18.0499Z" fill="#5D606D"/><path d="M13.8831 7.93222L11.9715 6.6327L7.26225 13.2231H10.1531L13.8831 7.93222Z" fill="#5D606D"/><path d="M14.4426 6.95758L12.6709 5.70447C12.9351 5.30223 13.5101 4.43279 13.6966 4.17289C13.8831 3.91298 14.1784 4.00271 14.3028 4.08006C14.6447 4.31212 15.3752 4.81337 15.5617 4.96188C15.7482 5.1104 15.6394 5.36412 15.5617 5.47241L14.4426 6.95758Z" fill="#5D606D"/><path d="M9.31379 7.51452H9.96656L3.76531 16.2863C2.90739 15.618 2.94158 14.6155 3.06592 14.1978C4.09169 12.5579 6.18986 9.22246 6.37636 8.99969C6.56286 8.77691 6.82708 8.62839 6.93587 8.58198L9.31379 7.51452Z" fill="#5D606D"/><path d="M6.46961 18.3284C5.49979 17.6601 5.28842 16.5648 5.30396 16.1007C4.558 16.6112 4.04501 18.8389 4.18489 19.2566C4.29679 19.5908 4.79103 19.5196 5.02416 19.4423L6.46961 18.3284Z" fill="#5D606D"/><path d="M7.54201 18.7925H9.26717V19.3495C9.205 19.5661 8.95011 19.9992 8.4279 19.9992C7.90569 19.9992 7.61972 19.5661 7.54201 19.3495V18.7925Z" fill="#5D606D"/><path d="M11.1788 18.8389H10.3862C10.3489 19.8043 10.9612 20.0147 11.2721 19.9992C11.757 19.9992 12.0647 19.5351 12.158 19.3031L11.1788 18.8389Z" fill="#5D606D"/></svg>';
		this.addTooltip('درخواست تسویه', btn);

		return btn;
	}

	addTooltip(content: string, children: HTMLElement) {
		const tooltip = new TooltipElement(children);
		tooltip.animation = false;
		tooltip.setContent(content).add();
	}
}

export default PhysicalSettlementReportsTableActionCell;
