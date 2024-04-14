import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';

type FnType = (data?: Symbol.SameSector) => string;

type CoGroupSymbolCompareProps = ICellRendererParams<Symbol.SameSector, string> & {
	top: FnType;
	bottom: FnType;
	topClass: FnType;
	bottomClass: FnType;
};

class CoGroupSymbolCompare implements ICellRendererComp<Symbol.SameSector> {
	eGui!: HTMLDivElement;

	eTop!: HTMLSpanElement;

	eBottom!: HTMLSpanElement;

	// gets called once before the renderer is used
	init(params: CoGroupSymbolCompareProps) {
		// create the cell
		this.eGui = document.createElement('div');
		this.eGui.setAttribute(
			'class',
			'flex flex-col items-center justify-center overflow-hidden gap-4 w-full h-full',
		);

		this.eTop = document.createElement('span');
		this.eTop.setAttribute('class', `leading-normal ltr text-tiny ${params.topClass(params.data)}`);

		this.eBottom = document.createElement('span');
		this.eBottom.setAttribute('class', `leading-normal ltr text-tiny ${params.bottomClass(params.data)}`);

		this.eGui.appendChild(this.eTop);
		this.eGui.appendChild(this.eBottom);
		this.eGui.appendChild(this.eBottom);

		this.eTop.textContent = params.top(params.data);
		this.eBottom.textContent = params.bottom(params.data);
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: CoGroupSymbolCompareProps) {
		this.eTop.textContent = params.top(params.data);
		this.eBottom.textContent = params.bottom(params.data);

		return true;
	}
}

export default CoGroupSymbolCompare;
