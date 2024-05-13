import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';

type ConvertToHTMLProps = ICellRendererParams<unknown, string>;

class ConvertToHTML implements ICellRendererComp<unknown> {
	eGui!: HTMLSpanElement;

	eventListener!: () => void;

	init(params: ConvertToHTMLProps) {
		this.eGui = document.createElement('span');
		this.eGui.innerHTML = `<span>${this.getValueToDisplay(params) ?? ''}</span>`;
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: ConvertToHTMLProps) {
		this.eGui.innerHTML = `<span>${this.getValueToDisplay(params) ?? ''}</span>`;
		return true;
	}

	getValueToDisplay(params: ConvertToHTMLProps): string | null {
		const value = params.valueFormatted ? params.valueFormatted : params.value;
		return value ? String(value) : null;
	}
}

export default ConvertToHTML;
