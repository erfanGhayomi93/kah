'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface ModalState {
	authenticationModal: boolean;
}

const initialState: ModalState = {
	authenticationModal: false,
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		toggleAuthenticationModal: (state, { payload }: PayloadAction<ModalState['authenticationModal']>) => {
			state.authenticationModal = payload;
		},
	},
});

export const { toggleAuthenticationModal } = modalSlice.actions;

export const getAuthenticationModal = (state: RootState) => state.modal.authenticationModal;

export default modalSlice.reducer;
