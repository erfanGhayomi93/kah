'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface UIState {
	manageOptionColumns: boolean;

	lsStatus: LightstreamStatus;
}

const initialState: UIState = {
	manageOptionColumns: false,

	lsStatus: 'CONNECTING',
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleManageOptionColumns: (state, { payload }: PayloadAction<UIState['manageOptionColumns']>) => {
			state.manageOptionColumns = payload;
		},

		setLsStatus: (state, { payload }: PayloadAction<UIState['lsStatus']>) => {
			state.lsStatus = payload;
		},
	},
});

export const { toggleManageOptionColumns, setLsStatus } = uiSlice.actions;

export const getManageOptionColumns = (state: RootState) => state.ui.manageOptionColumns;
export const getLsStatus = (state: RootState) => state.ui.lsStatus;

export default uiSlice.reducer;
