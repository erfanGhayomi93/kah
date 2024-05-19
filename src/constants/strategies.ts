// ? CoveredCall
export const initialHiddenColumnsCoveredCall: Record<TCoveredCallColumns, boolean> = {
	baseSymbolTitle: false,
	baseLastTradedPrice: false,
	dueDays: false,
	symbolTitle: false,
	strikePrice: false,
	openPositionCount: false,
	tradePriceVarPreviousTradePercent: true,
	optionBestBuyLimitPrice: false,
	optionBestBuyLimitQuantity: false,
	optionBestSellLimitPrice: true,
	optionBestSellLimitQuantity: true,
	coveredCallBEP: false,
	maxProfitPercent: false,
	nonExpiredProfitPercent: false,
	inUseCapital: false,
	bestBuyYTM: true,
	bestSellYTM: true,
	nonExpiredYTM: true,
	bepDifference: true,
	riskCoverage: false,
	tradeValue: true,
	baseTradeValue: true,
	baseTradeCount: true,
	baseTradeVolume: true,
	baseLastTradedDate: true,
	action: false,
};

export const initialColumnsCoveredCall: Array<IManageColumn<TCoveredCallColumns>> = [
	{
		id: 'baseSymbolTitle',
		title: 'نماد پایه',
		hidden: initialHiddenColumnsCoveredCall.baseSymbolTitle,
	},
	{
		id: 'baseLastTradedPrice',
		title: 'قیمت پایه',
		hidden: initialHiddenColumnsCoveredCall.baseLastTradedPrice,
	},
	{
		id: 'dueDays',
		title: 'مانده تا سررسید',
		hidden: initialHiddenColumnsCoveredCall.dueDays,
	},
	{
		id: 'symbolTitle',
		title: 'کال',
		hidden: initialHiddenColumnsCoveredCall.symbolTitle,
	},
	{
		id: 'strikePrice',
		title: 'قیمت اعمال',
		hidden: initialHiddenColumnsCoveredCall.strikePrice,
	},
	{
		id: 'openPositionCount',
		title: 'موقعیت باز',
		hidden: initialHiddenColumnsCoveredCall.openPositionCount,
	},
	{
		id: 'optionBestBuyLimitPrice',
		title: 'بهترین خریدار',
		hidden: initialHiddenColumnsCoveredCall.optionBestBuyLimitPrice,
	},
	{
		id: 'optionBestBuyLimitQuantity',
		title: 'حجم سرخط خرید',
		hidden: initialHiddenColumnsCoveredCall.optionBestBuyLimitQuantity,
	},
	{
		id: 'optionBestSellLimitPrice',
		title: 'بهترین فروشنده',
		hidden: initialHiddenColumnsCoveredCall.optionBestSellLimitPrice,
	},
	{
		id: 'optionBestSellLimitQuantity',
		title: 'حجم سر خط فروش',
		hidden: initialHiddenColumnsCoveredCall.optionBestSellLimitQuantity,
	},
	{
		id: 'coveredCallBEP',
		title: 'سر به سر',
		hidden: initialHiddenColumnsCoveredCall.coveredCallBEP,
	},
	{
		id: 'maxProfitPercent',
		title: 'حداکثر بازده',
		hidden: initialHiddenColumnsCoveredCall.maxProfitPercent,
	},
	{
		id: 'nonExpiredProfitPercent',
		title: 'بازده عدم اعمال',
		hidden: initialHiddenColumnsCoveredCall.nonExpiredProfitPercent,
	},
	{
		id: 'inUseCapital',
		title: 'سرمایه درگیر',
		hidden: initialHiddenColumnsCoveredCall.inUseCapital,
	},
	{
		id: 'tradePriceVarPreviousTradePercent',
		title: 'قیمت نماد آپشن',
		hidden: initialHiddenColumnsCoveredCall.tradePriceVarPreviousTradePercent,
	},
	{
		id: 'bepDifference',
		title: 'اختلاف تا سر به سر',
		hidden: initialHiddenColumnsCoveredCall.bepDifference,
	},
	{
		id: 'tradeValue',
		title: 'ارزش معاملات آپشن',
		hidden: initialHiddenColumnsCoveredCall.tradeValue,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: initialHiddenColumnsCoveredCall.baseTradeValue,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: initialHiddenColumnsCoveredCall.baseTradeCount,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: initialHiddenColumnsCoveredCall.baseTradeVolume,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: initialHiddenColumnsCoveredCall.baseLastTradedDate,
	},
	{
		id: 'bestBuyYTM',
		title: 'YTM سرخط خرید',
		hidden: initialHiddenColumnsCoveredCall.bestBuyYTM,
	},
	{
		id: 'bestSellYTM',
		title: 'YTM سرخط فروش',
		hidden: initialHiddenColumnsCoveredCall.bestSellYTM,
	},
	{
		id: 'riskCoverage',
		title: 'پوشش ریسک',
		hidden: initialHiddenColumnsCoveredCall.riskCoverage,
	},
	{
		id: 'nonExpiredYTM',
		title: 'YTM عدم اعمال',
		hidden: initialHiddenColumnsCoveredCall.nonExpiredYTM,
	},
];

