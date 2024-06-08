import { DateAsMillisecond } from './enums';

export const defaultSymbolISIN = 'IRO1IKCO0001';

export const broadcastChannel = 'tUFN1pQ1Ry';

export const watchlistPriceBasis: TPriceBasis[] = ['LastTradePrice', 'ClosingPrice', 'BestLimitPrice'];

export const watchlistSymbolBasis: TStrategySymbolBasis[] = ['All', 'BestLimit'];

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

export const initialDashboardGridState: Record<TDashboardSections, boolean> = {
	best: true,
	compare_transaction_value: true,
	custom: true,
	due_dates: true,
	individual_and_legal: true,
	market_state: true,
	market_view: true,
	meetings: true,
	new_and_old: true,
	open_positions_process: true,
	option_contracts: true,
	option_market_process: true,
	option_trades_value: true,
	price_changes_watchlist: true,
	recent_activities: true,
	top_base_assets: true,
	user_progress_bar: true,
};

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
	date: 'dates.year',
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
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	providers: [],
	status: [],
};

export const initialDepositWithReceiptReportsFilters: DepositWithReceiptReports.DepositWithReceiptReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	status: [],
	toPrice: 0,
	fromPrice: 0,
	receiptNumber: '',
	attachment: null,
};

export const initialWithdrawalCashReportsFilters: WithdrawalCashReports.WithdrawalCashReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	status: [],
	toPrice: 0,
	fromPrice: 0,
	banks: [],
};

export const initialChangeBrokerReportsFilters: ChangeBrokerReports.IChangeBrokerReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	symbol: null,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	status: [],
	attachment: null,
};

export const initialFreezeUnFreezeReportsFilters: FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	requestState: null,
	symbol: null,
};

export const initialCashSettlementReportsFilters: CashSettlementReports.ICashSettlementReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	symbol: null,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	contractStatus: 'All',
	settlementRequestType: [],
	requestStatus: [],
};

export const initialPhysicalSettlementReportsFilters: PhysicalSettlementReports.IPhysicalSettlementReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	symbol: null,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	contractStatus: 'All',
	settlementRequestType: [],
	requestStatus: [],
};

export const initialOrdersReportsFilters: OrdersReports.IOrdersReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	symbol: null,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	side: 'All',
	status: [],
};

export const initialTradesReportsFilters: TradesReports.ITradesReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	symbol: null,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	side: 'All',
};

export const defaultTransactionColumns: Transaction.ITransactionColumnsState[] = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
	},
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

export const defaultInstantDepositReportsColumn: InstantDepositReports.TInstantDepositReportsColumnsState[] = [
	{
		id: 'id',
		title: 'شماره ردیف',
		hidden: false,
	},
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

export const defaultDepositWithReceiptReportsColumn: DepositWithReceiptReports.TDepositWithReceiptReportsColumnsState[] =
	[
		{
			id: 'id',
			title: 'ردیف',
			hidden: false,
		},
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
		{
			id: 'action',
			title: 'عملیات',
			hidden: false,
		},
	];

export const defaultWithdrawalCashReportsColumn: WithdrawalCashReports.TWithdrawalCashReportsColumnsState[] = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
	},
	{
		id: 'saveDate',
		title: 'زمان درخواست',
		hidden: false,
	},
	{
		id: 'requestDate',
		title: 'موعد پرداخت',
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
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
	},
];

export const defaultChangeBrokerReportsColumns: ChangeBrokerReports.IChangeBrokerReportsColumnsState[] = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
	},
	{
		id: 'saveDate',
		title: 'زمان',
		hidden: false,
	},
	{
		id: 'gateway',
		title: 'سامانه',
		hidden: false,
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
	},
	{
		id: 'lastState',
		title: 'وضعیت',
		hidden: false,
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
	},
];

export const defaultFreezeUnFreezeReportsColumns: FreezeUnFreezeReports.IFreezeUnFreezeReportsColumnsState[] = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
	},
	{
		id: 'confirmedOn',
		title: 'تاریخ',
		hidden: false,
	},
	{
		id: 'requestState',
		title: 'وضعیت',
		hidden: false,
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
	},
];

