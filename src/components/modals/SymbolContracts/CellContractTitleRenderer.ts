import { type ICellRendererComp, type ICellRendererParams } from '@ag-grid-community/core';

type CellContractTitleRendererProps = ICellRendererParams<Option.Root, string>;

class CellContractTitleRenderer implements ICellRendererComp<Option.Root> {
	eGui!: HTMLDivElement;

	eTitle!: HTMLSpanElement;

	eRadio!: HTMLInputElement;

	eventListener!: () => void;

	init(params: CellContractTitleRendererProps) {
		const { data } = params;

		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center gap-8');

		this.eRadio = document.createElement('input');
		this.eRadio.name = 'contract';
		this.eRadio.type = 'radio';

		this.isSelected(params);

		this.eTitle = document.createElement('span');
		this.eTitle.classList.add('text-gray-1000');
		this.eTitle.textContent = data!.symbolInfo.symbolTitle;

		this.eGui.appendChild(this.eTitle);
		this.eGui.appendChild(this.eRadio);
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: CellContractTitleRendererProps) {
		this.isSelected(params);
		return true;
	}

	isSelected({ data, api }: CellContractTitleRendererProps) {
		const selectedRows = api.getSelectedRows();
		if (selectedRows.length > 0 && selectedRows[0].symbolInfo.symbolISIN === data!.symbolInfo.symbolISIN)
			this.eRadio.checked = true;
	}
}

export default CellContractTitleRenderer;
