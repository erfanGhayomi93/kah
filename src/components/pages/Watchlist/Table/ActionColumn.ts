import { type ICellRendererComp, type ICellRendererParams } from '@ag-grid-community/core';

type ActionColumnProps = ICellRendererParams<Option.Root, number> & {
	onDelete: (symbol: Option.Root) => void;
	onAdd: (symbol: Option.Root) => void;
	deletable?: boolean;
};

class ActionColumn implements ICellRendererComp<Option.Root> {
	eGui!: HTMLDivElement;

	params!: ActionColumnProps;

	getGui() {
		return this.eGui;
	}

	init(params: ActionColumnProps) {
		this.params = params;

		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center gap-4 h-full w-full');

		if (params?.deletable) this.eGui.appendChild(this.createTrashButton());
		this.eGui.appendChild(this.createAddButton());
	}

	refresh(params: ActionColumnProps) {
		if (this.params.deletable !== params.deletable) {
			this.params = params;
			return true;
		}

		return false;
	}

	private createAddButton(): HTMLButtonElement {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'flex-justify-center text-gray-700 rounded px-4');
		btn.onclick = () => this.params.onAdd(this.params.data!);
		btn.innerHTML =
			'<svg width="1.6rem" height="1.6rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.99931 16C7.70339 16 7.41959 15.8824 7.21034 15.6732C7.0011 15.464 6.88354 15.1802 6.88354 14.8842V1.11576C6.88354 0.819842 7.0011 0.536044 7.21034 0.326799C7.41959 0.117553 7.70339 0 7.99931 0C8.29522 0 8.57902 0.117553 8.78827 0.326799C8.99751 0.536044 9.11507 0.819842 9.11507 1.11576V14.8842C9.11507 15.1802 8.99751 15.464 8.78827 15.6732C8.57902 15.8824 8.29522 16 7.99931 16Z" fill="#818486" /><path d="M14.8842 9.11507H1.11576C0.819842 9.11507 0.536044 8.99751 0.326799 8.78827C0.117553 8.57902 0 8.29522 0 7.99931C0 7.70339 0.117553 7.41959 0.326799 7.21034C0.536044 7.0011 0.819842 6.88354 1.11576 6.88354H14.8842C15.1802 6.88354 15.464 7.0011 15.6732 7.21034C15.8824 7.41959 16 7.70339 16 7.99931C16 8.29522 15.8824 8.57902 15.6732 8.78827C15.464 8.99751 15.1802 9.11507 14.8842 9.11507Z" fill="currentColor" /></svg>';

		return btn;
	}

	private createTrashButton(): HTMLButtonElement {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'flex-justify-center text-gray-900 rounded px-4');
		btn.onclick = () => this.params.onDelete(this.params.data!);
		btn.innerHTML =
			'<svg width="2rem" height="2rem" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" /> <path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352" /> <path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" /></svg>';

		return btn;
	}
}

export default ActionColumn;
