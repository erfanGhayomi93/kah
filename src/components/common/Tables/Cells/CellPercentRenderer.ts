import { getColorBasedOnPercent } from '@/utils/helpers';
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
		this.eGui.setAttribute('class', 'flex-justify-center ltr overflow-hidden text-base w-full gap-4');

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

	refresh(params: CellPercentRendererProps) {
		this.eValue.textContent = String(this.getValueToDisplay(params));
		this.setPercentage(params.percent);

		return true;
	}

	getValueToDisplay(params: CellPercentRendererProps): string {
		return params?.valueFormatted
			? params.valueFormatted
			: String(Array.isArray(params.value) ? params.value[0] : params.value ?? 0);
	}

	setPercentage(percent: number) {
		const percentage = Number(Math.abs(percent).toFixed(2));

		this.ePercent.textContent = percent < 0 ? `(${percentage}%)` : `${percentage}%`;
		this.ePercent.setAttribute('class', `w-max text-tiny ${getColorBasedOnPercent(percent)}`);
	}
}

export default CellPercentRenderer;
