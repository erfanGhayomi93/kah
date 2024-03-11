'use client';

import { type IOptionFiltersModal } from '@/@types/slices/modalSlice';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

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

export interface IContractSelectorModal extends IBaseModalConfiguration {
	symbolTitle: string;
	symbolISIN: string;
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

export type ModalState = TBaseModalProps<{
	loginModal: true;
	logout: true;
	choiceBroker: true;
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
	symbolContracts: IContractSelectorModal;
	forgetPassword: IForgetPasswordModal;
	optionFilters: Partial<IOptionFiltersModal>;
}>;

const initialState: ModalState = {
	loginModal: null,
	optionFilters: null,
	confirm: null,
	moveSymbolToWatchlist: null,
	logout: null,
	blackScholes: null,
	orderDetails: null,
	addSymbolToWatchlist: null,
	addNewOptionWatchlist: null,
	manageOptionWatchlistList: null,
	choiceBroker: null,
	choiceCollateral: null,
	forgetPassword: null,
	buySell: null,
	addSaturnTemplate: null,
	symbolContracts: null,
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		toggleBuySellModal: (state, { payload }: PayloadAction<ModalState['buySell']>) => {
			state.buySell = payload;
		},

		toggleMoveSymbolToWatchlistModal: (state, { payload }: PayloadAction<ModalState['moveSymbolToWatchlist']>) => {
			state.moveSymbolToWatchlist = payload;
		},

		toggleOrderDetailsModal: (state, { payload }: PayloadAction<ModalState['orderDetails']>) => {
			state.orderDetails = payload;
		},

		toggleChoiceCollateralModal: (state, { payload }: PayloadAction<ModalState['choiceCollateral']>) => {
			state.choiceCollateral = payload;
		},

		setConfirmModal: (state, { payload }: PayloadAction<ModalState['confirm']>) => {
			state.confirm = payload;
		},

		toggleLoginModal: (state, { payload }: PayloadAction<ModalState['loginModal']>) => {
			state.loginModal = payload;
		},

		toggleForgetPasswordModal: (state, { payload }: PayloadAction<ModalState['forgetPassword']>) => {
			state.forgetPassword = payload;
		},

		toggleOptionFiltersModal: (state, { payload }: PayloadAction<ModalState['optionFilters']>) => {
			state.optionFilters = payload;
		},

		toggleLogoutModal: (state, { payload }: PayloadAction<ModalState['logout']>) => {
			state.logout = payload;
		},

		toggleSymbolContractsModal: (state, { payload }: PayloadAction<ModalState['symbolContracts']>) => {
			state.symbolContracts = payload;
		},

		toggleSaveSaturnTemplate: (state, { payload }: PayloadAction<ModalState['addSaturnTemplate']>) => {
			state.addSaturnTemplate = payload;
		},

		toggleAddNewOptionWatchlist: (state, { payload }: PayloadAction<ModalState['addNewOptionWatchlist']>) => {
			state.addNewOptionWatchlist = payload;
		},

		toggleAddSymbolToWatchlistModal: (state, { payload }: PayloadAction<ModalState['addSymbolToWatchlist']>) => {
			state.addSymbolToWatchlist = payload;
		},

		toggleChoiceBrokerModal: (state, { payload }: PayloadAction<ModalState['choiceBroker']>) => {
			state.choiceBroker = payload;
		},

		toggleBlackScholesModal: (state, { payload }: PayloadAction<ModalState['blackScholes']>) => {
			state.blackScholes = payload;
		},

		toggleManageOptionWatchlistListModal: (
			state,
			{ payload }: PayloadAction<ModalState['manageOptionWatchlistList']>,
		) => {
			state.manageOptionWatchlistList = payload;
		},
	},
});

export const {
	toggleLoginModal,
	toggleBuySellModal,
	toggleOrderDetailsModal,
	toggleForgetPasswordModal,
	toggleOptionFiltersModal,
	toggleLogoutModal,
	toggleBlackScholesModal,
	setConfirmModal,
	toggleSymbolContractsModal,
	toggleSaveSaturnTemplate,
	toggleAddNewOptionWatchlist,
	toggleChoiceBrokerModal,
	toggleMoveSymbolToWatchlistModal,
	toggleChoiceCollateralModal,
	toggleAddSymbolToWatchlistModal,
	toggleManageOptionWatchlistListModal,
} = modalSlice.actions;

export const getChoiceBroker = (state: RootState) => state.modal.choiceBroker;
export const getChoiceCollateral = (state: RootState) => state.modal.choiceCollateral;
export const getLoginModal = (state: RootState) => state.modal.loginModal;
export const getMoveSymbolToWatchlistModal = (state: RootState) => state.modal.moveSymbolToWatchlist;
export const getLogoutModal = (state: RootState) => state.modal.logout;
export const getBuySellModal = (state: RootState) => state.modal.buySell;
export const getConfirmModal = (state: RootState) => state.modal.confirm;
export const getBlackScholesModal = (state: RootState) => state.modal.blackScholes;
export const getForgetPasswordModal = (state: RootState) => state.modal.forgetPassword;
export const getOptionFiltersModal = (state: RootState) => state.modal.optionFilters;
export const getSymbolContractsModal = (state: RootState) => state.modal.symbolContracts;
export const getAddSaturnTemplate = (state: RootState) => state.modal.addSaturnTemplate;
export const getAddNewOptionWatchlist = (state: RootState) => state.modal.addNewOptionWatchlist;
export const getOrderDetails = (state: RootState) => state.modal.orderDetails;
export const getManageOptionWatchlistList = (state: RootState) => state.modal.manageOptionWatchlistList;
export const getAddSymbolToWatchlist = (state: RootState) => state.modal.addSymbolToWatchlist;

export default modalSlice.reducer;
