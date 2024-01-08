'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface UIState {
	manageOptionColumns: boolean;
}

const initialState: UIState = {
	manageOptionColumns: false,
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleManageOptionColumns: (state, { payload }: PayloadAction<UIState['manageOptionColumns']>) => {
			state.manageOptionColumns = payload;
		},
	},
});

export const { toggleManageOptionColumns } = uiSlice.actions;

export const getManageOptionColumns = (state: RootState) => state.ui.manageOptionColumns;

export default uiSlice.reducer;
