interface IOptionWatchlistFilters {
	symbols: Option.SymbolSearch[];
	type: Array<'Call' | 'Put'>;
	status: Array<'ITM' | 'OTM' | 'ATM'>;
	endDate: [number | null, number | null];
	contractSize: [string, string];
	delta: [string, string];
	minimumTradesValue: string;
}
