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
	groupMode?: TTransactionGroupModes;
	transactionType?: Array<{ id: TransactionTypes; title: string }>;
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
	maxContracts: null | number;
	initialSelectedContracts: string[];
	callback: (contracts: Option.Root[], baseSymbolISIN: null | string) => void;
}

export interface IAddSaturnTemplate extends Saturn.Content, IBaseModalConfiguration {}

export interface IOrderDetails {
	type: 'order';
	data: Order.OpenOrder | Order.ExecutedOrder | Order.TodayOrder;
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

export type TOrderDetailsModal = IBaseModalConfiguration & (IOrderDetails | IOptionDetails);

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

export interface ISymbolInfoPanelSetting extends IBaseModalConfiguration {
	isOption: boolean;
}

export interface IManageDashboardLayoutModal extends IBaseModalConfiguration {}

export interface IChangeBrokerModal extends IBaseModalConfiguration {}

export interface IWithdrawalModal extends IBaseModalConfiguration {
	isShow: boolean;
}

export interface IDescriptionModal extends IBaseModalConfiguration {
	title: React.ReactNode;
	description: React.ReactNode;
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
}>;
