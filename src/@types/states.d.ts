declare interface INextProps<T extends object = {}> {
	children: React.ReactNode;
	params: T & { locale: string };
}

declare type TDateRange = 'dates.day' | 'dates.week' | 'dates.month' | 'dates.year' | 'dates.custom';

declare type TSortingMethods = 'asc' | 'desc';

declare interface INextStrategyProps extends INextProps<{ id: Strategy.Type }> {}

declare interface IOptionHistory {
	dateTime: string;
	status: 'InSendQueue' | 'Error' | 'SendToBourse' | 'SaveResult';
	description: string | null;
}

declare type TOrdersSide = 'Buy' | 'Sell';

declare type TTradeSide = 'Buy' | 'Sell';

declare type TOrdersTypes = 'MarketOrder' | 'LimitOrder' | 'MarketToLimitOrder' | 'MarketOnOpeningOrder' | 'StopOrder';

declare type TOrdersValidity =
	| 'GoodTillDate'
	| 'FillAndKill'
	| 'GoodTillCancelled'
	| 'Day'
	| 'SlidingValidity'
	| 'Session'
	| 'Month'
	| 'Week';

declare type TOrdersForm = 'Web' | 'Mobile' | 'BrokerTrader' | 'ClientApi' | 'MarketMaker' | 'Admin' | 'Supervisor';

declare type TOrdersAction = 'CreateOrder' | 'ModifyOrder' | 'CancelOrder' | 'ExpireOrder';

declare type TOrdersStatus =
	| 'InOMSQueu'
	| 'OnSending'
	| 'Error'
	| 'DeleteByEngine'
	| 'OnBoard'
	| 'Canceled'
	| 'OnModifyFrom'
	| 'OnModifyTo'
	| 'Modified'
	| 'OnBoardModify'
	| 'PartOfTheOrderDone'
	| 'OrderDone'
	| 'OnCanceling'
	| 'OnModifyError'
	| 'OnCancelError'
	| 'Expired'
	| 'RejectByGAP'
	| 'OnCancelingWithBroker'
	| 'TradeCancel';

declare type TTradeDetails =
	| null
	| {
			tradedQuantity: number;
			tradePrice: number;
			remainingQuantityOrder: number;
			tradeDate: string;
			tradeNumber: string;
			total: number;
	  }[];

declare type TOrderSource = 'Account' | 'Portfolio';

declare interface IUserBankAccount {
	id: number;
	shaba: string;
	accountNumber: string;
	bankName: string;
	isDefault: number;
}

declare interface IOFields {
	symbolISIN: string;
	quantity: number;
	price: number;
	orderSide: 'buy' | 'sell';
	validity: TBsValidityDates;
	validityDate: number;
}

declare interface IOFieldsWithID {
	id: number;
	symbolISIN: string;
	quantity: number;
	price: number;
	orderSide: 'buy' | 'sell';
	validity: TBsValidityDates;
	validityDate: number;
}

declare interface CashWithdrawBankType {
	accountNumber: string;
	customerAccountId: number;
	customerBank: string;
}

type TPriceBasis = 'LastTradePrice' | 'ClosingPrice' | 'BestLimit';

type TStrategySymbolBasis = 'All' | 'BestLimit';

declare type TLoginModalStates = 'phoneNumber' | 'login-with-otp' | 'welcome' | 'login-with-password' | 'set-password';

declare type TOptionSides = 'put' | 'call';

declare type TBsSides = 'buy' | 'sell';

declare type TBsCollaterals = 'cash' | 'stock';

declare type TBsSymbolTypes = 'base' | 'option';

declare type TBsModes = 'create' | 'edit';

declare type TBsTypes = 'draft' | 'order';

declare type TOrdersTab = 'open_orders' | 'today_orders' | 'executed_orders' | 'option_orders' | 'draft';

declare type TBsValidityDates = 'GoodTillDate' | 'FillAndKill' | 'GoodTillCancelled' | 'Day' | 'Week' | 'Month';

declare type TDojiType = 'Bullish' | 'Bearish' | 'Neutral';

declare type TStrategyMarketTrend =
	| 'All'
	| Extract<Strategy.Cheap, 'BullishMarket' | 'BearishMarket' | 'NeutralMarket' | 'DirectionalMarket'>;

declare type TSymbolInfoPanelSections =
	| 'option_detail'
	| 'market_depth'
	| 'symbol_detail'
	| 'base_symbol_contracts'
	| 'user_open_positions'
	| 'quotes'
	| 'individual_and_legal'
	| 'chart'
	| 'same_sector_symbols'
	| 'supervisor_messages';

