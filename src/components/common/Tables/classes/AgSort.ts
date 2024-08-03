import { type IHeaderParams } from '@ag-grid-community/core';

class AgSort {
	eSort?: HTMLSpanElement;

	constructor(private params: IHeaderParams) {}

	create() {
		try {
			this.eSort = document.createElement('span');
			this.update();
		} catch (e) {
			//
		}
	}

	update() {
		try {
			if (!this.eSort) throw new Error('"eSort" element not found!');

			const sorting = this.sorting;

			this.eSort.setAttribute('class', 'ag-sort-indicator-icon ag-sort-ascending-icon');
			this.eSort.innerHTML =
				'<svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="36" d="M112 244l144-144 144 144M256 120v292" /></svg>';

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
				state: [{ colId, sort: null }],
			});
		} else {
			const sort: 'asc' | 'desc' = sorting === 'asc' ? 'desc' : 'asc';
			this.params.api.applyColumnState({
				defaultState: { sort: null },
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
