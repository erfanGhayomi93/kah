import { type ICellRendererComp, type ICellRendererParams } from '@ag-grid-community/core';

type ActionColumnProps = ICellRendererParams<Option.Root, number>;

class ActionColumn implements ICellRendererComp<Option.Root> {
	eGui!: HTMLDivElement;

	params!: ActionColumnProps;

	getGui() {
		return this.eGui;
	}

	init(params: ActionColumnProps) {
		this.params = params;

		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-between gap-4 h-full w-full');

		const trashBtn = this.createTrashButton();
		const addBtn = this.createAddButton();

		this.eGui.appendChild(trashBtn);
		this.eGui.appendChild(addBtn);
	}

	refresh(params: ActionColumnProps) {
		this.params = params;
		return true;
	}

	private createTrashButton(): HTMLButtonElement {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'flex-justify-center text-gray-700 rounded');
		btn.innerHTML =
			'<svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 4.88889H15.75L14.8214 4H10.1786L9.25 4.88889H6V6.66667H19M6.92857 18.2222C6.92857 18.6937 7.12423 19.1459 7.47252 19.4793C7.8208 19.8127 8.29317 20 8.78571 20H16.2143C16.7068 20 17.1792 19.8127 17.5275 19.4793C17.8758 19.1459 18.0714 18.6937 18.0714 18.2222V7.55556H6.92857V18.2222Z" fill="currentColor" /></svg>';

		return btn;
	}

	private createAddButton(): HTMLButtonElement {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'flex-justify-center text-gray-700 rounded');
		btn.innerHTML =
			'<svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9995 20C11.7036 20 11.4198 19.8824 11.2106 19.6732C11.0013 19.464 10.8838 19.1802 10.8838 18.8842V5.11576C10.8838 4.81984 11.0013 4.53604 11.2106 4.3268C11.4198 4.11755 11.7036 4 11.9995 4C12.2955 4 12.5793 4.11755 12.7885 4.3268C12.9978 4.53604 13.1153 4.81984 13.1153 5.11576V18.8842C13.1153 19.1802 12.9978 19.464 12.7885 19.6732C12.5793 19.8824 12.2955 20 11.9995 20Z" fill="currentColor" /><path d="M18.8842 13.1148H5.11576C4.81984 13.1148 4.53604 12.9973 4.3268 12.788C4.11755 12.5788 4 12.295 4 11.9991C4 11.7031 4.11755 11.4193 4.3268 11.2101C4.53604 11.0009 4.81984 10.8833 5.11576 10.8833H18.8842C19.1802 10.8833 19.464 11.0009 19.6732 11.2101C19.8824 11.4193 20 11.7031 20 11.9991C20 12.295 19.8824 12.5788 19.6732 12.788C19.464 12.9973 19.1802 13.1148 18.8842 13.1148Z" fill="currentColor" /></svg>';

		return btn;
	}
}

export default ActionColumn;