export const defaultCashSettlementReportsColumns: CashSettlementReports.ICashSettlementReportsColumnsState[] = [
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
	},
	{
		id: 'side',
		title: 'سمت',
		hidden: false,
	},
	{
		id: 'openPositionCount',
		title: 'تعداد موقعیت باز',
		hidden: false,
	},
	{
		id: 'cashSettlementDate',
		title: 'تاریخ تسویه نقدی',
		hidden: false,
	},
	{
		id: 'pandLStatus',
		title: 'وضعیت قرارداد (سود یا زیان)',
		hidden: false,
	},
	{
		id: 'settlementRequestType',
		title: 'نوع اعمال',
		hidden: false,
	},
	{
		id: 'incomeValue',
		title: 'مبلغ تسویه',
		hidden: false,
	},
	{
		id: 'requestCount',
		title: 'تعداد درخواست برای تسویه',
		hidden: false,
	},
	{
		id: 'doneCount',
		title: 'تعداد تسویه شده',
		hidden: false,
	},
	{
		id: 'userType',
		title: 'درخواست کننده',
		hidden: false,
	},
	{
		id: 'status',
		title: 'وضعیت',
		hidden: false,
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
	},
];

export const defaultPhysicalSettlementReportsColumns: PhysicalSettlementReports.IPhysicalSettlementReportsColumnsState[] =
	[
		{
			id: 'symbolTitle',
			title: 'نماد',
			hidden: false,
		},
		{
			id: 'side',
			title: 'سمت',
			hidden: false,
		},
		{
			id: 'openPositionCount',
			title: 'تعداد موقعیت باز',
			hidden: false,
		},
		{
			id: 'cashSettlementDate',
			title: 'تاریخ تسویه نقدی',
			hidden: false,
		},
		{
			id: 'pandLStatus',
			title: 'وضعیت قرارداد (سود یا زیان)',
			hidden: false,
		},
		{
			id: 'settlementRequestType',
			title: 'نوع اعمال',
			hidden: false,
		},
		{
			id: 'incomeValue',
			title: 'مبلغ تسویه',
			hidden: false,
		},
		{
			id: 'requestCount',
			title: 'تعداد درخواست برای تسویه',
			hidden: false,
		},
		{
			id: 'doneCount',
			title: 'تعداد تسویه شده',
			hidden: false,
		},
		{
			id: 'penValue',
			title: 'تعداد نکول',
			hidden: false,
		},
		{
			id: 'penVolume',
			title: 'مبلغ نکول',
			hidden: false,
		},
		{
			id: 'userType',
			title: 'درخواست کننده',
			hidden: false,
		},
		{
			id: 'status',
			title: 'وضعیت',
			hidden: false,
		},
		{
			id: 'action',
			title: 'عملیات',
			hidden: false,
		},
	];

export const defaultOrdersReportsColumns: OrdersReports.IOrdersReportsColumnsState[] = [
	{
		id: 'orderId',
		title: 'ردیف',
		hidden: false,
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
	},
	{
		id: 'orderSide',
		title: 'سمت',
		hidden: false,
	},
	{
		id: 'orderDateTime',
		title: 'تاریخ',
		hidden: false,
	},
	{
		id: 'orderDateTime',
		title: 'ساعت',
		hidden: false,
	},
	{
		id: 'quantity',
		title: 'حجم کل',
		hidden: false,
	},
	{
		id: 'price',
		title: 'قیمت',
		hidden: false,
	},
	{
		id: 'sumExecuted',
		title: 'حجم انجام شده',
		hidden: false,
	},
	{
		id: 'lastErrorCode',
		title: 'وضعیت گزارش',
		hidden: false,
	},
	{
		id: 'validity',
		title: 'اعتبار',
		hidden: false,
	},
];

export const defaultTradesReportsColumns: TradesReports.ITradesReportsColumnsState[] = [
	{
		id: 'orderId',
		title: 'ردیف',
		hidden: false,
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
	},
	{
		id: 'orderSide',
		title: 'سمت',
		hidden: false,
	},
	{
		id: 'orderDateTime',
		title: 'تاریخ',
		hidden: false,
	},
	{
		id: 'orderDateTime',
		title: 'ساعت',
		hidden: false,
	},
	{
		id: 'quantity',
		title: 'حجم کل',
		hidden: false,
	},
	{
		id: 'price',
		title: 'قیمت',
		hidden: false,
	},
	{
		id: 'totalQuota',
		title: 'کارمزد',
		hidden: false,
	},
	{
		id: 'total',
		title: 'ارزش معامله',
		hidden: false,
	},
	{
		id: 'validity',
		title: 'اعتبار',
		hidden: false,
	},
];

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