// ? BullCallSpread
export const initialColumnsBullCallSpread: Array<IManageColumn<TBullCallSpreadColumns>> = [
	{
		id: 'baseSymbolTitle',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseTradePriceVarPreviousTradePercent',
		title: 'قیمت پایه',
		hidden: false,
	},
	{
		id: 'dueDays',
		title: 'مانده تا سررسید',
		hidden: false,
	},
	{
		id: 'lspSymbolTitle',
		title: 'کال خرید',
		hidden: false,
	},
	{
		id: 'lspStrikePrice',
		title: 'قیمت اعمال کال خرید',
		hidden: false,
	},
	{
		id: 'lspBestSellLimitPrice',
		title: 'قیمت فروشنده کال خرید',
		hidden: false,
	},
	{
		id: 'lspBestSellLimitQuantity',
		title: 'حجم فروشنده کال خرید',
		hidden: false,
	},
	{
		id: 'lspBestBuyLimitPrice',
		title: 'قیمت خریدار کال خرید',
		hidden: false,
	},
	{
		id: 'lspBestBuyLimitQuantity',
		title: 'حجم خریدار کال خرید',
		hidden: false,
	},
	{
		id: 'hspSymbolISIN',
		title: 'کال فروش',
		hidden: false,
	},
	{
		id: 'hspStrikePrice',
		title: 'قیمت اعمال کال فروش',
		hidden: false,
	},
	{
		id: 'hspBestBuyLimitPrice',
		title: 'قیمت خریدار کال فروش',
		hidden: false,
	},
	{
		id: 'hspBestBuyLimitQuantity',
		title: 'حجم خریدار کال فروش',
		hidden: false,
	},
	{
		id: 'hspBestSellLimitPrice',
		title: 'بهترین فروشنده کال فروش',
		hidden: false,
	},
	{
		id: 'hspBestSellLimitQuantity',
		title: 'حجم سر خط فروش کال فروش',
		hidden: false,
	},
	{
		id: 'lspOpenPositionCount',
		title: 'موقعیت باز کال خرید',
		hidden: false,
	},
	{
		id: 'hspOpenPositionCount',
		title: 'موقعیت باز کال فروش',
		hidden: false,
	},
	{
		id: 'lspPremiumPercent',
		title: 'قیمت نماد کال خرید',
		hidden: false,
	},
	{
		id: 'hspPremiumPercent',
		title: 'قیمت نماد کال فروش',
		hidden: false,
	},
	{
		id: 'bullCallSpreadBEP',
		title: 'سر به سر',
		hidden: false,
	},
	{
		id: 'maxProfitPercent',
		title: 'حداکثر بازده',
		hidden: false,
	},
	{
		id: 'maxLoss',
		title: 'حداکثر زیان',
		hidden: false,
	},
	{
		id: 'inUseCapital',
		title: 'سرمایه درگیر',
		hidden: false,
	},
	{
		id: 'lspTimeValue',
		title: 'ارزش زمانی کال خرید',
		hidden: false,
	},
	{
		id: 'hspTimeValue',
		title: 'ارزش زمانی کال فروش',
		hidden: false,
	},
	{
		id: 'lspIntrinsicValue',
		title: 'ارزش ذاتی کال خرید',
		hidden: false,
	},
	{
		id: 'hspIntrinsicValue',
		title: 'ارزش ذاتی کال فروش',
		hidden: false,
	},
	{
		id: 'lspTradeValue',
		title: 'ارزش معاملات آپشن کال خرید',
		hidden: false,
	},
	{
		id: 'hspTradeValue',
		title: 'ارزش معاملات آپشن کال فروش',
		hidden: false,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: false,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: false,
	},
	{
		id: 'ytm',
		title: 'YTM',
		hidden: false,
	},
];

