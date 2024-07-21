type TCommission = Record<TBsSides, number>;

class OFormula {
	private static _contractSize = 0;

	private static _requiredMargin = 0;

	private static _commission: TCommission = { buy: 0, sell: 0 };

	private static _side: TBsSides = 'buy';

	private static _type: TBsSymbolTypes = 'base';

	/**
	 * Calculate price based on quantity and value
	 * Price = ( Value - InitialRequiredMargin ) / ( Quantity * ( 1 + ( Commission × ContractSize ) ) )
	 * @param quantity number
	 * @param value number
	 * @returns number
	 */
	public static price(quantity: number, value: number): number {
		const v = (value - this.requiredMargin) / (quantity * (1 + this.commission * this.contractSize));
		if (v === Infinity || isNaN(v)) return 0;

		return Math.ceil(v);
	}

	/**
	 * Calculate quantity based on price and value
	 * Quantity = ( Value - InitialRequiredMargin ) / ( Price * ( 1 + ( Commission × ContractSize ) ) )
	 * @param price number
	 * @param value number
	 * @returns number
	 */
	public static quantity(price: number, value: number): number {
		const v = (value - this.requiredMargin) / (price * (1 + this.commission * this.contractSize));
		if (v === Infinity || isNaN(v)) return 0;

		return Math.floor(v);
	}

	/**
	 * Calculate value based on price and quantity
	 * Value = Price × Quantity + ( Price × Quantity × Commission × ContractSize ) + InitialRequiredMargin
	 * @param price number
	 * @param quantity number
	 * @returns number
	 */
	public static value(price: number, quantity: number): number {
		const v = price * quantity + price * quantity * this.commission * this.contractSize + this.requiredMargin;
		return Math.ceil(v);
	}

	public static setType(t: TBsSymbolTypes) {
		this._type = t;
		return this;
	}

	public static setSide(s: TBsSides) {
		this._side = s;
		return this;
	}

	public static setCommission(v: TCommission) {
		this._commission = v;
		return this;
	}

	public static setContractSize(v: number) {
		this._contractSize = v;
		return this;
	}

	public static setRequiredMargin(v: number) {
		this._requiredMargin = v;
		return this;
	}

	private static get commission(): number {
		let com = this._commission[this._side];
		if (this._side === 'sell') com *= -1;

		return com;
	}

	private static get contractSize(): number {
		if (this._type === 'option') return this._contractSize;
		return 1;
	}

	private static get requiredMargin(): number {
		if (this._side === 'sell' && this._type === 'option') return this._requiredMargin;
		return 0;
	}
}

export default OFormula;
