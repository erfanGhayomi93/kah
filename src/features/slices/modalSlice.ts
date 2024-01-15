'use client';

import { type IOptionFiltersModal } from '@/@types/slices/modalSlice';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface ModalState {
	loginModal: boolean;
	forgetPassword: boolean;
	optionFilters: false | Partial<IOptionFiltersModal>;
}

const initialState: ModalState = {
	loginModal: false,
	forgetPassword: false,
	optionFilters: false,
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
	},
});

export const { toggleLoginModal, toggleForgetPasswordModal, toggleOptionFiltersModal } = modalSlice.actions;

export const getLoginModal = (state: RootState) => state.modal.loginModal;
export const getForgetPasswordModal = (state: RootState) => state.modal.forgetPassword;
export const getOptionFiltersModal = (state: RootState) => state.modal.optionFilters;

export default modalSlice.reducer;