declare type OptionWatchlistColumns =
	| 'symbolTitle'
	| 'tradeValue'
	| 'premium'
	| 'delta'
	| 'baseSymbolPrice'
	| 'breakEvenPoint'
	| 'leverage'
	| 'openPositionCount'
	| 'impliedVolatility'
	| 'iotm'
	| 'blackScholes'
	| 'tradeVolume'
	| 'dueDays'
	| 'strikePrice'
	| 'bestBuyPrice'
	| 'bestSellPrice'
	| 'symbolFullTitle'
	| 'baseSymbolTitle'
	| 'closingPrice'
	| 'historicalVolatility'
	| 'contractSize'
	| 'timeValue'
	| 'theta'
	| 'tradeCount'
	| 'contractEndDate'
	| 'spread'
	| 'blackScholesDifference'
	| 'baseClosingPrice'
	| 'gamma'
	| 'optionType'
	| 'requiredMargin'
	| 'initialMargin'
	| 'rho'
	| 'vega'
	| 'growth'
	| 'contractValueType'
	| 'highOpenPosition'
	| 'lastTradeDate'
	| 'legalBuyVolume'
	| 'individualBuyVolume'
	| 'legalSellVolume'
	| 'individualSellVolume'
	| 'sectorName'
	| 'notionalValue'
	| 'intrinsicValue'
	| 'action';

declare type TDashboardSections =
	| 'market_view'
	| 'market_state'
	| 'best'
	| 'user_progress_bar'
	| 'compare_transaction_value'
	| 'option_contracts'
	| 'option_trades_value'
	| 'option_market_process'
	| 'individual_and_legal'
	| 'price_changes_watchlist'
	| 'open_positions_process'
	| 'meetings'
	| 'new_and_old'
	| 'top_base_assets'
	| 'custom'
	| 'recent_activities'
	| 'due_dates';

declare type LightstreamStatus =
	| 'CONNECTING'
	| 'CONNECTED:STREAM-SENSING'
	| 'CONNECTED:WS-STREAMING'
	| 'CONNECTED:HTTP-STREAMING'
	| 'CONNECTED:WS-POLLING'
	| 'CONNECTED:HTTP-POLLING'
	| 'STALLED'
	| 'DISCONNECTED:WILL-RETRY'
	| 'DISCONNECTED:TRYING-RECOVERY'
	| 'DISCONNECTED';

declare type TSaturnBaseSymbolContracts = (Saturn.ContentOption | null)[];

declare interface IManageColumn {
	id: string;
	title: string;
	hidden: boolean;
}

declare interface ISymbolInfoPanelGrid {
	id: TSymbolInfoPanelSections;
	height: number;
	expand: boolean;
	hidden: boolean;
	i: number;
	readonly isOption?: boolean;
}

declare interface IDashboardGrid {
	id: TDashboardSections;
	w: number;
	h: number;
	i: number;
	hidden: boolean;
}

declare interface IBaseModalConfiguration {
	moveable?: boolean;
	animation?: boolean;
	callbackFunction?: () => void;
}

declare interface SymbolContractModalStates {
	term: string;
	sendBaseSymbol: boolean;
	contracts: Option.Root[];
	contractType: Record<'id' | 'title', string>;
	activeSettlement: Option.BaseSettlementDays | null;
}

declare type IBrokerUrls = Record<
	| 'todayOrders'
	| 'executedOrders'
	| 'drafts'
	| 'createOrder'
	| 'ordersCount'
	| 'openOrders'
	| 'commission'
	| 'optionOrders'
	| 'userInformation'
	| 'deleteDraft'
	| 'deleteOrder'
	| 'groupDeleteDraft'
	| 'groupDeleteOrder'
	| 'updateDraft'
	| 'updateOrder'
	| 'userRemain'
	| 'userStatus'
	| 'createDraft'
	| 'createRequestEPaymentApi'
	| 'getRemain'
	| 'completeRequestReceipt'
	| 'getListBrokerBankAccount'
	| 'getDepositOfflineHistory'
	| 'customerTurnOverRemain'
	| 'CreateChangeBrokers'
	| 'LastChangeBrokers'
	| 'DeleteChangeBroker'
	| 'getWithFilterReceipt'
	| 'getFilteredEPaymentApi'
	| 'RecentUnFreeze'
	| 'DeleteFreeze'
	| 'newKaraFreeze'
	| 'RecentFreeze'
	| 'symbolCountFreeze'
	| 'ReceiptEditRequest'
	| 'getDepositOnlineHistory'
	| 'PaymentUpdateRequest'
	| 'GetListBankAccount'
	| 'GetRemainsWithDate'
	| 'LastListDrawal'
	| 'RequestPayment'
	| 'getFilteredPayment'
	| 'getCustomerTurnOverCSVExport'
	| 'getEPaymentExportFilteredCSV'
	| 'getReceiptExportFilteredCSV'
	| 'getPaymentExportFilteredCSV',
	| 'SetCustomerSettings'
	| 'GetCustomerSettings'
	| 'getPaymentExportFilteredCSV'
	| 'getEPaymentApiGetStatuses'
	| 'getEPaymentApiGetProviderTypes'
	| 'getPaymentGetStatuses'
	| 'getChangeBrokerExportFilteredCSV'
	| 'getChangeBrokerChangeBrokersByFilter'
	| 'GetAgreements',
	| 'changeBrokerSetCancel'
	| 'getFreezeExportFreeze'
	| 'getFreezerequests'
	| 'getSettlementcash'
	| 'getSettlementphysical'
	| 'getOrderExportOrders'
	| 'getOrderOrders'
	| 'getOrderExportTrades'
	| 'getOrderDetailedOrders'
	| 'receiptSetCancel'
	| 'paymentDeleteRequest',
	string
