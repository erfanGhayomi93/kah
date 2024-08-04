import { type ITableData } from '@/components/pages/OptionChain/Option/OptionTable';
import { type ICellRendererComp, type ICellRendererParams } from '@ag-grid-community/core';

type CellSymbolTitleRendererRendererProps = ICellRendererParams<ITableData, Option.Root> & {
	reverse: boolean;
	disabled: boolean;
	checkbox: boolean;
	isSelected: (symbolISIN: string) => boolean;
};

class CellSymbolTitleRendererRenderer implements ICellRendererComp<ITableData> {
	eGui!: HTMLDivElement;

	eTitle!: HTMLSpanElement;

	params!: CellSymbolTitleRendererRendererProps;

	eIOTM!: HTMLSpanElement;

	eCheckbox!: HTMLInputElement;

	init(params: CellSymbolTitleRendererRendererProps) {
		this.params = params;

		this.eGui = document.createElement('div');
		this.eGui.setAttribute(
			'class',
			`w-full flex-justify-between gap-8${this.params.reverse ? ' flex-row-reverse' : ''}`,
		);

		try {
			this.createCheckbox();
			this.createIOTM();
			this.createTitle();

			this.eGui.appendChild(this.eIOTM);
			this.eGui.appendChild(this.eTitle);
			if (this.params.checkbox) this.eGui.appendChild(this.eCheckbox);
		} catch (e) {
			//
		}
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: CellSymbolTitleRendererRendererProps) {
		this.params = params;

		this.updateCheckbox();
		this.updateIOTM();
		this.updateTitle();

		return true;
	}

	createCheckbox() {
		this.eCheckbox = document.createElement('input');
		this.eCheckbox.type = 'checkbox';
		this.eCheckbox.name = 'contract';
		this.eCheckbox.onchange = (e) => e.preventDefault();
		this.eCheckbox.onclick = (e) => e.preventDefault();

		this.updateCheckbox();
	}

	updateCheckbox() {
		if (!this.eCheckbox) return;

		this.eCheckbox.disabled = this.params.disabled;
		this.eCheckbox.checked = Boolean(this.params.isSelected?.(this.symbolISIN));
	}

	createIOTM() {
		this.eIOTM = document.createElement('span');
		this.eIOTM.style.border = '2px solid';
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
		this.eTitle.classList.add('text-gray-800');
		this.updateTitle();
	}

	updateTitle() {
		if (this.eTitle) this.eTitle.textContent = this.symbolTitle;
	}

	get iotmColor() {
		const iotm = this.params.value?.optionWatchlistData?.iotm ?? '';
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

	get symbolISIN() {
		return this.params.value?.symbolInfo?.symbolISIN ?? '';
	}

	get symbolTitle() {
		return this.params.value?.symbolInfo?.symbolTitle ?? '−';
	}
}

export default CellSymbolTitleRendererRenderer;
