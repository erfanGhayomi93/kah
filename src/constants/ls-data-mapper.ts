export const optionWatchlistLightstreamProperty: Record<string, keyof (Option.Watchlist & Option.SymbolInfo)> = {
	bestBuyLimitPrice_1: 'bestBuyPrice',
	bestSellLimitPrice_1: 'bestSellPrice',
	totalTradeValue: 'tradeValue',
	totalNumberOfSharesTraded: 'tradeVolume',
	lastTradedPrice: 'premium',
	totalNumberOfTrades: 'tradeCount',
	closingPrice: 'closingPrice',
	closingPriceVarPercent: 'closingPriceVarReferencePricePercent',
	lastTradeDateTime: 'lastTradeDate',
	lastTradedPriceVarPercent: 'tradePriceVarPreviousTradePercent',
};

export const symbolInfoPanelLightstreamProperty: Record<string, keyof Symbol.Info> = {
	totalTradeValue: 'tradeValue',
	totalNumberOfSharesTraded: 'tradeVolume',
	closingPriceVarReferencePrice: 'closingPriceVarReferencePrice',
	baseVolume: 'baseVolume',
	lastTradedPrice: 'lastTradedPrice',
	totalNumberOfTrades: 'tradeCount',
	lastTradedPriceVarPercent: 'tradePriceVarPreviousTradePercent',
	closingPrice: 'closingPrice',
	closingPriceVarPercent: 'closingPriceVarReferencePricePercent',
	lastTradeDateTime: 'lastTradeDate',
	lowestTradePriceOfTradingDay: 'lowPrice',
	highestTradePriceOfTradingDay: 'highPrice',
	symbolState: 'symbolTradeState',
};
