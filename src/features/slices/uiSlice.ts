'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface UIState {
	manageOptionColumns: boolean;

	savedSaturnTemplates: boolean;

	saturnActiveTemplate: Saturn.Template | null;

	lsStatus: LightstreamStatus;
}

const initialState: UIState = {
	manageOptionColumns: false,

	savedSaturnTemplates: false,

	saturnActiveTemplate: null,

	lsStatus: 'CONNECTING',
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleManageOptionColumns: (state, { payload }: PayloadAction<UIState['manageOptionColumns']>) => {
			state.manageOptionColumns = payload;
		},

		toggleSavedSaturnTemplates: (state, { payload }: PayloadAction<UIState['savedSaturnTemplates']>) => {
			state.savedSaturnTemplates = payload;
		},

		setLsStatus: (state, { payload }: PayloadAction<UIState['lsStatus']>) => {
			state.lsStatus = payload;
		},

		setSaturnActiveTemplate: (state, { payload }: PayloadAction<UIState['saturnActiveTemplate']>) => {
			state.saturnActiveTemplate = payload;
		},
	},
});

export const { toggleManageOptionColumns, toggleSavedSaturnTemplates, setSaturnActiveTemplate, setLsStatus } =
	uiSlice.actions;

export const getManageOptionColumns = (state: RootState) => state.ui.manageOptionColumns;
export const getSavedSaturnTemplates = (state: RootState) => state.ui.savedSaturnTemplates;
export const getLsStatus = (state: RootState) => state.ui.lsStatus;
export const getSaturnActiveTemplate = (state: RootState) => state.ui.saturnActiveTemplate;

export default uiSlice.reducer;
