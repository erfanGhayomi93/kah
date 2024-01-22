'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface UIState {
	manageOptionColumns: boolean;
	loggedIn: boolean;
}

const initialState: UIState = {
	manageOptionColumns: false,
	loggedIn: false,
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleManageOptionColumns: (state, { payload }: PayloadAction<UIState['manageOptionColumns']>) => {
			state.manageOptionColumns = payload;
		},

		setLoggedIn: (state, { payload }: PayloadAction<UIState['loggedIn']>) => {
			state.loggedIn = payload;
		},
	},
});

export const { toggleManageOptionColumns, setLoggedIn } = uiSlice.actions;

export const getManageOptionColumns = (state: RootState) => state.ui.manageOptionColumns;
export const getLoggedIn = (state: RootState) => state.ui.loggedIn;

export default uiSlice.reducer;