// ? LongCall
export const initialColumnsLongCall: Array<IManageColumn<TLongCallColumns>> = [
	{
		id: 'baseSymbolTitle',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseTradePriceVarPreviousTradePercent',
		title: 'قیمت پایه',
		hidden: false,
	},
	{
		id: 'dueDays',
		title: 'مانده تا سررسید',
		hidden: false,
	},
	{
		id: 'symbolTitle',
		title: 'کال',
		hidden: false,
	},
	{
		id: 'strikePrice',
		title: 'قیمت اعمال',
		hidden: false,
	},
	{
		id: 'openPositionCount',
		title: 'موقعیت باز',
		hidden: false,
	},
	{
		id: 'tradePriceVarPreviousTradePercent',
		title: 'قیمت نماد آپشن',
		hidden: false,
	},
	{
		id: 'optionBestLimitPrice',
		title: 'بهترین خریدار',
		hidden: false,
	},
	{
		id: 'optionBestLimitVolume',
		title: 'حجم سرخط خرید',
		hidden: false,
	},
	{
		id: 'optionBestSellLimitPrice',
		title: 'بهترین فروشنده',
		hidden: false,
	},
	{
		id: 'optionBestSellLimitQuantity',
		title: 'حجم سرخط فروش',
		hidden: false,
	},
	{
		id: 'longCallBEP',
		title: 'سر به سر',
		hidden: false,
	},
	{
		id: 'profitPercent',
		title: 'حداکثر بازده',
		hidden: false,
	},
	{
		id: 'blackScholes',
		title: 'بلک شولز',
		hidden: false,
	},
	{
		id: 'timeValue',
		title: 'ارزش زمانی',
		hidden: false,
	},
	{
		id: 'intrinsicValue',
		title: 'ارزش ذاتی',
		hidden: false,
	},
	{
		id: 'profit',
		title: 'بازده',
		hidden: false,
	},
	{
		id: 'bepDifference',
		title: 'اختلاف تا سر به سر',
		hidden: false,
	},
	{
		id: 'tradeValue',
		title: 'ارزش معاملات آپشن',
		hidden: false,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: false,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: false,
	},
];

// ? LongPut
export const initialColumnsLongPut: Array<IManageColumn<TLongPutColumns>> = [
	{
		id: 'baseSymbolTitle',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseTradePriceVarPreviousTradePercent',
		title: 'قیمت پایه',
		hidden: false,
	},
	{
		id: 'dueDays',
		title: 'مانده تا سررسید',
		hidden: false,
	},
	{
		id: 'symbolTitle',
		title: 'کال',
		hidden: false,
	},
	{
		id: 'strikePrice',
		title: 'قیمت اعمال',
		hidden: false,
	},
	{
		id: 'openPositionCount',
		title: 'موقعیت باز',
		hidden: false,
	},
	{
		id: 'tradePriceVarPreviousTradePercent',
		title: 'قیمت نماد آپشن',
		hidden: false,
	},
	{
		id: 'optionBestLimitPrice',
		title: 'بهترین خریدار',
		hidden: false,
	},
	{
		id: 'optionBestLimitVolume',
		title: 'حجم سرخط خرید',
		hidden: false,
	},
	{
		id: 'optionBestSellLimitPrice',
		title: 'بهترین فروشنده',
		hidden: false,
	},
	{
		id: 'optionBestSellLimitQuantity',
		title: 'حجم سرخط فروش',
		hidden: false,
	},
	{
		id: 'longPutBEP',
		title: 'سر به سر',
		hidden: false,
	},
	{
		id: 'profitPercent',
		title: 'حداکثر بازده',
		hidden: false,
	},
	{
		id: 'blackScholes',
		title: 'بلک شولز',
		hidden: false,
	},
	{
		id: 'timeValue',
		title: 'ارزش زمانی',
		hidden: false,
	},
	{
		id: 'intrinsicValue',
		title: 'ارزش ذاتی',
		hidden: false,
	},
	{
		id: 'profit',
		title: 'بازده',
		hidden: false,
	},
	{
		id: 'bepDifference',
		title: 'اختلاف تا سر به سر',
		hidden: false,
	},
	{
		id: 'tradeValue',
		title: 'ارزش معاملات آپشن',
		hidden: false,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: false,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: false,
	},
];

