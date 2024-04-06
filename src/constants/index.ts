import { type Layout } from 'react-grid-layout';

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

export const initialSymbolInfoPanelGrid: Record<'baseSymbol' | 'option', Layout[]> = {
	baseSymbol: [
		{
			w: 1,
			h: 27.29,
			x: 0,
			y: 0,
			i: 'symbol_detail',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 19.765,
			x: 0,
			y: 27.29,
			i: 'base_symbol_contracts',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 19.765,
			x: 0,
			y: 47.055,
			i: 'user_open_positions',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 17.235,
			x: 0,
			y: 66.82,
			i: 'quotes',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 17.647,
			x: 0,
			y: 84.05499999999999,
			i: 'individual_and_legal',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 19.765,
			x: 0,
			y: 101.702,
			i: 'chart',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 19.765,
			x: 0,
			y: 121.467,
			i: 'same_sector_symbols',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 19.765,
			x: 0,
			y: 141.232,
			i: 'supervisor_messages',
			moved: false,
			static: false,
		},
	],

	option: [],
};

export const editableOrdersStatus = ['OnBoardModify', 'OnBoard', 'PartOfTheOrderDone'];
