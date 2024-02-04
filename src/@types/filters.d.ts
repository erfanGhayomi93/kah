interface IOptionWatchlistFilters {
	symbols: Option.Search[];
	type: Array<'Call' | 'Put'>;
	status: Array<'ITM' | 'OTM' | 'ATM'>;
	endDate: [number, number];
	delta: [number, number];
	minimumTradesValue: string;
}
