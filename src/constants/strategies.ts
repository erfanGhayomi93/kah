export const initialColumnsCoveredCall: IManageColumn[] = [
	{
		id: 'baseSymbolISIN',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedPrice',
		title: 'قیمت پایه',
		hidden: false,
	},
	{
		id: 'dueDays',
		title: 'مانده تا سررسید',
		hidden: false,
	},
	{
		id: 'callSymbolISIN',
		title: 'اختیار خرید',
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
		id: 'optionBestBuyLimitPrice',
		title: 'قیمت بهترین خریدار',
		hidden: false,
	},
	{
		id: 'optionBestBuyLimitQuantity',
		title: 'حجم سرخط خرید',
		hidden: false,
	},
	{
		id: 'optionBestSellLimitPrice',
		title: 'قیمت بهترین فروشنده',
		hidden: true,
	},
	{
		id: 'optionBestSellLimitQuantity',
		title: 'حجم سر خط فروش',
		hidden: true,
	},
	{
		id: 'coveredCallBEP',
		title: 'سر به سر استراتژی',
		hidden: false,
	},
	{
		id: 'maxProfit',
		title: 'بیشینه سود',
		hidden: false,
	},
	{
		id: 'nonExpiredProfit',
		title: 'سود عدم اعمال',
		hidden: false,
	},
	{
		id: 'inUseCapital',
		title: 'سرمایه درگیر',
		hidden: false,
	},
	{
		id: 'premium',
		title: 'آخرین قیمت نماد آپشن',
		hidden: true,
	},
	{
		id: 'bepDifference',
		title: 'اختلاف تا سر به سر',
		hidden: true,
	},
	{
		id: 'tradeValue',
		title: 'ارزش معاملات آپشن',
		hidden: true,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: true,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: true,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: true,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: true,
	},
	{
		id: 'bestBuyYTM',
		title: 'YTM سرخط خرید',
		hidden: true,
	},
	{
		id: 'bestSellYTM',
		title: 'YTM سرخط فروش',
		hidden: true,
	},
	{
		id: 'riskCoverage',
		title: 'پوشش ریسک',
		hidden: false,
	},
	{
		id: 'nonExpiredYTM',
		title: 'YTM عدم اعمال',
		hidden: true,
	},
];

export const initialColumnsBullCallSpread: IManageColumn[] = [
	{
		id: 'baseSymbolISIN',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedPrice',
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
		hidden: true,
	},
	{
		id: 'lspBestBuyLimitQuantity',
		title: 'حجم خریدار کال خرید',
		hidden: true,
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
		id: 'lspPremium',
		title: 'قیمت نماد کال خرید',
		hidden: true,
	},
	{
		id: 'hspPremium',
		title: 'قیمت نماد کال فروش',
		hidden: true,
	},
	{
		id: 'bullCallSpreadBEP',
		title: 'قیمت سر به سر',
		hidden: false,
	},
	{
		id: 'maxProfit',
		title: 'بیشینه سود',
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
		hidden: true,
	},
	{
		id: 'lspTimeValue',
		title: 'ارزش زمانی کال خرید',
		hidden: true,
	},
	{
		id: 'hspTimeValue',
		title: 'ارزش زمانی کال فروش',
		hidden: true,
	},
	{
		id: 'lspIntrinsicValue',
		title: 'ارزش ذاتی کال خرید',
		hidden: true,
	},
	{
		id: 'hspIntrinsicValue',
		title: 'ارزش ذاتی کال فروش',
		hidden: true,
	},
	{
		id: 'lspTradeValue',
		title: 'ارزش معاملات آپشن کال خرید',
		hidden: true,
	},
	{
		id: 'hspTradeValue',
		title: 'ارزش معاملات آپشن کال فروش',
		hidden: true,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: true,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: true,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: true,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: true,
	},
	{
		id: 'ytm',
		title: 'YTM',
		hidden: true,
	},
];

export const initialColumnsLongCall: IManageColumn[] = [
	{
		id: 'symbolISIN',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedPrice',
		title: 'قیمت پایه',
		hidden: false,
	},
	{
		id: 'dueDays',
		title: 'مانده تا سررسید',
		hidden: false,
	},
	{
		id: 'callSymbolISIN',
		title: 'اختیار خرید',
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
		id: 'premium',
		title: 'آخرین قیمت نماد آپشن',
		hidden: true,
	},
	{
		id: 'optionBestBuyLimitPrice',
		title: 'قیمت بهترین خریدار',
		hidden: true,
	},
	{
		id: 'optionBestBuyLimitQuantity',
		title: 'حجم سرخط خرید',
		hidden: true,
	},
	{
		id: 'optionBestSellLimitPrice',
		title: 'قیمت بهترین فروشنده',
		hidden: false,
	},
	{
		id: 'optionBestSellLimitQuantity',
		title: 'حجم سرخط فروش',
		hidden: false,
	},
	{
		id: 'longCallBEP',
		title: 'سر به سر استراتژی',
		hidden: false,
	},
	{
		id: 'maxProfit',
		title: 'بیشینه سود',
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
		hidden: true,
	},
	{
		id: 'intrinsicValue',
		title: 'ارزش ذاتی',
		hidden: true,
	},
	{
		id: 'profit',
		title: 'مقدار سود',
		hidden: true,
	},
	{
		id: 'bepDifference',
		title: 'اختلاف تا سر به سر',
		hidden: true,
	},
	{
		id: 'tradeValue',
		title: 'ارزش معاملات آپشن',
		hidden: true,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: true,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: true,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: true,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: true,
	},
];

