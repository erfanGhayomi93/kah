type TModalType<T> = null | (T extends object ? T & IBaseModalConfiguration : IBaseModalConfiguration);

type TBaseModalProps<T> = { [P in keyof T]: TModalType<T[P]> };

export interface ILoginModal extends IBaseModalConfiguration {
	showForceLoginAlert?: boolean;
}

export interface IBlackScholesModal extends IBaseModalConfiguration {
	symbolISIN?: string;
}

export interface IOptionFiltersModal extends IBaseModalConfiguration {
	initialSymbols?: Option.BaseSearch[];
	initialType?: Array<'Call' | 'Put'>;
	initialStatus?: Array<'ITM' | 'OTM' | 'ATM'>;
	initialDueDays?: [number, number];
	initialDelta?: [number, number];
	initialMinimumTradesValue?: string;
}

export interface ITransactionsFiltersModal extends IBaseModalConfiguration {
	symbol?: Symbol.Search | null;
	date?: TDateRange;
	fromDate?: number;
	toDate?: number;
	fromPrice?: number | null;
	toPrice?: number | null;
	groupMode?: Transaction.TTransactionGroupModes;
	transactionType?: Array<{ id: Transaction.TransactionTypes; title: string }>;
}

export interface IInstantDepositReportsFiltersModal extends IBaseModalConfiguration {
	date?: TDateRange;
	fromDate?: number;
	toDate?: number;
	status?: string[];
	toPrice?: number | null;
	fromPrice?: number | null;
	providers?: string[];
}

export interface IDepositWithReceiptReportsFiltersModal extends IBaseModalConfiguration {
	date?: TDateRange;
	fromDate?: number;
	toDate?: number;
	status?: string[];
	fromPrice?: number | null;
	toPrice?: number | null;
	receiptNumber?: string | null;
	attachment?: boolean | null;
}

export interface IWithdrawalCashReportsFiltersModal extends IBaseModalConfiguration {
	date?: TDateRange;
	fromDate?: number;
	toDate?: number;
	status?: string[];
	fromPrice?: number | null;
	toPrice?: number | null;
	banks?: IUserBankAccount[];
}

export interface IChangeBrokerReportsFiltersModal extends IBaseModalConfiguration {
	symbol?: Symbol.Search | null;
	date?: TDateRange;
	fromDate?: number;
	toDate?: number;
	status?: string[];
	attachment?: boolean | null;
}

export interface IFreezeUnFreezeReportsFiltersModal extends IBaseModalConfiguration {
	symbol?: Symbol.Search | null;
	date?: TDateRange;
	fromDate?: number;
	toDate?: number;
	requestState?: FreezeUnFreezeReports.TFreezeRequestState | null;
	requestType?: 'freeze' | 'unFreeze';
}

export interface ICashSettlementReportsFilters extends IBaseModalConfiguration {
	symbol?: Symbol.Search | null;
	date?: TDateRange;
	fromDate?: number;
	toDate?: number;
	contractStatus?: CashSettlementReports.TContractStatusType;
	settlementRequestType?: Array<{ id: CashSettlementReports.TSettlementRequestTypeCashType; title: string }>;
	requestStatus?: Array<{ id: CashSettlementReports.TRequestStatusType; title: string }>;
}

export interface IPhysicalSettlementReportsFilters extends IBaseModalConfiguration {
	symbol?: Symbol.Search | null;
	date?: TDateRange;
	fromDate?: number;
	toDate?: number;
	contractStatus?: CashSettlementReports.TContractStatusType;
	settlementRequestType?: Array<{ id: CashSettlementReports.TSettlementRequestTypeCashType; title: string }>;
	requestStatus?: Array<{ id: CashSettlementReports.TRequestStatusType; title: string }>;
}

export interface IOrdersReportsFilters extends IBaseModalConfiguration {
	symbol?: Symbol.Search | null;
	date?: TDateRange;
	fromDate?: number;
	toDate?: number;
	side?: TOrderSide;
	status?: Array<{ id: TOrderStatus; title: string }>;
}

export interface ITradesReportsFilters extends IBaseModalConfiguration {
	pageNumber?: number;
	pageSize?: number;
	symbol?: Symbol.Search | null;
	date?: TDateRange;
	fromDate?: number;
	toDate?: number;
	side?: TradesReports.TOrderSide;
}

export interface IBuySellModal extends IBaseModalConfiguration {
	id?: number;
	mode: TBsModes;
	switchable?: boolean;
	symbolTitle: string;
	symbolISIN: string;
	symbolType: TBsSymbolTypes;
	side: TBsSides;
	type?: TBsTypes;
	collateral?: TBsCollaterals;
	expand?: boolean;
	priceLock?: boolean;
	holdAfterOrder?: boolean;
	initialValidity?: TBsValidityDates;
	initialValidityDate?: number;
	initialPrice?: number;
	initialQuantity?: number;
}

export interface IForgetPasswordModal extends IBaseModalConfiguration {
	phoneNumber?: string;
}

