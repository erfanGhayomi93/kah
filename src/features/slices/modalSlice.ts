'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface ModalState {
	loginModal: boolean;
	forgetPassword: boolean;
}

const initialState: ModalState = {
	loginModal: false,
	forgetPassword: true,
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
	},
});

export const { toggleLoginModal, toggleForgetPasswordModal } = modalSlice.actions;

export const getLoginModal = (state: RootState) => state.modal.loginModal;
export const getForgetPasswordModal = (state: RootState) => state.modal.forgetPassword;

export default modalSlice.reducer;