export const initialColumnsLongPut: IManageColumn[] = [
	{
		id: 'symbolISIN',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedPrice',
		title: 'قیمت پایه',
		hidden: false,
	},
	{
		id: 'dueDays',
		title: 'مانده تا سررسید',
		hidden: false,
	},
	{
		id: 'callSymbolISIN',
		title: 'اختیار خرید',
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
		id: 'premium',
		title: 'آخرین قیمت نماد آپشن',
		hidden: false,
	},
	{
		id: 'optionBestBuyLimitPrice',
		title: 'قیمت بهترین خریدار',
		hidden: false,
	},
	{
		id: 'optionBestBuyLimitQuantity',
		title: 'حجم سرخط خرید',
		hidden: false,
	},
	{
		id: 'optionBestSellLimitPrice',
		title: 'قیمت بهترین فروشنده',
		hidden: false,
	},
	{
		id: 'optionBestSellLimitQuantity',
		title: 'حجم سرخط فروش',
		hidden: false,
	},
	{
		id: 'longCallBEP',
		title: 'سر به سر استراتژی',
		hidden: false,
	},
	{
		id: 'maxProfit',
		title: 'بیشینه سود',
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
		hidden: true,
	},
	{
		id: 'profit',
		title: 'مقدار سود',
		hidden: true,
	},
	{
		id: 'bepDifference',
		title: 'اختلاف تا سر به سر',
		hidden: true,
	},
	{
		id: 'tradeValue',
		title: 'ارزش معاملات آپشن',
		hidden: true,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: true,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: true,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: true,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: true,
	},
];

export const initialColumnsConversion: IManageColumn[] = [
	{
		id: 'baseSymbolISIN',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedPrice',
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
		id: 'callPremium',
		title: 'قیمت نماد کال',
		hidden: true,
	},
	{
		id: 'putPremium',
		title: 'قیمت نماد پوت',
		hidden: true,
	},
	{
		id: 'callSymbolISIN',
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
		hidden: true,
	},
	{
		id: 'callBestSellLimitPrice',
		title: 'بهترین فروشنده کال',
		hidden: true,
	},
	{
		id: 'callBestSellLimitQuantity',
		title: 'حجم سر خط فروش کال',
		hidden: true,
	},
	{
		id: 'putSymbolISIN',
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
		hidden: true,
	},
	{
		id: 'putBestBuyLimitPrice',
		title: 'بهترین خریدار پوت',
		hidden: true,
	},
	{
		id: 'putBestBuyLimitQuantity',
		title: 'حجم سر خط خرید پوت',
		hidden: true,
	},
	{
		id: 'profit',
		title: 'مقدار سود',
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
		hidden: true,
	},
	{
		id: 'bestSellYTM',
		title: 'YTM سرخط فروش',
		hidden: true,
	},
	{
		id: 'callTradeValue',
		title: 'ارزش معاملات کال',
		hidden: true,
	},
	{
		id: 'putTradeValue',
		title: 'ارزش معاملات پوت',
		hidden: true,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: true,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: true,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: true,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: true,
	},
];

export const initialColumnsLongStraddle: IManageColumn[] = [
	{
		id: 'baseSymbolISIN',
		title: 'نماد پایه',
		hidden: false,
	},
	{
		id: 'baseLastTradedPrice',
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
		id: 'callSymbolISIN',
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
		id: 'putSymbolISIN',
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
		hidden: true,
	},
	{
		id: 'putOpenPositionCount',
		title: 'موقعیت باز پوت',
		hidden: true,
	},
	{
		id: 'callPremium',
		title: 'قیمت نماد کال',
		hidden: true,
	},
	{
		id: 'putPremium',
		title: 'قیمت نماد پوت',
		hidden: true,
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
		hidden: true,
	},
	{
		id: 'callTimeValue',
		title: 'ارزش زمانی کال',
		hidden: true,
	},
	{
		id: 'putTimeValue',
		title: 'ارزش زمانی پوت',
		hidden: true,
	},
	{
		id: 'callIntrinsicValue',
		title: 'ارزش ذاتی کال',
		hidden: true,
	},
	{
		id: 'putIntrinsicValue',
		title: 'ارزش ذاتی پوت',
		hidden: true,
	},
	{
		id: 'callBestSellLimitPrice',
		title: 'قیمت بهترین خریدار کال',
		hidden: false,
	},
	{
		id: 'callBestSellLimitQuantity',
		title: 'حجم سر خط خرید کال',
		hidden: false,
	},
	{
		id: 'putBestSellLimitPrice',
		title: 'قیمت بهترین خریدار پوت',
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
		hidden: true,
	},
	{
		id: 'putTradeValue',
		title: 'ارزش معاملات پوت',
		hidden: true,
	},
	{
		id: 'baseTradeValue',
		title: 'ارزش معاملات سهم پایه',
		hidden: true,
	},
	{
		id: 'baseTradeCount',
		title: 'تعداد معاملات پایه',
		hidden: true,
	},
	{
		id: 'baseTradeVolume',
		title: 'حجم معاملات پایه',
		hidden: true,
	},
	{
		id: 'baseLastTradedDate',
		title: 'آخرین معامله پایه',
		hidden: true,
	},
];

export const initialColumnsProtectivePut: IManageColumn[] = [];