export interface ISelectSymbolContractsModal extends IBaseModalConfiguration {
	initialBaseSymbolISIN?: string;
	suppressBaseSymbolChange?: boolean;
	suppressSendBaseSymbol?: boolean;
	initialSelectedBaseSymbol?: boolean;
	initialSelectedContracts?: string[];
	maxContractsLength?: number;
	callback: (result: Option.Root[], baseSymbol: Symbol.Info | null) => void;
}

export interface IAddSaturnTemplate extends Saturn.Content, IBaseModalConfiguration {}

export interface IOrderDetails {
	type: 'order';
	data: Order.OpenOrder | Order.ExecutedOrder | Order.TodayOrder;
}

export interface IBaseSymbolDetails {
	type: 'base';
	data: {
		quantity: number;
		price: number;
		side: TBsSides;
		symbolTitle: string;
	};
}

export interface IOptionDetails {
	type: 'option';
	data: {
		quantity: number;
		price: number;
		strikePrice: number;
		contractSize: number;
		settlementDay: Date | number | string;
		type: TOptionSides;
		side: TBsSides;
		symbolTitle: string;
		requiredMargin: number;
		strikeCommission: number;
		tradeCommission: number;
	};
}

export type TOrderDetailsModal = IBaseModalConfiguration & (IOrderDetails | IBaseSymbolDetails | IOptionDetails);

export interface IMoveSymbolToWatchlistModal extends IBaseModalConfiguration {
	symbolTitle: string;
	symbolISIN: string;
}

export interface IChoiceCollateral extends IBaseModalConfiguration {
	order: Order.OptionOrder;
}

export interface IConfirmModal extends IBaseModalConfiguration {
	title: React.ReactNode;
	description: React.ReactNode;
	onSubmit?: () => void;
	onCancel?: () => void;
	confirm: {
		label: string;
		type: 'success' | 'error' | 'primary';
	};
}

export interface IAcceptAgreement extends IBaseModalConfiguration {
	data: Settings.IAgreements;
	getAgreements: (
		options?: RefetchOptions,
	) => Promise<QueryObserverResult<Settings.IAgreements[] | null, AxiosError<unknown, any>>>;
}

export interface ISymbolInfoPanelSetting extends IBaseModalConfiguration {
	isOption: boolean;
}

export interface IManageDashboardLayoutModal extends IBaseModalConfiguration {}

export interface IChangeBrokerModal extends IBaseModalConfiguration {}

export interface IWithdrawalModal extends IBaseModalConfiguration {
	data?: Payment.IDrawalHistoryList;
}

export interface IDescriptionModal extends IBaseModalConfiguration {
	title: React.ReactNode;
	description: () => React.ReactNode;
	onRead: () => void;
}

export interface IDepositModal extends IBaseModalConfiguration {
	data?: Reports.IDepositWithReceipt | Reports.IInstantDeposit;
	activeTab?: Payment.TDepositTab;
}

export interface IFreezeModal extends IBaseModalConfiguration {}

export interface IOptionSettlementModal extends IBaseModalConfiguration {
	data?: Reports.ICashSettlementReports | Reports.IPhysicalSettlementReports;
	activeTab?: 'optionSettlementCashTab' | 'optionSettlementPhysicalTab';
}

export interface ICreateStrategyModal extends IBaseModalConfiguration {
	strategy: Strategy.Type;
	baseSymbol: Record<'symbolISIN' | 'symbolTitle', string>;
	steps: CreateStrategy.Input[];
}

export interface IAnalyzeModal extends IBaseModalConfiguration {
	symbol: {
		symbolTitle: string;
		symbolISIN: string;
	};
	contracts: OrderBasket.Order[];
	onContractsChanged?: (contracts: Option.Root[], baseSymbolISIN: null | string) => void;
	onContractRemoved?: (id: string) => void;
}

export interface ICavertCallFiltersModal extends IBaseModalConfiguration {
	initialFilters: Partial<ICoveredCallFiltersModalStates>;
	onSubmit: (appliedFilters: Partial<ICoveredCallFiltersModalStates>) => void;
}

export interface IManageColumnsModal extends IBaseModalConfiguration {
	initialColumns?: IManageColumn[];
	title: React.ReactNode;
	columns: IManageColumn[];
	applyChangesAfterClose?: boolean;
	onReset?: () => void;
	onColumnChanged: (columns: IManageColumn[]) => void;
}

export interface IMarketStateModal extends IBaseModalConfiguration {}

export interface IMarketViewModal extends IBaseModalConfiguration {}

export interface IBestModal extends IBaseModalConfiguration {}

export interface IUserProgressBarModal extends IBaseModalConfiguration {}

export interface ICompareTransactionValueModal extends IBaseModalConfiguration {}

export interface IContractOptionModal extends IBaseModalConfiguration {}

export interface IOptionTradeValueModal extends IBaseModalConfiguration {}

export interface IOptionMarketProcessModal extends IBaseModalConfiguration {}

export interface IIndividualAndLegalModal extends IBaseModalConfiguration {}

