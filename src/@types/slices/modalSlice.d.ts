export interface IOptionFiltersModal {
	initialSymbols?: Option.SymbolSearch[];
	initialType?: Array<'Call' | 'Put'>;
	initialStatus?: Array<'ITM' | 'OTM' | 'ATM'>;
	initialEndDate?: [number | null, number | null];
	initialContractSize?: [number, number];
	initialDelta?: [string, string];
	initialMinimumTradesValue?: number;
}
