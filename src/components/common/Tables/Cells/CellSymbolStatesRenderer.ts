import { type ICellRendererComp, type ICellRendererParams } from '@ag-grid-community/core';

type CellSymbolTitleRendererProps = ICellRendererParams<unknown, string> & {
	reverse?: boolean;
	getIOTM: (data: unknown) => string;
};

class CellSymbolTitleRenderer implements ICellRendererComp<unknown> {
	eGui!: HTMLDivElement;

	eTitle!: HTMLSpanElement;

	params!: CellSymbolTitleRendererProps;

	eIOTM!: HTMLSpanElement;

	eCheckbox!: HTMLInputElement;

	init(params: CellSymbolTitleRendererProps) {
		this.params = params;

		this.eGui = document.createElement('div');
		this.eGui.setAttribute(
			'class',
			`w-full flex-justify-center gap-8${this.params?.reverse ? ' flex-row-reverse' : ''}`,
		);

		try {
			this.createIOTM();
			this.createTitle();

			this.eGui.appendChild(this.eTitle);
			this.eGui.appendChild(this.eIOTM);
			this.eGui.appendChild(this.eCheckbox);
		} catch (e) {
			//
		}
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: CellSymbolTitleRendererProps) {
		this.params = params;

		this.updateIOTM();
		this.updateTitle();

		return true;
	}

	createIOTM() {
		this.eIOTM = document.createElement('span');
		this.eIOTM.style.border = '2px solid currentColor';
		this.eIOTM.style.borderRadius = '50%';
		this.eIOTM.style.width = '8px';
		this.eIOTM.style.height = '8px';
		this.eIOTM.style.backgroundColor = 'transparent';

		this.updateIOTM();
	}

	updateIOTM() {
		if (this.eIOTM) this.eIOTM.classList.add(this.iotmColor);
	}

	createTitle() {
		this.eTitle = document.createElement('span');
		this.eTitle.setAttribute('class', 'text-gray-800 text-right');
		this.updateTitle();
	}

	updateTitle() {
		if (this.eTitle) this.eTitle.textContent = this.params.value ?? '−';
	}

	get iotmColor() {
		const iotm = this.params.getIOTM(this.params.data) ?? '';
		switch (iotm.toLocaleLowerCase()) {
			case 'itm':
				return 'text-success-100';
			case 'otm':
				return 'text-error-100';
			case 'atm':
				return 'text-secondary-300';
			default:
				return 'text-gray-700';
		}
	}
}

export default CellSymbolTitleRenderer;
