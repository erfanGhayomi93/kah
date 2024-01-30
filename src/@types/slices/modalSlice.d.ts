export interface IOptionFiltersModal {
	initialSymbols?: Option.Search[];
	initialType?: Array<'Call' | 'Put'>;
	initialStatus?: Array<'ITM' | 'OTM' | 'ATM'>;
	initialEndDate?: [number | null, number | null];
	initialContractSize?: [string, string];
	initialDelta?: [string, string];
	initialMinimumTradesValue?: string;
}
