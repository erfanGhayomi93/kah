import { type AgPromise, type ICellRendererComp, type ICellRendererParams } from 'ag-grid-community';

class AgreementTitle implements ICellRendererComp<Settings.IAgreements> {
	eGui!: HTMLDivElement;

	eValue!: HTMLSpanElement;

	init(params: ICellRendererParams<Settings.IAgreements, any, any>): void | AgPromise<void> {
		this.eGui = document.createElement('div');
		this.eGui.setAttribute('class', 'flex-justify-start w-full rtl gap-8 cursor-pointer');
		this.eValue = document.createElement('span');
		this.eValue.textContent = String(params.value);
		this.eGui.innerHTML =
			'<svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.9909 6.34039L15.8398 2.23372C15.23 1.64299 14.4376 1.33594 13.6265 1.33594H6.2576C4.49761 1.33594 3.05762 2.77593 3.05762 4.53592V19.4692C3.05762 21.2293 4.49761 22.6693 6.2576 22.6693H17.7421C19.5021 22.6693 20.9421 21.2293 20.9421 19.4692V8.60704C20.9421 7.73247 20.5556 6.9051 19.9909 6.34039ZM9.44037 6.29861H13.8145C14.3054 6.29861 14.7034 6.69618 14.7034 7.1875C14.7034 7.67882 14.3054 8.07639 13.8145 8.07639H9.44037C8.94949 8.07639 8.55149 7.67882 8.55149 7.1875C8.55149 6.69618 8.94949 6.29861 9.44037 6.29861ZM14.7198 18.4479C13.4902 18.4479 12.4976 17.4479 12.4976 16.2257C12.4976 15.0034 13.4902 14.0035 14.7198 14.0035C15.9421 14.0035 16.9421 15.0034 16.9421 16.2257C16.9421 17.4479 15.9421 18.4479 14.7198 18.4479ZM16.4933 11.7066H7.50678C7.0159 11.7066 6.61789 11.309 6.61789 10.8177C6.61789 10.3264 7.0159 9.92882 7.50678 9.92882H16.4933C16.9842 9.92882 17.3822 10.3264 17.3822 10.8177C17.3822 11.309 16.9842 11.7066 16.4933 11.7066Z" fill="currentColor" /></svg>';

		this.eGui.appendChild(this.eValue);
	}

	getGui() {
		return this.eGui;
	}

	refresh(params: ICellRendererParams<Settings.IAgreements, any, any>) {
		this.eValue.textContent = String(params?.value ?? '');
		return true;
	}
}

export default AgreementTitle;