>;

declare type TOptionWatchlistColumnsState = Array<{
	colId: OptionWatchlistColumns;
	width?: number;
	hide?: boolean;
	pinned?: 'left' | 'right' | null;
	sort?: TSortingMethods | null;
	sortIndex?: null;
	aggFunc?: null;
	rowGroup?: boolean;
	rowGroupIndex?: null;
	pivot?: boolean;
	pivotIndex?: null;
	flex?: number;
}>;

declare interface IBsModalInputs {
	collateral: TBsCollaterals | null;
	validity: TBsValidityDates;
	validityDate: number;
	price: number;
	quantity: number;
	value: BigInt | number;
	side: TBsSides;
	priceLock: boolean;
	expand: boolean;
	holdAfterOrder: boolean;
}

declare interface IAnalyzeModalInputs {
	chartData: Array<Record<'x' | 'y', number>>;
	minPrice: number;
	maxPrice: number;
	mostProfit: number;
	mostLoss: number;
	baseAssets: number;
	bep: Record<'x' | 'y', number>;
	budget: number;
	profitProbability: number;
	timeValue: number;
	risk: number;
	requiredMargin: number;
}

declare type TSetBsModalInputs = <
	T extends
		| Partial<IBsModalInputs>
		| keyof Partial<IBsModalInputs>
		| ((values: IBsModalInputs) => Partial<IBsModalInputs>),
>(
	options: T,
	value?: (T extends keyof IBsModalInputs ? IBsModalInputs[T] : undefined) | undefined,
) => void;

declare interface IBlackScholesModalStates {
	baseSymbol: Option.BaseSearch | null;
	contractEndDate: Option.BaseSettlementDays | null;
	contract: {
		baseSymbolPrice: number;
		strikePrice: number;
		contractEndDate: number;
		historicalVolatility: number;
		premium: number;
	} | null;
	sharePrice: number;
	strikePrice: number;
	dueDays: number;
	volatility: string;
	riskFreeProfit: string;
	premium: number;
}

declare interface IOptionWatchlistFilters {
	symbols: Option.BaseSearch[];
	type: Array<'Call' | 'Put'>;
	status: Array<'ITM' | 'OTM' | 'ATM'>;
	dueDays: [number, number];
	delta: [number, number];
	minimumTradesValue: string;
}

declare interface OptionChainFilters {
	baseSymbol: Option.BaseSearch | null;
	settlementDay: Option.BaseSettlementDays | null;
}

declare namespace OrderBasket {
	export interface Root {
		baseSymbol: {
			symbolISIN: string;
			symbolTitle: string;
		};

		orders: OrderBasket.Order[];
	}

	export type Order = TSymbolStrategy;
}

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

declare interface ISymbolChartStates {
	interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
	type: 'area' | 'candlestick';
}

declare type TFinancialReportsTab = 'transaction' | 'deposit_online' | 'deposit_offline' | 'withdrawal_cash';

declare type TOptionReportsTab = 'freeze_and_unfreeze' | 'cash_settlement' | 'physical_settlement';

declare type TOrdersTradersTab = 'orders' | 'trades';

declare namespace Transaction {
	export type TTransactionGroupModes = 'Flat' | 'GreedyGrouped' | 'Grouped';

	export type TransactionTypes = 'Buy' | 'Sell' | 'Deposit' | 'Payment';

	type TransactionGroupModes = 'Flat' | 'GreedyGrouped' | 'Grouped';