export interface IPriceChangeWatchlistModal extends IBaseModalConfiguration {}

export interface IOpenPositionProcessModal extends IBaseModalConfiguration {}

export interface IMeetingModal extends IBaseModalConfiguration {}

export interface INewAndOldModal extends IBaseModalConfiguration {}

export interface ITopBaseAssetsModal extends IBaseModalConfiguration {}

export interface IRecentActivitiesModal extends IBaseModalConfiguration {}

export interface IDueDatesModal extends IBaseModalConfiguration {}

export namespace NStrategyFilter {
	// Number
	export interface IRangeNumber {
		mode: 'range';
		type: 'percent' | 'number' | 'decimal';
		initialValue: [number, number];
	}

	export interface ISingleNumber {
		mode: 'single';
		type: 'percent' | 'number' | 'decimal';
		initialValue: number;
	}

	// String
	export interface IArrayString {
		mode: 'array';
		type: 'string';
		initialValue: string[];
	}

	export interface IRangeString {
		mode: 'range';
		type: 'string';
		initialValue: [string, string];
	}

	export interface ISIngleString {
		mode: 'single';
		type: 'string';
		initialValue: string;
	}

	// Data
	export interface IRangeData {
		mode: 'range';
		type: 'date';
		initialValue: [Date, Date];
	}

	export interface ISIngleData {
		mode: 'single';
		type: 'date';
		initialValue: Date;
	}

	export type TFilter = (
		| NStrategyFilter.IRangeNumber
		| NStrategyFilter.ISingleNumber
		| NStrategyFilter.IArrayString
		| NStrategyFilter.IRangeString
		| NStrategyFilter.ISIngleString
		| NStrategyFilter.IRangeData
		| NStrategyFilter.ISIngleData
	) & {
		title: string;
		titleHint?: string;
	};

	export interface IFilters extends IBaseModalConfiguration {
		initialFilters?: unknown;
		filters: NStrategyFilter.TFilter[];
		onSubmit: () => void;
	}
}

export type ModalState = TBaseModalProps<{
	loginModal: ILoginModal;
	forgetPassword: IForgetPasswordModal;
	logout: true;
	choiceBroker: true;
	confirm: IConfirmModal;
	acceptAgreement: IAcceptAgreement;
	blackScholes: IBlackScholes;
	buySell: IBuySellModal;
	orderDetails: TOrderDetailsModal;
	addNewOptionWatchlist: true;
	manageOptionWatchlistList: true;
	addSymbolToWatchlist: true;
	choiceCollateral: IChoiceCollateral;
	moveSymbolToWatchlist: IMoveSymbolToWatchlistModal;
	addSaturnTemplate: IAddSaturnTemplate;
	selectSymbolContracts: ISelectSymbolContractsModal;
	optionFilters: IOptionFiltersModal;
	manageDashboardLayout: IManageDashboardLayoutModal;
	changeBroker: IChangeBrokerModal;
	withdrawal: IWithdrawalModal;
	deposit: IDepositModal;
	freeze: IFreezeModal;
	optionSettlement: IOptionSettlementModal;
	analyze: IAnalyzeModal;
	description: IDescriptionModal;
	transactionsFilters: ITransactionsFiltersModal;
	instantDepositReportsFilters: IInstantDepositReportsFiltersModal;
	depositWithReceiptReportsFilters: IDepositWithReceiptReportsFiltersModal;
	withdrawalCashReportsFilters: IWithdrawalCashReportsFiltersModal;
	changeBrokerReportsFilters: IChangeBrokerReportsFiltersModal;
	freezeUnfreezeReportsFilters: IFreezeUnFreezeReportsFiltersModal;
	cashSettlementReportsFilters: ICashSettlementReportsFilters;
	physicalSettlementReportsFilters: IPhysicalSettlementReportsFilters;
	ordersReportsFilters: IOrdersReportsFilters;
	tradesReportsFilters: ITradesReportsFilters;
	createStrategy: ICreateStrategyModal;
	symbolInfoPanelSetting: ISymbolInfoPanelSetting;
	coveredCallFilters: ICavertCallFiltersModal;
	manageColumns: IManageColumnsModal;
	marketState: IMarketStateModal;
	marketView: IMarketViewModal;
	best: IBestModal;
	userProgressBar: IUserProgressBarModal;
	compareTransactionValue: ICompareTransactionValueModal;
	optionContract: IOptionContractModal;
	optionTradeValue: IOptionTradeValueModal;
	optionMarketProcess: IOptionMarketProcessModal;
	individualAndLegal: IIndividualAndLegalModal;
	priceChangeWatchlist: IPriceChangeWatchlistModal;
	openPositionProcess: IOpenPositionProcessModal;
	meetings: IMeetingModal;
	newAndOld: INewAndOldModal;
	topBaseAssets: ITopBaseAssetsModal;
	recentActivities: IRecentActivitiesModal;
	dueDates: IDueDatesModal;
	strategyFilters: NStrategyFilter.IFilters;
}>;
