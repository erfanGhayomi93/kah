type TModalType<T> = null | (T extends object ? T & IBaseModalConfiguration : IBaseModalConfiguration);

type TBaseModalProps<T> = { [P in keyof T]: TModalType<T[P]> };

export interface IBlackScholes extends IBaseModalConfiguration {
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
	symbol: null | {
		symbolTitle: string;
		symbolISIN: string;
	};
	canChangeBaseSymbol: boolean;
	canSendBaseSymbol: boolean;
	maxContracts: null | number;
	initialSelectedContracts: string[];
	callback: (contracts: Option.Root[], baseSymbolISIN: null | string) => void;
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

export interface IChangeBrokerModal extends IBaseModalConfiguration {
	isShow: boolean;
}

export interface IWithdrawalModal extends IBaseModalConfiguration {
	isShow: boolean;
}

export interface IDescriptionModal extends IBaseModalConfiguration {
	title: React.ReactNode;
	description: () => React.ReactNode;
	onRead: () => void;
}

export interface IDepositModal extends IBaseModalConfiguration {
	isShow: boolean;
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

export type ModalState = TBaseModalProps<{
	loginModal: true;
	logout: true;
	choiceBroker: true;
	symbolInfoPanelSetting: ISymbolInfoPanelSetting;
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
	forgetPassword: IForgetPasswordModal;
	optionFilters: IOptionFiltersModal;
	manageDashboardLayout: IManageDashboardLayoutModal;
	changeBroker: IChangeBrokerModal;
	withdrawal: IWithdrawalModal;
	deposit: IDepositModal;
	analyze: IAnalyzeModal;
	description: IDescriptionModal;
	transactionsFilters: ITransactionsFiltersModal;
	instantDepositReportsFilters: IInstantDepositReportsFiltersModal;
	depositWithReceiptReportsFilters: IDepositWithReceiptReportsFiltersModal;
	withdrawalCashReportsFilters: IWithdrawalCashReportsFiltersModal;
	changeBrokerReportsFilters: IChangeBrokerReportsFiltersModal;
	freezeUnfreezeReportsFilters: IFreezeUnFreezeReportsFiltersModal;
}>;
