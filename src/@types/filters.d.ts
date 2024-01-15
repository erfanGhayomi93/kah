interface IOptionWatchlistFilters {
	symbols: string[];
	type: Array<'Call' | 'Put'>;
	status: Array<'ITM' | 'OTM' | 'ATM'>;
	endDate: [number | null, number | null];
	contractSize: [number, number];
	delta: [number, number];
	minimumTradesValue: number;
}
