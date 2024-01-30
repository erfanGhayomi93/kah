'use client';

import { type IOptionFiltersModal } from '@/@types/slices/modalSlice';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

interface IForgetPasswordModal {
	phoneNumber?: string;
}

interface IContractSelectorModal {
	symbolTitle: string;
	symbolISIN: string;
}

export interface ModalState {
	loginModal: boolean;
	logout: boolean;
	contractSelector: IContractSelectorModal | null;
	forgetPassword: IForgetPasswordModal | true | null;
	optionFilters: false | Partial<IOptionFiltersModal>;
}

const initialState: ModalState = {
	loginModal: false,
	forgetPassword: null,
	optionFilters: false,
	logout: false,
	contractSelector: null,
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

		toggleContractSelectorModal: (state, { payload }: PayloadAction<ModalState['contractSelector']>) => {
			state.contractSelector = payload;
		},
	},
});

export const {
	toggleLoginModal,
	toggleForgetPasswordModal,
	toggleOptionFiltersModal,
	toggleLogoutModal,
	toggleContractSelectorModal,
} = modalSlice.actions;

export const getLoginModal = (state: RootState) => state.modal.loginModal;
export const getLogoutModal = (state: RootState) => state.modal.logout;
export const getForgetPasswordModal = (state: RootState) => state.modal.forgetPassword;
export const getOptionFiltersModal = (state: RootState) => state.modal.optionFilters;
export const getContractSelectorModal = (state: RootState) => state.modal.contractSelector;

export default modalSlice.reducer;
