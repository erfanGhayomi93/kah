import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';

type CoGroupSymbolCompareHeaderProps = ICellRendererParams<Symbol.SameSector, string> & {
	top: string;
	bottom: string;
};

class CoGroupSymbolCompareHeader implements ICellRendererComp<Symbol.SameSector> {
	eGui!: HTMLDivElement;

	eTop!: HTMLSpanElement;

	eBottom!: HTMLSpanElement;

	// gets called once before the renderer is used
	init(params: CoGroupSymbolCompareHeaderProps) {
		// create the cell
		this.eGui = document.createElement('div');
		this.eGui.setAttribute(
			'class',
			'flex flex-col items-center justify-center overflow-hidden gap-4 w-full h-full',
		);

		this.eTop = document.createElement('span');
		this.eTop.setAttribute('class', 'leading-normal font-normal text-tiny h-16');

		this.eBottom = document.createElement('span');
		this.eBottom.setAttribute('class', 'leading-normal font-normal text-tiny h-16');

		this.eGui.appendChild(this.eTop);
		this.eGui.appendChild(this.eBottom);
		this.eGui.appendChild(this.eBottom);

		this.eTop.textContent = params.top;
		this.eBottom.textContent = params.bottom;
	}

	getGui() {
		return this.eGui;
	}

	refresh() {
		return false;
	}
}

export default CoGroupSymbolCompareHeader;
