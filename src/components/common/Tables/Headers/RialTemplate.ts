import { type IHeaderComp, type IHeaderParams } from '@ag-grid-community/core';

class RialTemplate implements IHeaderComp {
	eGui!: HTMLDivElement;

	eventListener!: () => void;

	init(params: IHeaderParams) {
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center w-full gap-4');
		this.eGui.textContent = params.displayName;

		this.eGui.appendChild(this.rial());
	}

	rial() {
		const span = document.createElement('span');
		span.textContent = '(ریال)';
		span.setAttribute('class', 'text-gray-700 font-normal text-tiny');

		return span;
	}

	getGui() {
		return this.eGui;
	}

	refresh() {
		return false;
	}
}

export default RialTemplate;
