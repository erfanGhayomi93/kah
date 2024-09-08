type TCommission = Record<TBsSides, number>;

class OFormula {
	private static _contractSize = 0;

	private static _initialRequiredMargin = 0;

	private static _commission: TCommission = { buy: 0, sell: 0 };

	private static _side: TBsSides = 'buy';

	private static _type: TBsSymbolTypes = 'base';

	/**
	 * Calculate price based on quantity and value
	 * Price = ( Value - InitialRequiredMargin × Quantity ) / ( Quantity × ContractSize × ( 1 + Commission ) )
	 * @param quantity number
	 * @param value number
	 * @returns number
	 */
	public static price(quantity: number, value: number): number {
		const p =
			(value - this.initialRequiredMargin * quantity) /
			(quantity * this.contractSize * (1 + this.optionCommission));
		if (p === Infinity || isNaN(p)) return 0;

		return Math.abs(Math.ceil(p));
	}

	/**
	 * Calculate quantity based on price and value
	 * Quantity = Value / ( Price * ContractSize * ( 1 + Commission ) + InitialRequiredMargin )
	 * @param price number
	 * @param value number
	 * @returns number
	 */
	public static quantity(price: number, value: number): number {
		const q = value / (price * this.contractSize * (1 + this.optionCommission) + this.initialRequiredMargin);
		if (q === Infinity || isNaN(q)) return 0;

		return Math.abs(Math.floor(q));
	}

	/**
	 * Calculate value based on price and quantity
	 * Value = (Price × Quantity × ContractSize) + ( Price × Quantity × ContractSize × Commission ) + InitialRequiredMargin × Quantity
	 * @param price number
	 * @param quantity number
	 * @returns number
	 */
	public static value(price: number, quantity: number): number {
		const v =
			price * quantity * this.contractSize * (1 + this.optionCommission) + this.initialRequiredMargin * quantity;
		return Math.abs(Math.ceil(v));
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

	public static setInitialRequiredMargin(v: number) {
		this._initialRequiredMargin = v;
		return this;
	}

	public static tradeCommission(price: number, quantity: number): number {
		return Math.abs(Math.ceil(price * quantity * this.contractSize * this.commission));
	}

	public static netValue(price: number, quantity: number): number {
		const v = price * quantity * this.contractSize;
		return Math.abs(Math.ceil(v));
	}

	public static requiredMargin(quantity: number): number {
		return Math.abs(Math.ceil(this.initialRequiredMargin * quantity));
	}

	private static get commission(): number {
		const v = this._commission[this._side];

		if (this._side === 'sell') return -v;
		return v;
	}

	private static get optionCommission(): number {
		if (this._type === 'option' && this._side === 'sell') return 0;
		return this.commission;
	}

	private static get contractSize(): number {
		if (this._type === 'option') return this._contractSize;
		return 1;
	}

	private static get initialRequiredMargin(): number {
		if (this._side === 'sell' && this._type === 'option') return this._initialRequiredMargin;
		return 0;
	}
}

export default OFormula;
