export interface IOptionFiltersModal {
	initialSymbols?: string[];
	initialType?: Array<'Call' | 'Put'>;
	initialStatus?: Array<'ITM' | 'OTM' | 'ATM'>;
	initialEndDate?: [number | null, number | null];
	initialContractSize?: [number, number];
	initialDelta?: [number, number];
	initialMinimumTradesValue?: number;
}
