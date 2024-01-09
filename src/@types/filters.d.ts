interface IOptionWatchlistFilters {
	symbols: string[];
	type: Array<'buy' | 'sell'>;
	status: Array<'itm' | 'otm' | 'atm'>;
	endDate: [number | null, number | null];
	contractSize: [number, number];
	delta: [number, number];
	minimumTradesValue: number;
}
