export interface IOptionFiltersModal {
	initialSymbols?: Option.BaseSearch[];
	initialType?: Array<'Call' | 'Put'>;
	initialStatus?: Array<'ITM' | 'OTM' | 'ATM'>;
	initialDueDays?: [number, number];
	initialDelta?: [number, number];
	initialMinimumTradesValue?: string;
}