// ? Conversion
export const initialColumnsConversion: Array<IManageColumn<TConversionColumns>> = [
	{
		id: 'baseSymbolTitle',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseTradePriceVarPreviousTradePercent',
		title: 'قیمت پایه',
		hidden: false,
	},
	{
		id: 'dueDays',
		title: 'مانده تا سررسید',
		hidden: false,
	},
	{
		id: 'strikePrice',
		title: 'قیمت اعمال',
		hidden: false,
	},
	{
		id: 'callPremiumPercent',
		title: 'قیمت نماد کال',
		hidden: false,
	},
	{
		id: 'putPremiumPercent',
		title: 'قیمت نماد پوت',
		hidden: false,
	},
	{
		id: 'callSymbolTitle',
		title: 'کال',
		hidden: false,
	},
	{
		id: 'callBestBuyLimitPrice',
		title: 'بهترین خریدار کال',
		hidden: false,
	},
	{
		id: 'callBestBuyLimitQuantity',
		title: 'حجم سر خط خرید کال',
		hidden: false,
	},
	{
		id: 'callOpenPositionCount',
		title: 'موقعیت باز کال',
		hidden: false,
	},
	{
		id: 'callBestSellLimitPrice',
		title: 'بهترین فروشنده کال',
		hidden: false,
	},
	{
		id: 'callBestSellLimitQuantity',
		title: 'حجم سر خط فروش کال',
		hidden: false,
	},
	{
		id: 'putSymbolTitle',
		title: 'پوت',
		hidden: false,
	},
	{
		id: 'putBestSellLimitPrice',
		title: 'بهترین فروشنده پوت',
		hidden: false,
	},
	{
		id: 'putBestSellLimitQuantity',
		title: 'حجم سر خط فروش پوت',
		hidden: false,
	},
	{
		id: 'putOpenPositionCount',
		title: 'موقعیت باز پوت',
		hidden: false,
	},
	{
		id: 'putBestBuyLimitPrice',
		title: 'بهترین خریدار پوت',
		hidden: false,
	},
	{
		id: 'putBestBuyLimitQuantity',
		title: 'حجم سر خط خرید پوت',
		hidden: false,
	},
	{
		id: 'profit',
		title: 'بازده',
		hidden: false,
	},
	{
		id: 'inUseCapital',
		title: 'سرمایه درگیر',
		hidden: false,
	},
	{
		id: 'bestBuyYTM',
		title: 'YTM سرخط خرید',
		hidden: false,
	},
	{
		id: 'bestSellYTM',
		title: 'YTM سرخط فروش',
		hidden: false,
	},
	{
		id: 'callTradeValue',
		title: 'ارزش معاملات کال',
		hidden: false,
	},
	{
		id: 'putTradeValue',
		title: 'ارزش معاملات پوت',
		hidden: false,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: false,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: false,
	},
];

