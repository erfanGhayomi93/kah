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
	strikePrice?: null;
	contractSize?: null;
	settlementDay?: null;
	commission?: null;
	requiredMargin?: null;
}

declare interface IStrategyFilter {
	priceBasis: TPriceBasis;
	symbolBasis: TStrategySymbolBasis;
	pageNumber: number;
	pageSize: number;
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
	commission?: {
		value: number;
		checked?: boolean;
		onChecked?: (checked: boolean) => void;
	};
	requiredMargin?: {
		value: number;
		checked?: boolean;
		onChecked?: (checked: boolean) => void;
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
	| 'optionBestLimitPrice'
	| 'optionBestLimitVolume'
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
	| 'maxLoss'
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

	export type Input = CreateStrategy.IBaseSymbol | CreateStrategy.IOption | IFreeze;
}

interface ICoveredCallFiltersModalStates {
	side: TBsSides[];
	iotm: Option.IOTM[];
	dueDays: [null | number, null | number];
	openPositions: [null | number, null | number];
	maxProfit: null | number;
	nonExpiredProfit: null | number;
	bepDifference: null | number;
}
