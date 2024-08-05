import clsx from 'clsx';
import { type StrikePriceCellRendererProps } from './StrikePriceCellRenderer';

interface IParams {
	side: 'buy' | 'sell';
	params: StrikePriceCellRendererProps;
}

class StrikePriceBtnGroup {
	eGroup!: HTMLDivElement;

	eBuyBtn!: HTMLButtonElement;

	eSellBtn!: HTMLButtonElement;

	params: StrikePriceCellRendererProps;

	data: Option.Root;

	side: IParams['side'];

	constructor({ params, side }: IParams) {
		this.data = params.node.data![side]!;
		this.side = side;
		this.params = params;

		this.createGroup();
	}

	public setDisabled(disabled: boolean) {
		this.eBuyBtn.disabled = disabled;
		this.eSellBtn.disabled = disabled;
	}

	private createGroup() {
		this.eGroup = document.createElement('div');
		this.eGroup.setAttribute(
			'class',
			clsx('relative gap-8 flex-items-center', this.side === 'sell' && 'flex-row-reverse'),
		);

		this.eGroup.appendChild(this._createBuyBtn());
		this.eGroup.appendChild(this._createSellBtn());
	}

	private createBtn() {
		const btn = document.createElement('button');
		btn.setAttribute(
			'class',
			'bg-white darkness:bg-gray-50 select-none rounded text-base text-gray-700 flex-justify-center transition-colors',
		);

		return btn;
	}

	private _createBuyBtn() {
		this.eBuyBtn = this.createBtn();
		this.eBuyBtn.type = 'button';
		this.eBuyBtn.classList.add('hover:!bg-success-100', 'hover:text-white', 'h-32', 'w-40');
		this.eBuyBtn.textContent = 'خرید';
		this.eBuyBtn.onclick = (e) => {
			e.stopPropagation();
			this.params.buy(this.data);
		};

		return this.eBuyBtn;
	}

	private _createSellBtn() {
		this.eSellBtn = this.createBtn();
		this.eSellBtn.type = 'button';
		this.eSellBtn.classList.add('hover:!bg-error-100', 'hover:text-white', 'h-32', 'w-40');
		this.eSellBtn.textContent = 'فروش';
		this.eSellBtn.onclick = (e) => {
			e.stopPropagation();
			this.params.sell(this.data);
		};

		return this.eSellBtn;
	}
}

export default StrikePriceBtnGroup;