	export interface ITransactionsFilters {
		pageNumber: number;
		pageSize: number;
		symbol: Symbol.Search | null;
		date: TDateRange;
		fromDate: number;
		toDate: number;
		fromPrice: number;
		toPrice: number;
		groupMode: TTransactionGroupModes;
		transactionType: { id: TransactionTypes; title: string }[];
	}

	export interface ITransactionColumnsState {
		id: string;
		title: string;
		hidden: boolean;
	}

	export type TTransactionColumns =
		| 'id'
		| 'credit'
		| 'date'
		| 'debit'
		| 'description'
		| 'remaining'
		| 'station'
		| 'transactionType';
}

declare namespace InstantDepositReports {
	export interface IInstantDepositReportsFilters {
		pageNumber: number;
		pageSize: number;
		date: TDateRange;
		fromDate: number;
		toDate: number;
		status: string[];
		toPrice: number;
		fromPrice: number;
		providers: string[];
	}

	export interface IInstantDepositReportsParams {
		'QueryOption.PageNumber': string;
		'QueryOption.PageSize': string;
		startDate: string;
		endDate: string;
		minAmount: string;
		maxAmount: string;
		ProviderTypes: Array<string>;
		Statuses: Array<string>;
	}

	export interface TInstantDepositReportsColumnsState {
		id: string;
		title: string;
		hidden: boolean;
	}

	export type TInstantDepositReportsColumns =
		| 'id'
		| 'reservationNumber'
		| 'referenceNumber'
		| 'saveDate'
		| 'amount'
		| 'providerType'
		| 'state';
}

declare namespace DepositWithReceiptReports {
	export interface DepositWithReceiptReportsFilters {
		pageNumber: number;
		pageSize: number;
		date: TDateRange;
		fromDate: number;
		toDate: number;
		status: string[];
		toPrice: number;
		fromPrice: number;
		receiptNumber: string;
		attachment: boolean | null;
	}

	export interface DepositWithReceiptReportsParams {
		'QueryOption.PageNumber': string;
		'QueryOption.PageSize': string;
		startDate: string;
		endDate: string;
		minAmount: string;
		maxAmount: string;
		ReceiptNumber: string;
		HasAttachment: string;
		StatesList: Array<string>;
	}

	export type TDepositWithReceiptReportsColumnsState = {
		id: string;
		title: string;
		hidden: boolean;
	};

	export type TDepositWithReceiptColumns =
		| 'id'
		| 'receiptDate'
		| 'providerType'
		| 'receiptNumber'
		| 'amount'
		| 'state'
		| 'action';
}

declare namespace WithdrawalCashReports {
	export interface WithdrawalCashReportsFilters {
		pageNumber: number;
		pageSize: number;
		date: DateRangeType;
		fromDate: number;
		toDate: number;
		status: string[];
		fromPrice: number;
		toPrice: number;
		banks: IUserBankAccount[];
	}

	export interface WithdrawalCashReportsParams {
		'QueryOption.PageNumber': string;
		'QueryOption.PageSize': string;
		startDate: string;
		endDate: string;
		Statuses: Array<string>;
		AccountIds: Array<string>;
	}

	export type TWithdrawalCashReportsColumnsState = {
		id: string;
		title: string;
		hidden: boolean;
	};

	export type TWithdrawalCashReportsColumns =
		| 'id'
		| 'saveDate'
		| 'requestDate'
		| 'customerBank'
		| 'requestAmount'
		| 'channel'
		| 'state'
		| 'action';
}

declare namespace ChangeBrokerReports {
	export interface IChangeBrokerReportsFilters {
		pageNumber: number;
		pageSize: number;
		symbol: Symbol.Search | null;
		date: TDateRange;
		fromDate: number;
		toDate: number;
		status: string[];
		attachment: boolean | null;
	}

	export interface IChangeBrokerReportsColumnsState {
		id: string;
		title: string;
		hidden: boolean;
	}

	export type TChangeBrokerReportsColumns = 'id' | 'saveDate' | 'symbolTitle' | 'lastState';
}

declare namespace OrdersReports {
	export type TOrderSide =
		| 'All'
		| 'Buy'
		| 'Sell'
		| 'BuyIncremental'
		| 'BuyDecremental'
		| 'SellIncremental'
		| 'SellDecremental';

	export type TOrderStatus = 'InOMSQueue' | 'OrderDone' | 'Error' | 'Modified' | 'Expired' | 'Canceled';

	export interface IOrdersReportsFilters {
		pageNumber: number;
		pageSize: number;
		symbol: Symbol.Search | null;
		date: TDateRange;
		fromDate: number;
		toDate: number;
		side: TOrderSide;
		status: { id: TOrderStatus; title: string }[];
	}

