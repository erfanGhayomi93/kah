import { type IHeaderParams } from '@ag-grid-community/core';

class AgSort {
	eSort?: HTMLSpanElement;

	constructor(private params: IHeaderParams) {}

	create() {
		try {
			this.eSort = document.createElement('span');
			this.eSort.setAttribute('unselectable', 'on');
			this.eSort.setAttribute('role', 'presentation');
			this.update();
		} catch (e) {
			//
		}
	}

	update() {
		try {
			if (!this.eSort) throw new Error('"eSort" element not found!');

			const sorting = this.sorting;

			this.eSort.setAttribute('class', 'ag-icon ag-icon-asc transform');

			if (!sorting) this.eSort.classList.add('hidden');
			else if (sorting === 'desc') this.eSort.classList.add('rotate-180');
		} catch (e) {
			//
		}
	}

	sort() {
		const { sorting, colId } = this;

		if (sorting === 'desc') {
			this.params.api.applyColumnState({
				defaultState: { sort: null },
			});
		} else {
			const sort: 'asc' | 'desc' = sorting === 'asc' ? 'desc' : 'asc';
			this.params.api.applyColumnState({
				state: [{ colId, sort }],
			});
		}

		this.update();
	}

	setParams(newParams: IHeaderParams) {
		this.params = newParams;
	}

	get sorting() {
		return this.params.column?.getSort();
	}

	get colId() {
		return this.params.column.getColId();
	}
}

export default AgSort;