// ? LongStraddle
export const initialColumnsLongStraddle: Array<IManageColumn<TLongStraddleColumns>> = [
	{
		id: 'baseSymbolTitle',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseTradePriceVarPreviousTradePercent',
		title: 'قیمت پایه',
		hidden: false,
	},
	{
		id: 'dueDays',
		title: 'مانده تا سررسید',
		hidden: false,
	},
	{
		id: 'strikePrice',
		title: 'قیمت اعمال',
		hidden: false,
	},
	{
		id: 'callSymbolTitle',
		title: 'کال',
		hidden: false,
	},
	{
		id: 'callBestSellLimitPrice',
		title: 'قیمت فروشنده کال',
		hidden: false,
	},
	{
		id: 'callBestSellLimitQuantity',
		title: 'حجم فروشنده کال',
		hidden: false,
	},
	{
		id: 'putSymbolTitle',
		title: 'پوت',
		hidden: false,
	},
	{
		id: 'putBestSellLimitPrice',
		title: 'قیمت فروشنده پوت',
		hidden: false,
	},
	{
		id: 'putBestSellLimitQuantity',
		title: 'حجم فروشنده پوت',
		hidden: false,
	},
	{
		id: 'callOpenPositionCount',
		title: 'موقعیت باز کال',
		hidden: false,
	},
	{
		id: 'putOpenPositionCount',
		title: 'موقعیت باز پوت',
		hidden: false,
	},
	{
		id: 'callPremiumPercent',
		title: 'قیمت نماد کال',
		hidden: false,
	},
	{
		id: 'putPremiumPercent',
		title: 'قیمت نماد پوت',
		hidden: false,
	},
	{
		id: 'highBEP',
		title: 'سر به سر بالا',
		hidden: false,
	},
	{
		id: 'lowBEP',
		title: 'سر به سر پایین',
		hidden: false,
	},
	{
		id: 'maxLoss',
		title: 'حداکثر زیان زیان',
		hidden: false,
	},
	{
		id: 'inUseCapital',
		title: 'سرمایه درگیر',
		hidden: false,
	},
	{
		id: 'callTimeValue',
		title: 'ارزش زمانی کال',
		hidden: false,
	},
	{
		id: 'putTimeValue',
		title: 'ارزش زمانی پوت',
		hidden: false,
	},
	{
		id: 'callIntrinsicValue',
		title: 'ارزش ذاتی کال',
		hidden: false,
	},
	{
		id: 'putIntrinsicValue',
		title: 'ارزش ذاتی پوت',
		hidden: false,
	},
	{
		id: 'callBestSellLimitPrice',
		title: 'بهترین خریدار کال',
		hidden: false,
	},
	{
		id: 'callBestSellLimitQuantity',
		title: 'حجم سر خط خرید کال',
		hidden: false,
	},
	{
		id: 'putBestSellLimitPrice',
		title: 'بهترین خریدار پوت',
		hidden: false,
	},
	{
		id: 'putBestSellLimitQuantity',
		title: 'حجم سر خط خرید پوت',
		hidden: false,
	},
	{
		id: 'callTradeValue',
		title: 'ارزش معاملات کال',
		hidden: false,
	},
	{
		id: 'putTradeValue',
		title: 'ارزش معاملات پوت',
		hidden: false,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: false,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: false,
	},
];

// ? ProtectivePut
export const initialColumnsProtectivePut: Array<IManageColumn<TProtectivePutColumns>> = [
	{
		id: 'symbolTitle',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseTradePriceVarPreviousTradePercent',
		title: 'قیمت پایه',
		hidden: false,
	},
	{
		id: 'dueDays',
		title: 'مانده تا سررسید',
		hidden: false,
	},
	{
		id: 'symbolTitle',
		title: 'کال خرید',
		hidden: false,
	},
	{
		id: 'strikePrice',
		title: 'قیمت اعمال',
		hidden: false,
	},
	{
		id: 'openPositionCount',
		title: 'موقعیت باز',
		hidden: false,
	},
	{
		id: 'tradePriceVarPreviousTradePercent',
		title: 'قیمت نماد آپشن',
		hidden: false,
	},
	{
		id: 'optionBestSellLimitPrice',
		title: 'بهترین فروشنده',
		hidden: false,
	},
	{
		id: 'optionBestSellLimitQuantity',
		title: 'حجم سرخط فروش',
		hidden: false,
	},
	{
		id: 'optionBestBuyLimitPrice',
		title: 'بهترین خریدار',
		hidden: false,
	},
	{
		id: 'optionBestBuyLimitQuantity',
		title: 'حجم سرخط خرید',
		hidden: false,
	},
	{
		id: 'protectivePutBEP',
		title: 'سر به سر',
		hidden: false,
	},
	{
		id: 'maxLoss',
		title: 'حداکثر زیان',
		hidden: false,
	},
	{
		id: 'profit',
		title: 'بازده',
		hidden: false,
	},
	{
		id: 'profitPercent',
		title: 'درصد بازده تا سررسید',
		hidden: false,
	},
	{
		id: 'inUseCapital',
		title: 'سرمایه درگیر',
		hidden: false,
	},
	{
		id: 'blackScholes',
		title: 'بلک شولز',
		hidden: false,
	},
	{
		id: 'timeValue',
		title: 'ارزش زمانی',
		hidden: false,
	},
	{
		id: 'intrinsicValue',
		title: 'ارزش ذاتی',
		hidden: false,
	},
	{
		id: 'bepDifference',
		title: 'اختلاف تا سر به سر',
		hidden: false,
	},
	{
		id: 'tradeValue',
		title: 'ارزش معاملات آپشن',
		hidden: false,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: false,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: false,
	},
];

