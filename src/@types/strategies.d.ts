declare interface INextStrategyProps extends INextProps<{ id: Strategy.Type }> {}

type TStrategySymbolBasis = 'All' | 'BestLimit';

declare type TStrategyMarketTrend =
	| 'All'
	| Extract<Strategy.Cheap, 'BullishMarket' | 'BearishMarket' | 'NeutralMarket' | 'DirectionalMarket'>;

declare interface ISymbolStrategy {
	id: string;
	marketUnit: string;
	quantity: number;
	price: number;
}

declare interface IStrategyFilter {
	priceBasis: TPriceBasis;
	symbolBasis: TStrategySymbolBasis;
	pageNumber: number;
	pageSize: number;
}

declare interface IBaseSymbolStrategy extends ISymbolStrategy {
	type: 'base';
	side: TBsSides;
	symbol: {
		symbolTitle: string;
		symbolISIN: string;
		baseSymbolPrice: number;
		optionType?: null;
		historicalVolatility?: null;
	};
	tradeCommission?: {
		value: number;
		checked?: boolean;
	};
	contractSize?: undefined;
	settlementDay?: undefined;
	strikePrice?: undefined;
	requiredMargin?: undefined;
	strikeCommission?: undefined;
	tax?: undefined;
	vDefault?: undefined;
}

declare interface IOptionStrategy extends ISymbolStrategy {
	type: 'option';
	strikePrice: number;
	contractSize: number;
	settlementDay: Date | number | string;
	side: TBsSides;
	symbol: {
		symbolTitle: string;
		symbolISIN: string;
		optionType: TOptionSides;
		baseSymbolPrice: number;
		historicalVolatility: number;
	};
	requiredMargin?: {
		value: number;
		checked?: boolean;
	};
	tradeCommission?: {
		value: number;
		checked?: boolean;
	};
	strikeCommission?: {
		value: number;
		checked?: boolean;
	};
	tax?: {
		value: number;
		checked?: boolean;
	};
	vDefault?: {
		value: number;
		checked?: boolean;
	};
}

declare type TSymbolStrategy = IBaseSymbolStrategy | IOptionStrategy;

declare type TCoveredCallColumns =
	| 'baseSymbolTitle'
	| 'baseLastTradedPrice'
	| 'dueDays'
	| 'symbolTitle'
	| 'strikePrice'
	| 'openPositionCount'
	| 'tradePriceVarPreviousTradePercent'
	| 'optionBestBuyLimitPrice'
	| 'optionBestBuyLimitQuantity'
	| 'optionBestSellLimitPrice'
	| 'optionBestSellLimitQuantity'
	| 'coveredCallBEP'
	| 'maxProfitPercent'
	| 'nonExpiredProfitPercent'
	| 'inUseCapital'
	| 'ytm'
	| 'bestBuyYTM'
	| 'bestSellYTM'
	| 'nonExpiredYTM'
	| 'bepDifference'
	| 'riskCoverage'
	| 'tradeValue'
	| 'baseTradeValue'
	| 'baseTradeCount'
	| 'baseTradeVolume'
	| 'baseLastTradedDate'
	| 'action';

declare type TBullCallSpreadColumns =
	| 'baseSymbolTitle'
	| 'baseTradePriceVarPreviousTradePercent'
	| 'dueDays'
	| 'lspSymbolTitle'
	| 'lspStrikePrice'
	| 'lspBestSellLimitPrice'
	| 'lspBestSellLimitQuantity'
	| 'lspBestBuyLimitPrice'
	| 'lspBestBuyLimitQuantity'
	| 'hspSymbolTitle'
	| 'hspStrikePrice'
	| 'hspBestBuyLimitPrice'
	| 'hspBestBuyLimitQuantity'
	| 'hspBestSellLimitPrice'
	| 'hspBestSellLimitQuantity'
	| 'lspOpenPositionCount'
	| 'hspOpenPositionCount'
	| 'lspPremiumPercent'
	| 'hspPremiumPercent'
	| 'bullCallSpreadBEP'
	| 'maxProfitPercent'
	| 'maxLoss'
	| 'inUseCapital'
	| 'lspTimeValue'
	| 'hspTimeValue'
	| 'lspIntrinsicValue'
	| 'hspIntrinsicValue'
	| 'lspTradeValue'
	| 'hspTradeValue'
	| 'baseTradeValue'
	| 'baseTradeCount'
	| 'baseTradeVolume'
	| 'baseLastTradedDate'
	| 'ytm'
	| 'actions';

declare type TLongCallColumns =
	| 'baseSymbolTitle'
	| 'baseTradePriceVarPreviousTradePercent'
	| 'dueDays'
	| 'symbolTitle'
	| 'strikePrice'
	| 'openPositionCount'
	| 'tradePriceVarPreviousTradePercent'
	| 'optionBestBuyLimitPrice'
	| 'optionBestBuyLimitQuantity'
	| 'optionBestSellLimitPrice'
	| 'optionBestSellLimitQuantity'
	| 'longCallBEP'
	| 'profitPercent'
	| 'blackScholes'
	| 'timeValue'
	| 'intrinsicValue'
	| 'profit'
	| 'bepDifference'
	| 'tradeValue'
	| 'baseTradeValue'
	| 'baseTradeCount'
	| 'baseTradeVolume'
	| 'baseLastTradedDate'
	| 'actions';

