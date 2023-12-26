'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface ModalState {
	authenticationModal: boolean;
	forgetPassword: boolean;
}

const initialState: ModalState = {
	authenticationModal: false,
	forgetPassword: true,
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		toggleAuthenticationModal: (state, { payload }: PayloadAction<ModalState['authenticationModal']>) => {
			state.authenticationModal = payload;
		},

		toggleForgetPasswordModal: (state, { payload }: PayloadAction<ModalState['authenticationModal']>) => {
			state.forgetPassword = payload;
		},
	},
});

export const { toggleAuthenticationModal, toggleForgetPasswordModal } = modalSlice.actions;

export const getAuthenticationModal = (state: RootState) => state.modal.authenticationModal;
export const getForgetPasswordModal = (state: RootState) => state.modal.forgetPassword;

export default modalSlice.reducer;
