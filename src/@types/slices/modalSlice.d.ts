export interface IOptionFiltersModal {
	initialSymbols?: Option.Search[];
	initialType?: Array<'Call' | 'Put'>;
	initialStatus?: Array<'ITM' | 'OTM' | 'ATM'>;
	initialEndDate?: [number, number];
	initialDelta?: [number, number];
	initialMinimumTradesValue?: string;
}
