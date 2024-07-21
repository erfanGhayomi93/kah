import { addTooltip } from '@/utils/helpers';
import { type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';

interface CallActionCellProps extends ICellRendererParams<GLOptionOrder.BuyPosition, unknown> {}

class CallActionCell implements ICellRendererComp<GLOptionOrder.BuyPosition> {
	params!: CallActionCellProps;

	eGui!: HTMLDivElement;

	init(params: CallActionCellProps) {
		this.params = params;

		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-center text-light-gray-700 gap-16');

		this.more();
		this.history();
		this.closePosition();
		this.addToStrategy();
	}

	addToStrategy() {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'size-20 flex-justify-center');
		btn.innerHTML =
			'<svg width="2rem" height="2rem" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.99232 17.0704V2.92955" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.0626 10.0001H2.92174" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

		this.eGui.appendChild(btn);

		addTooltip('افزودن به استراتژی', btn);
	}

	closePosition() {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'size-20 flex-justify-center');
		btn.innerHTML =
			'<svg width="2rem" height="2rem" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 10C2.5 10.9849 2.69399 11.9602 3.0709 12.8701C3.44781 13.7801 4.00026 14.6069 4.6967 15.3033C5.39314 15.9997 6.21993 16.5522 7.12987 16.9291C8.03982 17.306 9.01509 17.5 10 17.5C10.9849 17.5 11.9602 17.306 12.8701 16.9291C13.7801 16.5522 14.6069 15.9997 15.3033 15.3033C15.9997 14.6069 16.5522 13.7801 16.9291 12.8701C17.306 11.9602 17.5 10.9849 17.5 10C17.5 9.01509 17.306 8.03982 16.9291 7.12987C16.5522 6.21993 15.9997 5.39314 15.3033 4.6967C14.6069 4.00026 13.7801 3.44781 12.8701 3.0709C11.9602 2.69399 10.9849 2.5 10 2.5C9.01509 2.5 8.03982 2.69399 7.12987 3.0709C6.21993 3.44781 5.39314 4.00026 4.6967 4.6967C4.00026 5.39314 3.44781 6.21993 3.0709 7.12987C2.69399 8.03982 2.5 9.01509 2.5 10Z" stroke="#5D606D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 7.5L7.5 12.5" stroke="#5D606D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

		this.eGui.appendChild(btn);

		addTooltip('فریز سهم', btn);
	}

	history() {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'size-20 flex-justify-center');
		btn.innerHTML =
			'<svg width="2rem" height="2rem" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.48461 3.34644L2.48485 3.34668C2.48477 3.3466 2.48469 3.34652 2.48461 3.34644ZM2.48461 3.34644L2.48459 3.34642C2.4846 3.34643 2.4846 3.34643 2.48461 3.34644ZM4.76059 4.76982L4.76054 4.76986C4.75298 4.77745 4.74489 4.78447 4.73631 4.79088L4.27382 5.1366L4.68213 5.54491L5.81537 6.67815L2.19147 7.00794L2.52056 3.38242L3.68199 4.54477L4.0876 4.95071L4.43419 4.49334C4.44042 4.48511 4.44723 4.47733 4.45456 4.47006L4.45456 4.47007L4.45652 4.4681C5.73617 3.18396 7.42162 2.38342 9.2255 2.20298C11.0294 2.02253 12.84 2.47335 14.3487 3.47857C15.8573 4.48379 16.9706 5.98117 17.4988 7.71542C18.0269 9.44967 17.9371 11.3134 17.2448 12.9889C16.5525 14.6644 15.3004 16.0478 13.7022 16.9034C12.1039 17.759 10.2583 18.0338 8.48012 17.6808C6.70193 17.3279 5.10121 16.3691 3.95087 14.9679C2.80053 13.5667 2.1718 11.81 2.17188 9.99708V9.99706C2.17188 9.94023 2.19445 9.88573 2.23464 9.84554L1.88108 9.49199L2.23464 9.84554C2.27482 9.80535 2.32933 9.78278 2.38616 9.78278C2.44299 9.78278 2.4975 9.80535 2.53768 9.84554L2.89124 9.49199L2.53768 9.84554C2.57787 9.88573 2.60044 9.94023 2.60044 9.99706C2.60044 11.7107 3.1948 13.3713 4.2822 14.6958C5.3696 16.0202 6.88271 16.9265 8.56358 17.2602C10.2444 17.5938 11.989 17.3341 13.4998 16.5253C15.0106 15.7166 16.1941 14.4089 16.8486 12.8251C17.5031 11.2414 17.588 9.47965 17.0889 7.84029C16.5897 6.20094 15.5374 4.78546 14.1114 3.83517C12.6854 2.88489 10.9739 2.45862 9.26874 2.62906C7.56358 2.79949 5.97032 3.55608 4.76059 4.76982Z" fill="currentColor" stroke="currentColor"/><path d="M10.7254 5.23772C10.7254 5.04828 10.6502 4.8666 10.5162 4.73265C10.3823 4.59869 10.2006 4.52344 10.0112 4.52344C9.82172 4.52344 9.64004 4.59869 9.50608 4.73265C9.37213 4.8666 9.29688 5.04828 9.29688 5.23772V9.99962C9.29682 10.1207 9.32756 10.2398 9.38621 10.3458C9.44485 10.4518 9.52947 10.5411 9.63211 10.6053L12.4893 12.391C12.6499 12.4916 12.8439 12.5242 13.0286 12.4817C13.12 12.4606 13.2064 12.4218 13.2828 12.3673C13.3593 12.3129 13.4242 12.2439 13.474 12.1644C13.5238 12.0848 13.5574 11.9963 13.573 11.9037C13.5885 11.8112 13.5857 11.7165 13.5646 11.6251C13.5436 11.5336 13.5047 11.4472 13.4503 11.3708C13.3958 11.2944 13.3269 11.2294 13.2473 11.1796L10.7254 9.60343V5.23772Z" fill="currentColor"/></svg>';

		this.eGui.appendChild(btn);

		addTooltip('تاریخچه', btn);
	}

	more() {
		const btn = document.createElement('button');
		btn.setAttribute('class', 'size-20 flex-justify-center');
		btn.innerHTML =
			'<svg width="2rem" height="2rem" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0026 11.6654C10.9231 11.6654 11.6693 10.9192 11.6693 9.9987C11.6693 9.07822 10.9231 8.33203 10.0026 8.33203C9.08213 8.33203 8.33594 9.07822 8.33594 9.9987C8.33594 10.9192 9.08213 11.6654 10.0026 11.6654Z" fill="currentColor"/><path d="M10.0026 5.83333C10.9231 5.83333 11.6693 5.08714 11.6693 4.16667C11.6693 3.24619 10.9231 2.5 10.0026 2.5C9.08213 2.5 8.33594 3.24619 8.33594 4.16667C8.33594 5.08714 9.08213 5.83333 10.0026 5.83333Z" fill="currentColor"/><path d="M10.0026 17.5013C10.9231 17.5013 11.6693 16.7551 11.6693 15.8346C11.6693 14.9142 10.9231 14.168 10.0026 14.168C9.08213 14.168 8.33594 14.9142 8.33594 15.8346C8.33594 16.7551 9.08213 17.5013 10.0026 17.5013Z" fill="currentColor"/></svg>';

		this.eGui.appendChild(btn);

		addTooltip('بیشتر', btn);
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: CallActionCellProps) {
		this.params = params;
		return true;
	}
}

export default CallActionCell;
