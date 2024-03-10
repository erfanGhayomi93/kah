import { englishToPersian } from '@/utils/helpers';
import { type IHeaderComp, type IHeaderParams } from 'ag-grid-community';

type SymbolTitleHeaderProps = IHeaderParams<Order.TOrder>;

class SymbolTitleHeader implements IHeaderComp {
	eGui!: HTMLDivElement;

	eWrapper!: HTMLDivElement;

	eInput!: HTMLInputElement;

	eSort!: HTMLSpanElement;

	eEdit: HTMLFormElement | null = null;

	value = '';

	params!: SymbolTitleHeaderProps;

	eventListener!: () => void;

	init(params: SymbolTitleHeaderProps) {
		this.params = params;

		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-items-center ltr relative w-full');

		this.eWrapper = document.createElement('div');
		this.eWrapper.setAttribute('class', 'flex-justify-end w-full');
		this.eWrapper.addEventListener('click', () => this.setSorting());

		const btn = document.createElement('button');
		btn.setAttribute('class', 'h-24 pr-8');
		btn.type = 'button';
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			this.openEditMode();
		});
		btn.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';

		const div = document.createElement('div');
		div.setAttribute('class', 'flex-justify-center gap-4');

		const span = document.createElement('span');
		span.textContent = 'نماد';

		this.eSort = document.createElement('span');
		this.eSort.setAttribute('unselectable', 'on');
		this.eSort.setAttribute('role', 'presentation');
		this.updateSortIcon();

		div.appendChild(this.eSort);
		div.appendChild(span);

		this.eWrapper.appendChild(btn);
		this.eWrapper.appendChild(div);

		this.eGui.appendChild(this.eWrapper);
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: SymbolTitleHeaderProps) {
		this.params = params;
		this.updateSortIcon();

		return true;
	}

	get sorting() {
		return this.params.column?.getSort();
	}

	setSorting() {
		const sorting = this.sorting;
		const sortingMethod = !sorting ? 'asc' : sorting === 'asc' ? 'desc' : undefined;

		this.params.api.applyColumnState({
			state: [{ colId: 'symbolTitle', sort: sortingMethod }],
			defaultState: { sort: null },
		});

		this.updateSortIcon();
	}

	updateSortIcon() {
		const sorting = this.sorting;

		this.eSort.setAttribute('class', 'ag-icon ag-icon-asc transform');

		if (!sorting) this.eSort.classList.add('hidden');
		else if (sorting === 'desc') this.eSort.classList.add('rotate-180');
	}

	openEditMode() {
		this.eWrapper.style.position = 'absolute';
		this.eWrapper.style.visibility = 'hidden';
		this.eWrapper.style.pointerEvents = 'none';

		this.eEdit = document.createElement('form');
		this.eEdit.setAttribute('class', 'flex w-full h-32 gap-4');
		this.eEdit.addEventListener('submit', (e) => {
			e.preventDefault();
			e.stopPropagation();

			this.onSubmitForm();
		});

		this.eInput = document.createElement('input');
		this.eInput.autofocus = true;
		this.eInput.maxLength = 40;
		this.eInput.value = this.value;
		this.eInput.placeholder = 'نام نماد';
		this.eInput.setAttribute(
			'class',
			'input-group border border-gray-500 rtl text-right w-full max-w-full font-normal bg-transparent rounded h-full px-8',
		);
		this.eInput.addEventListener('input', (e) => this.onChangeValue((e.target as HTMLInputElement).value));

		const btn = document.createElement('button');
		btn.type = 'button';
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			this.closeEditMode();
		});
		btn.setAttribute('class', 'absolute flex-items-center h-full px-8');
		btn.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1.6rem" height="1.6rem"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368" /></svg>';

		this.eEdit.appendChild(btn);
		this.eEdit.appendChild(this.eInput);

		this.eGui.appendChild(this.eEdit);

		this.eInput?.focus();
	}

	closeEditMode() {
		if (this.eEdit) this.eEdit.remove();
		this.eEdit = null;

		this.onClear();

		this.eWrapper.style.position = 'relative';
		this.eWrapper.style.visibility = 'visible';
		this.eWrapper.style.pointerEvents = 'fill';
	}

	onClear() {
		this.value = '';
		this.params.api.setGridOption('quickFilterText', englishToPersian(this.value));
	}

	onChangeValue(value: string) {
		this.value = value;
		this.params.api.setGridOption('quickFilterText', englishToPersian(this.value));
	}

	onSubmitForm() {
		this.closeEditMode();
	}
}

export default SymbolTitleHeader;
