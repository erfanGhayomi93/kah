export const optionWatchlistLightstreamProperty: Record<string, keyof (Option.Watchlist & Option.SymbolInfo)> = {
	bestBuyLimitPrice_1: 'bestBuyPrice',
	bestSellLimitPrice_1: 'bestSellPrice',
};

export const baseSymbolWatchlistLightstreamProperty: Record<string, keyof (Option.Watchlist & Option.SymbolInfo)> = {
	lastTradedPriceVarPercent: 'baseTradePriceVarPreviousTradePercent',
	closingPriceVarPercent: 'baseClosingPriceVarReferencePricePercent',
	lastTradedPrice: 'baseSymbolPrice',
	closingPrice: 'baseClosingPrice',
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
