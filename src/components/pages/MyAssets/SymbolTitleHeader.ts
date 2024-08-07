import AgSort from '@/components/common/Tables/classes/AgSort';
import { englishToPersian } from '@/utils/helpers';
import { type IHeaderComp, type IHeaderParams } from '@ag-grid-community/core';

type SymbolTitleHeaderProps = IHeaderParams<Order.TOrder>;

class SymbolTitleHeader implements IHeaderComp {
	eGui!: HTMLDivElement;

	eWrapper!: HTMLDivElement;

	eInput!: HTMLInputElement;

	eEdit: HTMLFormElement | null = null;

	agSort!: AgSort;

	value = '';

	params!: SymbolTitleHeaderProps;

	eventListener!: () => void;

	init(params: SymbolTitleHeaderProps) {
		this.params = params;

		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-items-center ltr relative w-full');

		this.eWrapper = document.createElement('div');
		this.eWrapper.setAttribute('class', 'flex-justify-center w-full');
		this.eWrapper.addEventListener('click', () => this.agSort.sort());

		const btn = document.createElement('button');
		btn.setAttribute('class', 'h-24 pl-8');
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

		this.agSort = new AgSort(this.params);
		this.agSort.create();

		div.appendChild(this.agSort.eSort!);
		div.appendChild(span);

		this.eWrapper.appendChild(div);
		this.eWrapper.appendChild(btn);

		this.eGui.appendChild(this.eWrapper);
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: SymbolTitleHeaderProps) {
		this.params = params;

		this.agSort.setParams(params);
		this.agSort.update();

		return true;
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
			'input-group border bg-white darkness:bg-gray-50 border-gray-200 rtl text-right w-full max-w-full font-normal bg-transparent rounded h-full px-8',
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
		this.filter();
	}

	onChangeValue(value: string) {
		this.value = value;
		this.filter();
	}

	filter() {
		this.params.api.setFilterModel({
			[this.params.column.getColId()]: {
				filterType: 'text',
				type: 'contains',
				filter: englishToPersian(this.value),
			},
		});
	}

	onSubmitForm() {
		this.closeEditMode();
	}
}

export default SymbolTitleHeader;
