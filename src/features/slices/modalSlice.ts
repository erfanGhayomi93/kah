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

export interface ModalState {
	loginModal: boolean;
	logout: boolean;
	symbolContracts: IContractSelectorModal | null;
	forgetPassword: IForgetPasswordModal | true | null;
	optionFilters: false | Partial<IOptionFiltersModal>;
}

const initialState: ModalState = {
	loginModal: false,
	forgetPassword: null,
	optionFilters: false,
	logout: false,
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
	},
});

export const {
	toggleLoginModal,
	toggleForgetPasswordModal,
	toggleOptionFiltersModal,
	toggleLogoutModal,
	toggleSymbolContractsModal,
} = modalSlice.actions;

export const getLoginModal = (state: RootState) => state.modal.loginModal;
export const getLogoutModal = (state: RootState) => state.modal.logout;
export const getForgetPasswordModal = (state: RootState) => state.modal.forgetPassword;
export const getOptionFiltersModal = (state: RootState) => state.modal.optionFilters;
export const getSymbolContractsModal = (state: RootState) => state.modal.symbolContracts;

export default modalSlice.reducer;
