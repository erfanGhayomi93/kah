import { TooltipElement } from '@/classes/Tooltip';
import { type ICellRendererComp, type ICellRendererParams } from '@ag-grid-community/core';

type StrategyActionCellProps = ICellRendererParams<unknown, number> & {
	analyze?: (data: unknown) => void;
	execute?: (data: unknown) => void;
};

class StrategyActionCell implements ICellRendererComp<unknown> {
	eGui!: HTMLDivElement;

	params!: StrategyActionCellProps;

	getGui() {
		return this.eGui;
	}

	init(params: StrategyActionCellProps) {
		this.params = params;

		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center gap-4 h-full w-full');

		this.eGui.appendChild(this.createAnalyzeBtn());
		this.eGui.appendChild(this.createExecuteBtn());
	}

	refresh(params: StrategyActionCellProps) {
		this.params = params;
		return false;
	}

	private createAnalyzeBtn(): HTMLButtonElement {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'flex-justify-center text-light-gray-700 rounded px-4');
		btn.onclick = () => this.params.analyze?.(this.params.data!);
		btn.innerHTML =
			'<svg width="2rem" height="2rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.77207 17.674H3.00137C2.70859 17.674 2.47109 17.9114 2.47109 18.2043V20.9202C2.47109 21.2131 2.70859 21.4505 3.00137 21.4505H5.77207C6.06504 21.4505 6.30244 21.2131 6.30244 20.9202V18.2043C6.30244 17.9114 6.06504 17.674 5.77207 17.674ZM10.8482 13.4276H8.07754C7.78457 13.4276 7.54727 13.665 7.54727 13.9579V20.9202C7.54727 21.2131 7.78457 21.4505 8.07754 21.4505H10.8482C11.141 21.4505 11.3785 21.2131 11.3785 20.9202V13.9579C11.3785 13.665 11.141 13.4276 10.8482 13.4276ZM15.9243 15.1381H13.1536C12.8607 15.1381 12.6232 15.3756 12.6232 15.6685V20.9202C12.6232 21.2131 12.8607 21.4505 13.1536 21.4505H15.9243C16.2172 21.4505 16.4546 21.2131 16.4546 20.9202V15.6685C16.4546 15.3756 16.2172 15.1381 15.9243 15.1381ZM21.0004 11.1543H18.2297C17.9368 11.1543 17.6994 11.3918 17.6994 11.6847V20.9202C17.6994 21.2131 17.9368 21.4505 18.2297 21.4505H21.0004C21.2933 21.4505 21.5307 21.2131 21.5307 20.9202V11.6847C21.5307 11.3918 21.2933 11.1543 21.0004 11.1543ZM18.6883 6.27075C18.9664 6.41748 19.2787 6.5083 19.615 6.5083C20.7091 6.5083 21.6004 5.63052 21.6004 4.53647C21.6004 3.44238 20.7091 2.55078 19.615 2.55078C18.5211 2.55078 17.6297 3.44238 17.6297 4.53647C17.6297 4.70747 17.6582 4.87021 17.6991 5.02813L15.6592 6.63599C15.3398 6.41655 14.9545 6.28687 14.539 6.28687C13.9385 6.28687 13.4057 6.56118 13.0411 6.98442L11.4219 6.25513C11.2928 5.28457 10.4679 4.52954 9.46289 4.52954C8.36895 4.52954 7.47754 5.42114 7.47754 6.51519C7.47754 6.60483 7.49238 6.69023 7.504 6.77661L5.31094 8.50537C5.0332 8.35737 4.72148 8.26558 4.38584 8.26558C3.2918 8.26558 2.40039 9.15718 2.40039 10.2513C2.40039 11.3453 3.2918 12.223 4.38584 12.223C5.47979 12.223 6.37109 11.3453 6.37109 10.2513C6.37109 10.0768 6.34121 9.91045 6.29873 9.74907L8.34004 8.14019C8.65986 8.35835 9.04609 8.48701 9.46289 8.48701C10.066 8.48701 10.6008 8.2145 10.9654 7.7918L12.5785 8.51831C12.7015 9.4937 13.5293 10.2443 14.539 10.2443C15.633 10.2443 16.5243 9.36655 16.5243 8.27251C16.5243 8.17866 16.5093 8.08887 16.4966 7.99844L18.6883 6.27075Z" fill="currentColor" /></svg>';

		this.addTooltip('آنالیز', btn);

		return btn;
	}

	private createExecuteBtn(): HTMLButtonElement {
		const btn = document.createElement('button');
		try {
			const { execute } = this.params;
			btn.setAttribute('class', 'flex-justify-center disabled:opacity-50 text-light-gray-700 rounded px-4');
			btn.onclick = () => execute?.(this.params.data!);
			if (!execute) btn.disabled = true;
			btn.innerHTML =
				'<svg width="2rem" height="2rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM10.6935 15.8458L15.4137 13.059C16.1954 12.5974 16.1954 11.4026 15.4137 10.941L10.6935 8.15419C9.93371 7.70561 9 8.28947 9 9.21316V14.7868C9 15.7105 9.93371 16.2944 10.6935 15.8458Z" fill="currentColor" /></svg>';

			this.addTooltip(execute ? 'اجرا' : 'اجرا - غیرفعال', btn);
		} catch (e) {
			//
		}

		return btn;
	}

	addTooltip(content: string, children: HTMLElement) {
		const tooltip = new TooltipElement(children);
		tooltip.animation = false;
		tooltip.setContent(content).add();
	}
}

export default StrategyActionCell;
