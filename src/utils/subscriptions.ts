import lightStreamInstance from '@/classes/Lightstream';

export const subscribeDatetime = () => {
	return lightStreamInstance.subscribe({
		mode: 'MERGE',
		items: ['time'],
		fields: ['tsetime'],
		snapshot: false,
		dataAdapter: 'RamandRLCDData',
	});
};

export const subscribeSymbolInfo = (
	symbolISIN: string,
	field:
		| 'symbolData'
		| 'ordersData'
		| 'individualLegal'
		| 'symbolData,ordersData'
		| 'symbolData,individualLegal'
		| 'ordersData,individualLegal'
		| 'symbolData,ordersData,individualLegal',
) => {
	const symbolData = [
		'totalTradeValue',
		'totalNumberOfSharesTraded',
		'baseVolume',
		'firstTradedPrice',
		'lastTradedPrice',
		'totalNumberOfTrades',
		'lastTradedPriceVar',
		'lastTradedPriceVarPercent',
		'closingPrice',
		'closingPriceVar',
		'closingPriceVarPercent',
		'lastTradeDateTime',
		'lowestTradePriceOfTradingDay',
		'highestTradePriceOfTradingDay',
		'symbolState',
	];

	const ordersData = [
		'bestBuyLimitPrice_1',
		'bestBuyLimitPrice_2',
		'bestBuyLimitPrice_3',
		'bestBuyLimitPrice_4',
		'bestBuyLimitPrice_5',
		'bestBuyLimitQuantity_1',
		'bestBuyLimitQuantity_2',
		'bestBuyLimitQuantity_3',
		'bestBuyLimitQuantity_4',
		'bestBuyLimitQuantity_5',
		'numberOfOrdersAtBestBuy_1',
		'numberOfOrdersAtBestBuy_2',
		'numberOfOrdersAtBestBuy_3',
		'numberOfOrdersAtBestBuy_4',
		'numberOfOrdersAtBestBuy_5',
		'bestSellLimitPrice_1',
		'bestSellLimitPrice_2',
		'bestSellLimitPrice_3',
		'bestSellLimitPrice_4',
		'bestSellLimitPrice_5',
		'bestSellLimitQuantity_1',
		'bestSellLimitQuantity_2',
		'bestSellLimitQuantity_3',
		'bestSellLimitQuantity_4',
		'bestSellLimitQuantity_5',
		'numberOfOrdersAtBestSell_1',
		'numberOfOrdersAtBestSell_2',
		'numberOfOrdersAtBestSell_3',
		'numberOfOrdersAtBestSell_4',
		'numberOfOrdersAtBestSell_5',
	];

	const individualLegal = [
		'numberOfLegalBuyers',
		'numberOfIndividualBuyers',
		'numberOfIndividualSellers',
		'numberOfLegalSellers',
		'individualBuyVolume',
		'individualSellVolume',
		'legalBuyVolume',
		'legalSellVolume',
	];

	let fs: string[] = [];

	switch (field) {
		case 'symbolData':
			fs = symbolData;
			break;
		case 'ordersData':
			fs = ordersData;
			break;
		case 'individualLegal':
			fs = individualLegal;
			break;
		case 'symbolData,ordersData':
			fs = [...symbolData, ...ordersData];
			break;
		case 'symbolData,individualLegal':
			fs = [...symbolData, ...individualLegal];
			break;
		case 'ordersData,individualLegal':
			fs = [...ordersData, ...individualLegal];
			break;
		case 'symbolData,ordersData,individualLegal':
			fs = [...symbolData, ...ordersData, ...individualLegal];
	}

	return lightStreamInstance.subscribe({
		mode: 'MERGE',
		items: [symbolISIN],
		fields: fs,
		dataAdapter: 'RamandRLCDData',
		snapshot: true,
	});
};

export const subscribePrivateGateWay = (brokerCode: string, customerISIN: string) => {
	const items = [brokerCode + '_' + customerISIN, brokerCode + '_All'];

	return lightStreamInstance.subscribe({
		mode: 'RAW',
		items,
		fields: ['OMSMessage', 'AdminMessage', 'SystemMessage'],
		dataAdapter: 'RamandOMSGateway',
		snapshot: false,
	});
};
