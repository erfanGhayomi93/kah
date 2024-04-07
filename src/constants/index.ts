export const defaultSymbolISIN = 'IRO1IKCO0001';

export const broadcastChannel = 'tUFN1pQ1Ry';

export const defaultOptionWatchlistColumns: TOptionWatchlistColumnsState = [
	{
		colId: 'symbolTitle',
	},
	{
		colId: 'tradeValue',
	},
	{
		colId: 'premium',
	},
	{
		colId: 'delta',
	},
	{
		colId: 'baseSymbolPrice',
	},
	{
		colId: 'breakEvenPoint',
	},
	{
		colId: 'leverage',
	},
	{
		colId: 'openPositionCount',
	},
	{
		colId: 'impliedVolatility',
	},
	{
		colId: 'iotm',
	},
	{
		colId: 'blackScholes',
	},
	{
		colId: 'tradeVolume',
	},
	{
		colId: 'dueDays',
	},
	{
		colId: 'strikePrice',
	},
	{
		colId: 'bestBuyPrice',
	},
	{
		colId: 'bestSellPrice',
	},
	{
		colId: 'symbolFullTitle',
	},
	{
		colId: 'baseSymbolTitle',
	},
	{
		colId: 'closingPrice',
	},
	{
		colId: 'historicalVolatility',
	},
	{
		colId: 'contractSize',
	},
	{
		colId: 'timeValue',
	},
	{
		colId: 'theta',
	},
	{
		colId: 'tradeCount',
	},
	{
		colId: 'contractEndDate',
	},
	{
		colId: 'spread',
	},
	{
		colId: 'blackScholesDifference',
	},
	{
		colId: 'baseClosingPrice',
	},
	{
		colId: 'gamma',
	},
	{
		colId: 'optionType',
	},
	{
		colId: 'requiredMargin',
	},
	{
		colId: 'initialMargin',
	},
	{
		colId: 'rho',
	},
	{
		colId: 'vega',
	},
	{
		colId: 'growth',
	},
	{
		colId: 'contractValueType',
	},
	{
		colId: 'highOpenPosition',
	},
	{
		colId: 'lastTradeDate',
	},
	{
		colId: 'legalBuyVolume',
	},
	{
		colId: 'individualBuyVolume',
	},
	{
		colId: 'legalSellVolume',
	},
	{
		colId: 'individualSellVolume',
	},
	{
		colId: 'sectorName',
	},
	{
		colId: 'notionalValue',
	},
	{
		colId: 'intrinsicValue',
	},
	{
		colId: 'action',
	},
];

export const getDateMilliseconds = {
	Day: 864e5,
	Week: 6048e5,
	Month: 2592e6,
	Year: 31536e6,
};

export const initialSymbolInfoPanelGrid: ISymbolInfoPanelGrid[] = [
	{
		id: 'option_base_symbol_information',
		height: 448,
		expand: true,
		hidden: false,
		isOption: true,
		i: 0,
	},
	{
		id: 'option_detail',
		height: 200,
		expand: true,
		hidden: false,
		isOption: true,
		i: 1,
	},
	{
		id: 'market_depth',
		height: 200,
		expand: true,
		hidden: false,
		isOption: true,
		i: 2,
	},
	{
		id: 'symbol_detail',
		// It'll be "808" after expand
		height: 448,
		expand: true,
		hidden: false,
		isOption: false,
		i: 0,
	},
	{
		id: 'base_symbol_contracts',
		height: 320,
		expand: true,
		hidden: false,
		isOption: false,
		i: 1,
	},
	{
		id: 'user_open_positions',
		height: 320,
		expand: true,
		hidden: false,
		isOption: false,
		i: 2,
	},
	{
		id: 'quotes',
		height: 277,
		expand: true,
		hidden: false,
		isOption: false,
		i: 3,
	},
	{
		id: 'individual_and_legal',
		height: 306,
		expand: true,
		hidden: false,
		i: 4,
	},
	{
		id: 'chart',
		height: 320,
		expand: true,
		hidden: false,
		isOption: false,
		i: 5,
	},
	{
		id: 'same_sector_symbols',
		height: 400,
		expand: true,
		hidden: false,
		isOption: false,
		i: 6,
	},
	{
		id: 'supervisor_messages',
		height: 360,
		expand: true,
		hidden: false,
		isOption: false,
		i: 7,
	},
];

export const editableOrdersStatus = ['OnBoardModify', 'OnBoard', 'PartOfTheOrderDone'];
