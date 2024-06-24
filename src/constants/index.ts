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
	// { id: 'user_progress_bar', w: 1, h: 384, hidden: false, i: 3 },
	{ id: 'compare_transaction_value', w: 2, h: 384, hidden: false, i: 3 },
	{ id: 'option_contracts', w: 1, h: 384, hidden: false, i: 4 },
	{ id: 'option_trades_value', w: 2, h: 384, hidden: false, i: 5 },
	{ id: 'option_market_process', w: 1, h: 384, hidden: false, i: 6 },
	{ id: 'individual_and_legal', w: 1, h: 384, hidden: false, i: 7 },
	{ id: 'price_changes_watchlist', w: 1, h: 384, hidden: false, i: 8 },
	{ id: 'open_positions_process', w: 1, h: 384, hidden: false, i: 9 },
	// { id: 'meetings', w: 1, h: 384, hidden: false, i: 11 },
	{ id: 'new_and_old', w: 1, h: 384, hidden: false, i: 10 },
	{ id: 'custom', w: 1, h: 384, hidden: false, i: 11 },
	{ id: 'due_dates', w: 1, h: 384, hidden: false, i: 12 },
	{ id: 'top_base_assets', w: 1, h: 384, hidden: false, i: 13 },
	// { id: 'recent_activities', w: 1, h: 384, hidden: false, i: 15 },
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

export const defaultTransactionColumns: Array<IManageColumn<Transaction.TTransactionColumns>> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'date',
		title: 'زمان',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'transactionType',
		title: 'عملیات',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'description',
		title: 'شرح تراکنش',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'debit',
		title: 'بدهکار',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'credit',
		title: 'بستانکار',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'remaining',
		title: 'مانده',
		hidden: false,
		tag: 'Transaction',
	},
	{
		id: 'station',
		title: 'ایستگاه معاملاتی',
		hidden: false,
		tag: 'Transaction',
	},
];

export const initialDashboardLayout: Array<IManageColumn<TDashboardSections>> = [
	{
		id: 'market_state',
		title: 'وضعیت بازار',
		hidden: false,
	},
	{
		id: 'market_view',
		title: 'نمای بازار',
		hidden: false,
	},

	{
		id: 'best',
		title: 'برترین‌ها',
		hidden: false,
	},
	{
		id: 'option_contracts',
		title: 'قراردادهای اختیار',
		hidden: false,
	},
	{
		id: 'compare_transaction_value',
		title: 'مقایسه ارزش معاملات',
		hidden: false,
	},
	{
		id: 'option_market_process',
		title: 'روند بازار آپشن',
		hidden: false,
	},
	{
		id: 'option_trades_value',
		title: 'ارزش در معاملات اختیار',
		hidden: false,
	},
	{
		id: 'open_positions_process',
		title: 'روند موقعیت‌های باز',
		hidden: false,
	},
	{
		id: 'individual_and_legal',
		title: 'حقیقی و حقوقی',
		hidden: false,
	},
	{
		id: 'price_changes_watchlist',
		title: 'دیده بان تغییر قیمت - سهام',
		hidden: false,
	},
	{
		id: 'new_and_old',
		title: 'جدید و قدیم',
		hidden: false,
	},
	{
		id: 'top_base_assets',
		title: 'برترین دارایی‌های پایه',
		hidden: false,
	},
	{
		id: 'due_dates',
		title: 'سررسیدها',
		hidden: false,
	},
];

export const defaultInstantDepositReportsColumn: Array<
	IManageColumn<InstantDepositReports.TInstantDepositReportsColumns>
> = [
	{
		id: 'id',
		title: 'شماره ردیف',
		hidden: false,
		tag: 'InstantDepositReports',
	},
	{
		id: 'saveDate',
		title: 'زمان',
		hidden: false,
		tag: 'InstantDepositReports',
	},
	{
		id: 'providerType',
		title: 'درگاه',
		hidden: false,
		tag: 'InstantDepositReports',
	},
	{
		id: 'reservationNumber',
		title: 'شماره پیگیری',
		hidden: false,
		tag: 'InstantDepositReports',
	},
	{
		id: 'amount',
		title: 'مقدار',
		hidden: false,
		tag: 'InstantDepositReports',
	},
	{
		id: 'state',
		title: 'وضعیت',
		hidden: false,
		tag: 'InstantDepositReports',
	},
];

export const defaultDepositWithReceiptReportsColumn: Array<
	IManageColumn<DepositWithReceiptReports.TDepositWithReceiptColumns>
> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
	{
		id: 'receiptDate',
		title: 'زمان',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
	{
		id: 'providerType',
		title: 'بانک کارگزاری',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
	{
		id: 'receiptNumber',
		title: 'شماره فیش',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
	{
		id: 'amount',
		title: 'مبلغ',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
	{
		id: 'state',
		title: 'وضعیت',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
		tag: 'DepositWithReceiptReports',
	},
];

export const defaultWithdrawalCashReportsColumn: Array<
	IManageColumn<WithdrawalCashReports.TWithdrawalCashReportsColumns>
> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'saveDate',
		title: 'زمان درخواست',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'requestDate',
		title: 'موعد پرداخت',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'customerBank',
		title: 'بانک',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'requestAmount',
		title: 'مبلغ',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'channel',
		title: 'سامانه',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'state',
		title: 'وضعیت',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
		tag: 'WithdrawalCashReports',
	},
];

export const defaultChangeBrokerReportsColumns: Array<IManageColumn<ChangeBrokerReports.TChangeBrokerReportsColumns>> =
	[
		{
			id: 'id',
			title: 'ردیف',
			hidden: false,
			tag: 'ChangeBrokerReports',
		},
		{
			id: 'saveDate',
			title: 'زمان',
			hidden: false,
			tag: 'ChangeBrokerReports',
		},
		{
			id: 'gateway',
			title: 'سامانه',
			hidden: false,
			tag: 'ChangeBrokerReports',
		},
		{
			id: 'symbolTitle',
			title: 'نماد',
			hidden: false,
			tag: 'ChangeBrokerReports',
		},
		{
			id: 'lastState',
			title: 'وضعیت',
			hidden: false,
			tag: 'ChangeBrokerReports',
		},
		{
			id: 'action',
			title: 'عملیات',
			hidden: false,
			tag: 'ChangeBrokerReports',
		},
	];

export const defaultFreezeUnFreezeReportsColumns: Array<
	IManageColumn<FreezeUnFreezeReports.TFreezeUnFreezeReportsColumns>
> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'FreezeUnFreezeReports',
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
		tag: 'FreezeUnFreezeReports',
	},
	{
		id: 'confirmedOn',
		title: 'تاریخ درخواست',
		hidden: false,
		tag: 'FreezeUnFreezeReports',
	},
	{
		id: 'requestState',
		title: 'وضعیت',
		hidden: false,
		tag: 'FreezeUnFreezeReports',
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
		tag: 'FreezeUnFreezeReports',
	},
];

export const defaultCashSettlementReportsColumns: Array<
	IManageColumn<CashSettlementReports.TCashSettlementReportsColumns>
> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'side',
		title: 'سمت',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'openPositionCount',
		title: 'تعداد موقعیت باز',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'cashSettlementDate',
		title: 'تاریخ تسویه نقدی',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'pandLStatus',
		title: 'وضعیت قرارداد',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'settlementRequestType',
		title: 'نوع اعمال',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'incomeValue',
		title: 'مبلغ تسویه',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'requestCount',
		title: 'تعداد درخواست برای تسویه',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'doneCount',
		title: 'تعداد تسویه شده',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'userType',
		title: 'درخواست کننده',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'status',
		title: 'وضعیت',
		hidden: false,
		tag: 'CashSettlementReports',
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
		tag: 'CashSettlementReports',
	},
];

export const defaultPhysicalSettlementReportsColumns: Array<
	IManageColumn<PhysicalSettlementReports.TPhysicalSettlementReportsColumns>
> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'side',
		title: 'سمت',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'openPositionCount',
		title: 'تعداد موقعیت باز',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'cashSettlementDate',
		title: 'تاریخ تسویه نقدی',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'pandLStatus',
		title: 'وضعیت قرارداد',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'settlementRequestType',
		title: 'نوع اعمال',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'incomeValue',
		title: 'مبلغ تسویه',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'requestCount',
		title: 'تعداد درخواست برای تسویه',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'doneCount',
		title: 'تعداد پذیرفته شده',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'penValue',
		title: 'تعداد نکول',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'penVolume',
		title: 'مبلغ نکول',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'userType',
		title: 'درخواست کننده',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'status',
		title: 'وضعیت',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
	{
		id: 'action',
		title: 'عملیات',
		hidden: false,
		tag: 'PhysicalSettlementReports',
	},
];

export const defaultOrdersReportsColumns: Array<IManageColumn<OrdersReports.TOrdersReportsColumns>> = [
	{
		id: 'orderId',
		title: 'ردیف',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'orderSide',
		title: 'سمت',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'orderDateTime',
		title: 'زمان',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'quantity',
		title: 'حجم کل',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'price',
		title: 'قیمت',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'sumExecuted',
		title: 'حجم انجام شده',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'lastErrorCode',
		title: 'وضعیت گزارش',
		hidden: false,
		tag: 'OrdersReports',
	},
	{
		id: 'validity',
		title: 'اعتبار',
		hidden: false,
		tag: 'OrdersReports',
	},
];

export const defaultTradesReportsColumns: Array<IManageColumn<TradesReports.TTradesReportsColumns>> = [
	{
		id: 'id',
		title: 'ردیف',
		hidden: false,
		tag: 'TradesReports',
	},
	{
		id: 'symbolTitle',
		title: 'نماد',
		hidden: false,
		tag: 'TradesReports',
	},
	{
		id: 'orderSide',
		title: 'سمت',
		hidden: false,
		tag: 'TradesReports',
	},

	{
		id: 'tradedQuantity',
		title: 'تعداد انجام شده',
		hidden: false,
		tag: 'TradesReports',
	},
	{
		id: 'tradePrice',
		title: 'قیمت',
		hidden: false,
		tag: 'TradesReports',
	},
	{
		id: 'totalQuota',
		title: 'کارمزد',
		hidden: false,
		tag: 'TradesReports',
	},
	{
		id: 'total',
		title: 'ارزش معامله',
		hidden: false,
		tag: 'TradesReports',
	},
	{
		id: 'tradeDate',
		title: 'زمان',
		hidden: false,
		tag: 'TradesReports',
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
