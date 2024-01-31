import { sepNumbers } from '@/utils/helpers';
import { type ICellRendererComp, type ICellRendererParams } from '@ag-grid-community/core';

type CellPercentRendererProps = ICellRendererParams<unknown, number> & {
	percent: number;
};

class CellPercentRenderer implements ICellRendererComp<unknown> {
	eGui!: HTMLDivElement;

	eValue!: HTMLSpanElement;

	ePercent!: HTMLSpanElement;

	eventListener!: () => void;

	init(params: CellPercentRendererProps) {
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center ltr overflow-hidden w-full gap-12');

		this.eValue = document.createElement('span');
		this.eValue.classList.add('w-max');

		this.ePercent = document.createElement('span');
		this.setPercentage(params.percent);

		this.eGui.appendChild(this.eValue);
		this.eGui.appendChild(this.ePercent);

		this.eValue.textContent = this.getValueToDisplay(params);
	}

	getGui() {
		return this.eGui;
	}

	// gets called whenever the cell refreshes
	refresh(params: CellPercentRendererProps) {
		// set value into cell again
		this.eValue.textContent = String(this.getValueToDisplay(params));

		this.setPercentage(params.percent);

		// return true to tell the grid we refreshed successfully
		return true;
	}

	getValueToDisplay(params: CellPercentRendererProps): string | null {
		return sepNumbers(String(params.valueFormatted ? params.valueFormatted : params.value));
	}

	setPercentage(percent: number) {
		const isNegative = percent < 0;
		const percentage = Math.abs(Number(percent.toFixed(2)));

		this.ePercent.textContent = isNegative ? `(${percentage}%)` : `${percentage}%`;

		if (!isNegative) this.ePercent.setAttribute('class', 'w-max text-tiny text-success-100');
		else if (isNegative) this.ePercent.setAttribute('class', 'w-max text-tiny text-error-100');
		else if (percent === 0) this.ePercent.setAttribute('class', 'w-max text-tiny text-gray-800');
	}
}

export default CellPercentRenderer;