declare type TLongPutColumns =
	| 'baseSymbolTitle'
	| 'baseTradePriceVarPreviousTradePercent'
	| 'dueDays'
	| 'symbolTitle'
	| 'strikePrice'
	| 'openPositionCount'
	| 'tradePriceVarPreviousTradePercent'
	| 'optionBestLimitPrice'
	| 'optionBestLimitVolume'
	| 'optionBestSellLimitPrice'
	| 'optionBestSellLimitQuantity'
	| 'longPutBEP'
	| 'profitPercent'
	| 'blackScholes'
	| 'timeValue'
	| 'intrinsicValue'
	| 'profit'
	| 'bepDifference'
	| 'tradeValue'
	| 'baseTradeValue'
	| 'baseTradeCount'
	| 'baseTradeVolume'
	| 'baseLastTradedDate'
	| 'actions';

declare type TConversionColumns =
	| 'baseSymbolTitle'
	| 'baseTradePriceVarPreviousTradePercent'
	| 'dueDays'
	| 'strikePrice'
	| 'callPremiumPercent'
	| 'putPremiumPercent'
	| 'callSymbolTitle'
	| 'callBestBuyLimitPrice'
	| 'callBestBuyLimitQuantity'
	| 'callOpenPositionCount'
	| 'callBestSellLimitPrice'
	| 'callBestSellLimitQuantity'
	| 'putSymbolTitle'
	| 'putBestSellLimitPrice'
	| 'putBestSellLimitQuantity'
	| 'putOpenPositionCount'
	| 'putBestBuyLimitPrice'
	| 'putBestBuyLimitQuantity'
	| 'profit'
	| 'inUseCapital'
	| 'bestBuyYTM'
	| 'bestSellYTM'
	| 'callTradeValue'
	| 'putTradeValue'
	| 'baseTradeValue'
	| 'baseTradeCount'
	| 'baseTradeVolume'
	| 'baseLastTradedDate'
	| 'actions';

declare type TLongStraddleColumns =
	| 'baseSymbolTitle'
	| 'baseTradePriceVarPreviousTradePercent'
	| 'dueDays'
	| 'strikePrice'
	| 'callSymbolTitle'
	| 'callBestSellLimitPrice'
	| 'callBestSellLimitQuantity'
	| 'putSymbolTitle'
	| 'putBestSellLimitPrice'
	| 'putBestSellLimitQuantity'
	| 'callBestBuyLimitPrice'
	| 'callBestBuyLimitQuantity'
	| 'putBestBuyLimitPrice'
	| 'putBestBuyLimitQuantity'
	| 'callOpenPositionCount'
	| 'putOpenPositionCount'
	| 'callPremiumPercent'
	| 'putPremiumPercent'
	| 'highBEP'
	| 'lowBEP'
	| 'maxLoss'
	| 'inUseCapital'
	| 'callTimeValue'
	| 'putTimeValue'
	| 'callIntrinsicValue'
	| 'putIntrinsicValue'
	| 'callBestSellLimitPrice'
	| 'callBestSellLimitQuantity'
	| 'putBestSellLimitPrice'
	| 'putBestSellLimitQuantity'
	| 'callTradeValue'
	| 'putTradeValue'
	| 'baseTradeValue'
	| 'baseTradeCount'
	| 'baseTradeVolume'
	| 'baseLastTradedDate'
	| 'actions';

declare type TProtectivePutColumns =
	| 'baseSymbolTitle'
	| 'baseTradePriceVarPreviousTradePercent'
	| 'dueDays'
	| 'symbolTitle'
	| 'strikePrice'
	| 'openPositionCount'
	| 'tradePriceVarPreviousTradePercent'
	| 'optionBestSellLimitPrice'
	| 'optionBestSellLimitQuantity'
	| 'optionBestBuyLimitPrice'
	| 'optionBestBuyLimitQuantity'
	| 'protectivePutBEP'
	| 'maxLossPercent'
	| 'profit'
	| 'profitPercent'
	| 'inUseCapital'
	| 'blackScholes'
	| 'timeValue'
	| 'intrinsicValue'
	| 'bepDifference'
	| 'tradeValue'
	| 'baseTradeValue'
	| 'baseTradeCount'
	| 'baseTradeVolume'
	| 'baseLastTradedDate'
	| 'actions';

