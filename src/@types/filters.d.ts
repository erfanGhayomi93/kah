interface IOptionWatchlistFilters {
	symbols: string[];
	type: 'buy' | 'sell' | null;
	status: 'itm' | 'otm' | 'atm' | null;
	endDate: [number | null, number | null];
	contractSize: [number, number];
	delta: [number, number];
	minimumTradesValue: number;
}
