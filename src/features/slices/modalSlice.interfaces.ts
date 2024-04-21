import { type IOptionFiltersModal } from '@/@types/slices/modalSlice';

type TModalType<T> = null | (T extends object ? T & IBaseModalConfiguration : IBaseModalConfiguration);

type TBaseModalProps<T> = { [P in keyof T]: TModalType<T[P]> };

export interface IBlackScholes extends IBaseModalConfiguration {
	symbolISIN?: string;
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
	symbolTitle: string;
	symbolISIN: string;
	canChangeBaseSymbol: boolean;
	maxContracts?: number;
	initialSelectedContracts?: string[];
	callback: (contracts: Option.Root[], baseSymbolISIN: null | string) => void;
}

export interface IAddSaturnTemplate extends Saturn.Content, IBaseModalConfiguration {}

export interface IOrderDetailsModal extends IBaseModalConfiguration {
	order: Order.OpenOrder | Order.ExecutedOrder | Order.TodayOrder;
}

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

export interface IWithdrawalModal extends IBaseModalConfiguration {}

export interface IDepositModal extends IBaseModalConfiguration {}

export interface IAnalyzeModal extends IBaseModalConfiguration {
	contracts?: IOrderBasket[];
}

export type ModalState = TBaseModalProps<{
	loginModal: true;
	logout: true;
	choiceBroker: true;
	symbolInfoPanelSetting: ISymbolInfoPanelSetting;
	confirm: IConfirmModal;
	blackScholes: IBlackScholes;
	buySell: IBuySellModal;
	orderDetails: IOrderDetailsModal;
	addNewOptionWatchlist: true;
	manageOptionWatchlistList: true;
	addSymbolToWatchlist: true;
	choiceCollateral: IChoiceCollateral;
	moveSymbolToWatchlist: IMoveSymbolToWatchlistModal;
	addSaturnTemplate: IAddSaturnTemplate;
	selectSymbolContracts: ISelectSymbolContractsModal;
	forgetPassword: IForgetPasswordModal;
	optionFilters: Partial<IOptionFiltersModal>;
	manageDashboardLayout: IManageDashboardLayoutModal;
	changeBroker: IChangeBrokerModal;
	withdrawal: IWithdrawalModal;
	deposit: IDepositModal;
	analyze: IAnalyzeModal;
}>;