declare type TBearPutSpreadColumns =
	| 'baseSymbolTitle'
	| 'baseTradePriceVarPreviousTradePercent'
	| 'dueDays'
	| 'hspSymbolTitle'
	| 'hspStrikePrice'
	| 'hspBestSellLimitPrice'
	| 'hspBestSellLimitQuantity'
	| 'hspBestBuyLimitPrice'
	| 'hspBestBuyLimitQuantity'
	| 'lspSymbolTitle'
	| 'lspStrikePrice'
	| 'lspBestBuyLimitPrice'
	| 'lspBestBuyLimitQuantity'
	| 'lspBestSellLimitPrice'
	| 'lspBestSellLimitQuantity'
	| 'hspOpenPositionCount'
	| 'lspOpenPositionCount'
	| 'hspPremiumPercent'
	| 'lspPremiumPercent'
	| 'bullCallSpreadBEP'
	| 'maxProfitPercent'
	| 'maxLoss'
	| 'inUseCapital'
	| 'lspTimeValue'
	| 'hspTimeValue'
	| 'hspIntrinsicValue'
	| 'lspIntrinsicValue'
	| 'hspTradeValue'
	| 'lspTradeValue'
	| 'baseTradeValue'
	| 'baseTradeCount'
	| 'baseTradeVolume'
	| 'baseLastTradedDate'
	| 'ytm'
	| 'actions';

namespace CreateStrategy {
	export type Status = 'TODO' | 'PENDING' | 'DONE' | 'ERROR';

	export type TStep = 'option' | 'base';

	export interface IBaseSymbol {
		id: string;
		type: 'base';
		symbolTitle: string;
		symbolISIN: string;
		quantity: number;
		estimatedBudget: number;
		buyAssetsBySymbol: boolean;
		orderPrice: number;
		orderQuantity: number;
		bestLimitPrice: number;
		status: Status;
	}

	export interface IOption {
		id: string;
		type: 'option';
		side: TBsSides;
		optionType: TOptionSides;
		estimatedBudget: number;
		symbolTitle: string;
		symbolISIN: string;
		status: Status;
		bestSellLimitPrice: number;
		bestBuyLimitPrice: number;
		baseSymbol: {
			symbolTitle: string;
			symbolISIN: string;
		};
	}

	export interface IFreeze {
		id: string;
		type: 'freeze';
		estimatedBudget: number;
		status: Status;
		baseSymbol: {
			symbolTitle: string;
			symbolISIN: string;
		};
	}

	export type Step = CreateStrategy.IBaseSymbol | CreateStrategy.IOption | IFreeze;
}

interface ICoveredCallFiltersModalStates {
	baseSymbols: Option.BaseSearch[];
	iotm: Option.IOTM[];
	dueDays: [null | number, null | number];
	bepDifference: [null | number, null | number];
	openPosition: null | number;
	maxProfit: null | number;
	nonExpiredProfit: null | number;
	ytm: null | number;
}

interface ILongStraddleFiltersModalStates {
	baseSymbols: Option.BaseSearch[];
	callIOTM: Option.IOTM[];
	putIOTM: Option.IOTM[];
	dueDays: [null | number, null | number];
	callOpenPosition: number;
	putOpenPosition: number;
}

interface ILongCallFiltersModalState {
	baseSymbols: Option.BaseSearch[];
	iotm: Option.IOTM[];
	dueDays: [null | number, null | number];
	openPosition: null | number;
	bepDifference: null | number;
}

interface ILongPutFiltersModalState {
	baseSymbols: Option.BaseSearch[];
	iotm: Option.IOTM[];
	dueDays: [null | number, null | number];
	openPosition: null | number;
	bepDifference: null | number;
}

interface IProtectivePutFiltersModalState {
	baseSymbols: Option.BaseSearch[];
	iotm: Option.IOTM[];
	dueDays: [null | number, null | number];
	openPosition: null | number;
	maxLoss: null | number;
	bepDifference: null | number;
}

interface IBullCallSpreadFiltersModalState {
	baseSymbols: Option.BaseSearch[];
	HSPIOTM: Option.IOTM[];
	LSPIOTM: Option.IOTM[];
	dueDays: [null | number, null | number];
	HSPLeastOpenPositions: null | number;
	LSPLeastOpenPositions: null | number;
	leastMaxProfitPercent: null | number;
	leastYTM: null | number;
}

interface IConversionFiltersModalState {
	baseSymbols: Option.BaseSearch[];
	callIOTM: Option.IOTM[];
	putIOTM: Option.IOTM[];
	dueDays: [null | number, null | number];
	callLeastOpenPositions: null | number;
	putLeastOpenPositions: null | number;
	leastProfitPercent: null | number;
	leastYTM: null | number;
}

interface IBearPutSpreadSpreadFiltersModalState {
	baseSymbols: Option.BaseSearch[];
	HSPIOTM: Option.IOTM[];
	LSPIOTM: Option.IOTM[];
	dueDays: [null | number, null | number];
	HSPLeastOpenPositions: null | number;
	LSPLeastOpenPositions: null | number;
	leastMaxProfitPercent: null | number;
	leastYTM: null | number;
}
