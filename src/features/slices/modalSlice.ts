'use client';

import { type IOptionFiltersModal } from '@/@types/slices/modalSlice';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface IForgetPasswordModal {
	phoneNumber?: string;
}

export interface IContractSelectorModal {
	symbolTitle: string;
	symbolISIN: string;
}

export interface ISaveSaturnTemplate extends Saturn.Content {}

export interface ModalState {
	loginModal: boolean;
	logout: boolean;
	saveSaturnTemplate: ISaveSaturnTemplate | null;
	symbolContracts: IContractSelectorModal | null;
	forgetPassword: IForgetPasswordModal | true | null;
	optionFilters: false | Partial<IOptionFiltersModal>;
}

const initialState: ModalState = {
	loginModal: false,
	forgetPassword: null,
	optionFilters: false,
	logout: false,
	saveSaturnTemplate: null,
	symbolContracts: null,
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
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

		toggleSaveSaturnTemplate: (state, { payload }: PayloadAction<ModalState['saveSaturnTemplate']>) => {
			state.saveSaturnTemplate = payload;
		},
	},
});

export const {
	toggleLoginModal,
	toggleForgetPasswordModal,
	toggleOptionFiltersModal,
	toggleLogoutModal,
	toggleSymbolContractsModal,
	toggleSaveSaturnTemplate,
} = modalSlice.actions;

export const getLoginModal = (state: RootState) => state.modal.loginModal;
export const getLogoutModal = (state: RootState) => state.modal.logout;
export const getForgetPasswordModal = (state: RootState) => state.modal.forgetPassword;
export const getOptionFiltersModal = (state: RootState) => state.modal.optionFilters;
export const getSymbolContractsModal = (state: RootState) => state.modal.symbolContracts;
export const getSaveSaturnTemplate = (state: RootState) => state.modal.saveSaturnTemplate;

export default modalSlice.reducer;
