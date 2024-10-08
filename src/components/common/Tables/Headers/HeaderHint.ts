import { addTooltip } from '@/utils/helpers';
import { type IHeaderComp, type IHeaderParams } from '@ag-grid-community/core';
import clsx from 'clsx';
import AgSort from '../classes/AgSort';

interface HeaderHintProps extends IHeaderParams {
	tooltip: string | number;
}

class HeaderHint implements IHeaderComp {
	eGui!: HTMLDivElement;

	eHint!: HTMLSpanElement;

	params!: HeaderHintProps;

	agSort!: AgSort;

	eventListener!: () => void;

	init(params: HeaderHintProps) {
		const enableSorting = params.enableSorting;

		this.params = params;

		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', clsx('w-full gap-8 flex-justify-center', enableSorting && 'cursor-pointer'));
		this.eGui.textContent = params.displayName;

		this.agSort = new AgSort(this.params);
		this.agSort.create();

		this.createHint();

		this.params.column.addEventListener('sortChanged', () => {
			this.agSort.update();
		});

		if (enableSorting) this.eGui.addEventListener('click', () => this.agSort.sort());
		this.eGui.appendChild(this.eHint);
		this.eGui.appendChild(this.agSort.eSort!);
	}

	createHint() {
		this.eHint = document.createElement('span');
		this.eHint.setAttribute('class', 'text-gray-700 cursor-pointer');
		this.eHint.innerHTML =
			'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.83952 1.33203C7.52098 1.33203 6.23205 1.72302 5.13572 2.45557C4.03939 3.18811 3.18491 4.2293 2.68032 5.44747C2.17574 6.66565 2.04372 8.00609 2.30095 9.2993C2.55819 10.5925 3.19313 11.7804 4.12548 12.7127C5.05783 13.6451 6.24571 14.28 7.53892 14.5373C8.83213 14.7945 10.1726 14.6625 11.3907 14.1579C12.6089 13.6533 13.6501 12.7988 14.3827 11.7025C15.1152 10.6062 15.5062 9.31724 15.5062 7.9987C15.5062 7.12322 15.3337 6.25631 14.9987 5.44747C14.6637 4.63864 14.1726 3.90371 13.5536 3.28465C12.9345 2.6656 12.1996 2.17453 11.3907 1.8395C10.5819 1.50447 9.715 1.33203 8.83952 1.33203ZM8.83952 13.332C7.78469 13.332 6.75354 13.0192 5.87648 12.4332C4.99942 11.8472 4.31583 11.0142 3.91216 10.0397C3.5085 9.06514 3.40288 7.99278 3.60867 6.95822C3.81445 5.92365 4.32241 4.97334 5.06828 4.22746C5.81417 3.48158 6.76447 2.97363 7.79904 2.76784C8.83361 2.56206 9.90596 2.66767 10.8805 3.07134C11.855 3.47501 12.688 4.15859 13.274 5.03566C13.8601 5.91272 14.1729 6.94386 14.1729 7.9987C14.1729 9.41319 13.611 10.7697 12.6108 11.7699C11.6106 12.7701 10.254 13.332 8.83952 13.332Z" fill="currentColor" /><path d="M8.84017 4.00004C8.22133 4.00004 7.62784 4.24588 7.19025 4.68346C6.75267 5.12105 6.50684 5.71454 6.50684 6.33338C6.50684 6.51019 6.57707 6.67976 6.7021 6.80478C6.82712 6.92981 6.99669 7.00004 7.1735 7.00004C7.35031 7.00004 7.51988 6.92981 7.64491 6.80478C7.76993 6.67976 7.84017 6.51019 7.84017 6.33338C7.84017 6.1356 7.89882 5.94226 8.0087 5.77781C8.11858 5.61336 8.27476 5.48519 8.45749 5.4095C8.64021 5.33381 8.84128 5.31401 9.03526 5.35259C9.22924 5.39118 9.40742 5.48642 9.54728 5.62627C9.68713 5.76612 9.78237 5.94431 9.82095 6.13829C9.85954 6.33227 9.83974 6.53334 9.76405 6.71606C9.68836 6.89879 9.56019 7.05497 9.39574 7.16485C9.23129 7.27473 9.03795 7.33338 8.84017 7.33338C8.66336 7.33338 8.49379 7.40362 8.36876 7.52864C8.24374 7.65366 8.1735 7.82323 8.1735 8.00004V9.33338C8.1735 9.51019 8.24374 9.67976 8.36876 9.80478C8.49379 9.92981 8.66336 10 8.84017 10C9.01698 10 9.18655 9.92981 9.31157 9.80478C9.4366 9.67976 9.50684 9.51019 9.50684 9.33338V8.56005C10.0456 8.40271 10.5093 8.05595 10.8125 7.58367C11.1157 7.11139 11.238 6.54542 11.1568 5.99009C11.0756 5.43475 10.7964 4.92748 10.3707 4.56177C9.94497 4.19606 9.4014 3.99656 8.84017 4.00004Z" fill="currentColor" /><path d="M8.83952 12.0013C9.20771 12.0013 9.50618 11.7028 9.50618 11.3346C9.50618 10.9664 9.20771 10.668 8.83952 10.668C8.47133 10.668 8.17285 10.9664 8.17285 11.3346C8.17285 11.7028 8.47133 12.0013 8.83952 12.0013Z" fill="currentColor" /></svg>';

		addTooltip(String(this.params.tooltip ?? '−'), this.eHint);
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: HeaderHintProps) {
		this.params = params;

		this.agSort.setParams(params);
		this.agSort.update();

		return false;
	}
}

export default HeaderHint;
