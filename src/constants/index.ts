import { DateAsMillisecond } from './enums';

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

export const initialSymbolInfoPanelGrid: ISymbolInfoPanelGrid[] = [
	{
		id: 'option_detail',
		// 328 > 468
		// 328 > 628
		height: 328,
		expand: true,
		hidden: false,
		isOption: true,
		i: 0,
	},
	{
		id: 'market_depth',
		height: 200,
		expand: true,
		hidden: false,
		isOption: true,
		i: 1,
	},
	{
		id: 'symbol_detail',
		// 328 > 808
		height: 328,
		expand: true,
		hidden: false,
		isOption: false,
		i: 2,
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
		id: 'chart',
		height: 320,
		expand: true,
		hidden: false,
		i: 4,
	},
	{
		id: 'individual_and_legal',
		height: 234,
		expand: true,
		hidden: false,
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

export const initialDashboardGrid: IDashboardGrid[] = [
	{ id: 'market_view', w: 2, h: 384, hidden: false, i: 0 },
	{ id: 'market_state', w: 1, h: 384, hidden: false, i: 1 },
	{ id: 'best', w: 2, h: 384, hidden: false, i: 2 },
	{ id: 'user_progress_bar', w: 1, h: 384, hidden: false, i: 3 },
	{ id: 'compare_transaction_value', w: 2, h: 384, hidden: false, i: 4 },
	{ id: 'option_contracts', w: 1, h: 384, hidden: false, i: 5 },
	{ id: 'option_trades_value', w: 2, h: 384, hidden: false, i: 6 },
	{ id: 'option_market_process', w: 1, h: 384, hidden: false, i: 7 },
	{ id: 'individual_and_legal', w: 1, h: 384, hidden: false, i: 8 },
	{ id: 'price_changes_watchlist', w: 1, h: 384, hidden: false, i: 9 },
	{ id: 'open_positions_process', w: 1, h: 384, hidden: false, i: 10 },
	{ id: 'meetings', w: 1, h: 384, hidden: false, i: 11 },
	{ id: 'new_and_old', w: 1, h: 384, hidden: false, i: 12 },
	{ id: 'top_base_assets', w: 1, h: 384, hidden: false, i: 13 },
	{ id: 'custom', w: 1, h: 384, hidden: false, i: 14 },
	{ id: 'recent_activities', w: 1, h: 384, hidden: false, i: 15 },
	{ id: 'due_dates', w: 1, h: 384, hidden: false, i: 16 },
];

export const initialOptionWatchlistFilters: IOptionWatchlistFilters = {
	symbols: [],
	type: [],
	status: [],
	dueDays: [0, 365],
	delta: [-1, 1],
	minimumTradesValue: '',
};

export const dateTypesAPI: Record<
	'daily' | 'weekly' | 'monthly' | 'yearly',
	'Today' | 'Weekly' | 'Monthly' | 'Yearly'
> = {
	daily: 'Today',
	weekly: 'Weekly',
	monthly: 'Monthly',
	yearly: 'Yearly',
};

export const editableOrdersStatus = ['OnBoardModify', 'OnBoard', 'PartOfTheOrderDone'];

export const initialTransactionsFilters: Transaction.ITransactionsFilters = {
	pageNumber: 1,
	pageSize: 25,
	symbol: null,
	date: 'dates.custom',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	fromPrice: 0,
	toPrice: 0,
	groupMode: 'GreedyGrouped',
	transactionType: [],
};

export const initialInstantDepositReportsFilters: InstantDepositReports.IInstantDepositReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	toPrice: 0,
	fromPrice: 0,
	date: 'dates.month',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	providers: [],
	status: [],
};

export const defaultTransactionColumns: TTransactionColumnsState[] = [
	{
		id: 'date',
		title: 'زمان',
		hidden: false,
	},
	{
		id: 'transactionType',
		title: 'عملیات',
		hidden: false,
	},
	{
		id: 'description',
		title: 'شرح تراکنش',
		hidden: false,
	},
	{
		id: 'debit',
		title: 'بدهکار',
		hidden: false,
	},
	{
		id: 'credit',
		title: 'بستانکار',
		hidden: false,
	},
	{
		id: 'remaining',
		title: 'مانده',
		hidden: false,
	},
	{
		id: 'station',
		title: 'ایستگاه معاملاتی',
		hidden: false,
	},
];

export const defaultInstantDepositReportsColumn: TInstantDepositReportsColumnsState[] = [
	{
		id: 'saveDate',
		title: 'زمان',
		hidden: false,
	},
	{
		id: 'providerType',
		title: 'درگاه',
		hidden: false,
	},
	{
		id: 'reservationNumber',
		title: 'شماره پیگیری',
		hidden: false,
	},
	{
		id: 'amount',
		title: 'مقدار',
		hidden: false,
	},
	{
		id: 'state',
		title: 'وضعیت',
		hidden: false,
	},
];

export const defaultDepositWithReceiptReportsColumn: TDepositWithReceiptReportsColumnsState[] = [
	{
		id: 'receiptDate',
		title: 'زمان',
		hidden: false,
	},
	{
		id: 'providerType',
		title: 'بانک کارگزاری',
		hidden: false,
	},
	{
		id: 'receiptNumber',
		title: 'شماره فیش',
		hidden: false,
	},
	{
		id: 'amount',
		title: 'مبلغ',
		hidden: false,
	},
	{
		id: 'state',
		title: 'وضعیت',
		hidden: false,
	},
];

export const defaultWithdrawalCashReportsColumn: TWithdrawalCashReportsColumnsState[] = [
	{
		id: 'saveDate',
		title: 'زمان درخواست',
		hidden: false,
	},
	{
		id: 'requestDate',
		title: 'موعد درخواست',
		hidden: false,
	},
	{
		id: 'customerBank',
		title: 'بانک',
		hidden: false,
	},
	{
		id: 'requestAmount',
		title: 'مبلغ',
		hidden: false,
	},
	{
		id: 'state',
		title: 'وضعیت',
		hidden: false,
	},
];

export const initialDepositWithReceiptReportsFilters: DepositWithReceiptReports.DepositWithReceiptReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	fromDate: new Date().getTime() - DateAsMillisecond.Year * 3,
	toDate: new Date().getTime(),
	status: [],
	date: 'dates.month',
	toPrice: 0,
	fromPrice: 0,
	receiptNumber: '',
	attachment: null,
};

export const initialWithdrawalCashReportsFilters: WithdrawalCashReports.WithdrawalCashReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	fromDate: new Date().getTime() - DateAsMillisecond.Year * 3,
	toDate: new Date().getTime(),
	status: [],
	date: 'dates.week',
	toPrice: 0,
	fromPrice: 0,
	banks: [],
};

export const weekDaysName = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export const yearMonthsName = [
	'فروردین',
	'اردیبهشت',
	'خرداد',
	'تیر',
	'مرداد',
	'شهریور',
	'مهر',
	'آبان',
	'آذر',
	'دی',
	'بهمن',
	'اسفند',
];

export const getDateMilliseconds = {
	Day: 864e5,
	Week: 6048e5,
	Month: 2592e6,
	Year: 31536e6,
};