// ? BearPutSpread
export const initialColumnsBearPutSpread: Array<IManageColumn<TBearPutSpreadColumns>> = [
	{
		id: 'baseSymbolTitle',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseTradePriceVarPreviousTradePercent',
		title: 'قیمت پایه',
		hidden: false,
	},
	{
		id: 'dueDays',
		title: 'مانده تا سررسید',
		hidden: false,
	},
	{
		id: 'hspSymbolISIN',
		title: 'پوت خرید',
		hidden: false,
	},
	{
		id: 'hspStrikePrice',
		title: 'قیمت اعمال پوت خرید',
		hidden: false,
	},
	{
		id: 'hspBestSellLimitPrice',
		title: 'قیمت فروشنده پوت خرید',
		hidden: false,
	},
	{
		id: 'hspBestSellLimitQuantity',
		title: 'حجم فروشنده پوت خرید',
		hidden: false,
	},
	{
		id: 'hspBestBuyLimitPrice',
		title: 'قیمت خریدار پوت خرید',
		hidden: false,
	},
	{
		id: 'hspBestBuyLimitQuantity',
		title: 'حجم خریدار پوت خرید',
		hidden: false,
	},
	{
		id: 'lspSymbolISIN',
		title: 'پوت فروش',
		hidden: false,
	},
	{
		id: 'lspStrikePrice',
		title: 'قیمت اعمال پوت فروش',
		hidden: false,
	},
	{
		id: 'lspBestBuyLimitPrice',
		title: 'قیمت خریدار پوت فروش',
		hidden: false,
	},
	{
		id: 'lspBestBuyLimitQuantity',
		title: 'حجم خریدار پوت فروش',
		hidden: false,
	},
	{
		id: 'lspBestSellLimitPrice',
		title: 'بهترین فروشنده پوت فروش',
		hidden: false,
	},
	{
		id: 'lspBestSellLimitQuantity',
		title: 'حجم سر خط فروش پوت فروش',
		hidden: false,
	},
	{
		id: 'hspOpenPositionCount',
		title: 'موقعیت باز پوت خرید',
		hidden: false,
	},
	{
		id: 'lspOpenPositionCount',
		title: 'موقعیت باز پوت فروش',
		hidden: false,
	},
	{
		id: 'hspPremiumPercent',
		title: 'قیمت نماد پوت خرید',
		hidden: false,
	},
	{
		id: 'lspPremiumPercent',
		title: 'قیمت نماد پوت فروش',
		hidden: false,
	},
	{
		id: 'bullCallSpreadBEP',
		title: 'سر به سر',
		hidden: false,
	},
	{
		id: 'maxProfitPercent',
		title: 'حداکثر بازده',
		hidden: false,
	},
	{
		id: 'maxLoss',
		title: 'حداکثر زیان',
		hidden: false,
	},
	{
		id: 'inUseCapital',
		title: 'سرمایه درگیر',
		hidden: false,
	},
	{
		id: 'lspTimeValue',
		title: 'ارزش زمانی پوت خرید',
		hidden: false,
	},
	{
		id: 'hspTimeValue',
		title: 'ارزش زمانی پوت فروش',
		hidden: false,
	},
	{
		id: 'hspIntrinsicValue',
		title: 'ارزش ذاتی پوت خرید',
		hidden: false,
	},
	{
		id: 'lspIntrinsicValue',
		title: 'ارزش ذاتی پوت فروش',
		hidden: false,
	},
	{
		id: 'hspTradeValue',
		title: 'ارزش معاملات آپشن پوت خرید',
		hidden: false,
	},
	{
		id: 'lspTradeValue',
		title: 'ارزش معاملات آپشن پوت فروش',
		hidden: false,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: false,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: false,
	},
	{
		id: 'ytm',
		title: 'YTM',
		hidden: false,
	},
];
