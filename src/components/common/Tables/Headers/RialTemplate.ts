import { type IHeaderComp, type IHeaderParams } from '@ag-grid-community/core';
import AgSort from '../classes/AgSort';

class RialTemplate implements IHeaderComp {
	eGui!: HTMLDivElement;

	agSort!: AgSort;

	eventListener!: () => void;

	init(params: IHeaderParams) {
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center cursor-pointer w-full gap-4');
		this.eGui.textContent = params.displayName;

		this.agSort = new AgSort(params);
		this.agSort.create();

		this.eGui.addEventListener('click', () => this.agSort.sort());
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

	refresh(params: IHeaderParams) {
		this.agSort.setParams(params);
		this.agSort.update();

		return false;
	}
}

export default RialTemplate;
