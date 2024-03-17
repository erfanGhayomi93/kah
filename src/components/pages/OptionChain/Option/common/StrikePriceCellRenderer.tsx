import { type ICellRendererComp, type ICellRendererParams } from '@ag-grid-community/core';

type StrikePriceCellRendererProps = ICellRendererParams<unknown, number> & {
	activeRowId: number;
};

class StrikePriceCellRenderer implements ICellRendererComp<unknown> {
	eGui!: HTMLDivElement;

	eLeftOverlay: HTMLDivElement | null = null;
	eRightOverlay: HTMLDivElement | null = null;

	eventListener!: () => void;

	init(params: StrikePriceCellRendererProps) {
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center w-full');

		this.eGui.textContent = String(params.valueFormatted ?? '−');
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: StrikePriceCellRendererProps) {
		try {
			const {
				activeRowId,
				node: { rowIndex },
			} = params;

			if (rowIndex === activeRowId) this.createRowOverlay();
			else this.removeRowOverlay();
		} catch (e) {
			//
		}

		return true;
	}

	createOverlay() {
		const overlay = document.createElement('div');
		overlay.style.backgroundColor = 'rgba(229, 238, 255, 0.9)';
		overlay.style.zIndex = '99';
		overlay.style.height = '48px';
		overlay.style.position = 'absolute';
		overlay.style.top = '0';
		overlay.style.width = '192px';
		overlay.style.display = 'flex';
		overlay.style.justifyContent = 'center';
		overlay.style.alignItems = 'center';
		overlay.textContent = 'HELLO';

		return overlay;
	}

	createRowOverlay() {
		this.eLeftOverlay = this.createOverlay();
		this.eLeftOverlay.style.right = '100%';

		this.eRightOverlay = this.createOverlay();
		this.eRightOverlay.style.left = '100%';

		this.eGui.appendChild(this.eLeftOverlay);
		this.eGui.appendChild(this.eRightOverlay);
	}

	removeRowOverlay() {
		if (this.eLeftOverlay) {
			this.eLeftOverlay.remove();
			this.eLeftOverlay = null;
		}
		if (this.eRightOverlay) {
			this.eRightOverlay.remove();
			this.eRightOverlay = null;
		}
	}
}

export default StrikePriceCellRenderer;