	export interface IOrdersReportsColumnsState {
		id: string;
		title: string;
		hidden: boolean;
	}

	export type TOrdersReportsColumns =
		| 'orderId'
		| 'symbolTitle'
		| 'orderSide'
		| 'orderDateTime'
		| 'orderDateTime'
		| 'quantity'
		| 'price'
		| 'sumExecuted'
		| 'lastErrorCode'
		| 'validity';
}

declare namespace TradesReports {
	export type TOrderSide =
		| 'All'
		| 'Buy'
		| 'Sell'
		| 'BuyIncremental'
		| 'BuyDecremental'
		| 'SellIncremental'
		| 'SellDecremental';

	export interface ITradesReportsFilters {
		pageNumber: number;
		pageSize: number;
		symbol: Symbol.Search | null;
		date: TDateRange;
		fromDate: number;
		toDate: number;
		side: TOrderSide;
	}

	export interface ITradesReportsColumnsState {
		id: string;
		title: string;
		hidden: boolean;
	}

	export type TTradesReportsColumns =
		| 'orderId'
		| 'symbolTitle'
		| 'orderSide'
		| 'orderDateTime'
		| 'orderDateTime'
		| 'tradedQuantity'
		| 'tradePrice'
		| 'totalQuota'
		| 'total';
}

declare namespace FreezeUnFreezeReports {
	export type TFreezeRequestState = 'Done' | 'InProgress' | 'FreezeFailed';

	export interface IFreezeUnFreezeReportsFilters {
		pageNumber: number;
		pageSize: number;
		symbol: Symbol.Search | null;
		date: TDateRange;
		fromDate: number;
		toDate: number;
		requestState: TFreezeRequestState | null;
	}

	export interface IFreezeUnFreezeReportsColumnsState {
		id: string;
		title: string;
		hidden: boolean;
	}

	export type TFreezeUnFreezeReportsColumns = 'id' | 'symbolTitle' | 'confirmedOn' | 'requestState' | 'action';
}

declare namespace CashSettlementReports {
	export type TContractStatusType = 'Profit' | 'Loss' | 'Indifferent' | 'All';

	export type TSettlementRequestTypeCashType = 'MaximumStrike' | 'PartialStrike';

	export type TRequestStatusType = 'Registered' | 'Send' | 'Sending' | 'Settling' | 'Expired' | 'Draft';

	export interface ICashSettlementReportsFilters {
		pageNumber: number;
		pageSize: number;
		symbol: Symbol.Search | null;
		date: TDateRange;
		fromDate: number;
		toDate: number;
		contractStatus: TContractStatusType;
		settlementRequestType: { id: TSettlementRequestTypeCashType; title: string }[];
		requestStatus: { id: TRequestStatusType; title: string }[];
	}

	export interface ICashSettlementReportsColumnsState {
		id: string;
		title: string;
		hidden: boolean;
	}

	export type TCashSettlementReportsColumns =
		| 'symbolTitle'
		| 'side'
		| 'openPositionCount'
		| 'cashSettlementDate'
		| 'pandLStatus'
		| 'settlementRequestType'
		| 'incomeValue'
		| 'requestCount'
		| 'doneCount'
		| 'userType'
		| 'status'
		| 'action';
}

declare namespace PhysicalSettlementReports {
	export type TContractStatus = 'Profit' | 'Loss' | 'Indifferent' | 'All';

	export type TRequestStatus = 'Registered' | 'Send' | 'Sending' | 'Settling' | 'Expired' | 'Draft';

	export type TSettlementRequestTypePhysically = 'MaximumStrike' | 'PartialStrike'; //| "IndifferentAtLoss"

	export interface IPhysicalSettlementReportsFilters {
		pageNumber: number;
		pageSize: number;
		symbol: Symbol.Search | null;
		date: TDateRange;
		fromDate: number;
		toDate: number;
		contractStatus: TContractStatus;
		settlementRequestType: { id: TSettlementRequestTypePhysically; title: string }[];
		requestStatus: { id: TRequestStatus; title: string }[];
	}

	export interface IPhysicalSettlementReportsColumnsState {
		id: string;
		title: string;
		hidden: boolean;
	}

	export type TPhysicalSettlementReportsColumns =
		| 'symbolTitle'
		| 'side'
		| 'openPositionCount'
		| 'cashSettlementDate'
		| 'pandLStatus'
		| 'settlementRequestType'
		| 'incomeValue'
		| 'requestCount'
		| 'doneCount'
		| 'penValue'
		| 'penVolume'
		| 'userType'
		| 'status'
		| 'action';
}
