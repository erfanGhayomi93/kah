'use client';

import { type IOptionFiltersModal } from '@/@types/slices/modalSlice';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

type TModalType<T> = null | (T extends object ? T & IBaseModalConfiguration : IBaseModalConfiguration);

type TBaseModalProps<T> = { [P in keyof T]: TModalType<T[P]> };

export interface IBuySellModal {
	symbolTitle: string;
	symbolISIN: string;
	symbolType: TBsSymbolTypes;
	validityDate?: TBsValidityDates;
	side: TBsSides;
	collateral?: TBsCollaterals;
	expand?: boolean;
	priceLock?: boolean;
	holdAfterOrder?: boolean;
}

export interface IForgetPasswordModal extends IBaseModalConfiguration {
	phoneNumber?: string;
}

export interface IContractSelectorModal {
	symbolTitle: string;
	symbolISIN: string;
}

export interface IAddSaturnTemplate extends Saturn.Content {}

export type ModalState = TBaseModalProps<{
	loginModal: true;
	logout: true;
	chooseBroker: true;
	buySell: IBuySellModal;
	addNewOptionWatchlist: true;
	manageOptionWatchlistList: true;
	addSymbolToWatchlist: true;
	addSaturnTemplate: IAddSaturnTemplate;
	symbolContracts: IContractSelectorModal;
	forgetPassword: IForgetPasswordModal;
	optionFilters: Partial<IOptionFiltersModal>;
}>;

const initialState: ModalState = {
	loginModal: null,
	optionFilters: null,
	logout: null,
	addSymbolToWatchlist: null,
	addNewOptionWatchlist: null,
	manageOptionWatchlistList: null,
	chooseBroker: null,
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

		toggleChooseBrokerModal: (state, { payload }: PayloadAction<ModalState['chooseBroker']>) => {
			state.chooseBroker = payload;
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
	toggleForgetPasswordModal,
	toggleOptionFiltersModal,
	toggleLogoutModal,
	toggleSymbolContractsModal,
	toggleSaveSaturnTemplate,
	toggleAddNewOptionWatchlist,
	toggleChooseBrokerModal,
	toggleAddSymbolToWatchlistModal,
	toggleManageOptionWatchlistListModal,
} = modalSlice.actions;

export const getChooseBroker = (state: RootState) => state.modal.chooseBroker;
export const getLoginModal = (state: RootState) => state.modal.loginModal;
export const getLogoutModal = (state: RootState) => state.modal.logout;
export const getBuySellModal = (state: RootState) => state.modal.buySell;
export const getForgetPasswordModal = (state: RootState) => state.modal.forgetPassword;
export const getOptionFiltersModal = (state: RootState) => state.modal.optionFilters;
export const getSymbolContractsModal = (state: RootState) => state.modal.symbolContracts;
export const getAddSaturnTemplate = (state: RootState) => state.modal.addSaturnTemplate;
export const getAddNewOptionWatchlist = (state: RootState) => state.modal.addNewOptionWatchlist;
export const getManageOptionWatchlistList = (state: RootState) => state.modal.manageOptionWatchlistList;
export const getAddSymbolToWatchlist = (state: RootState) => state.modal.addSymbolToWatchlist;

export default modalSlice.reducer;
