'use client';

import LocalstorageInstance from '@/classes/Localstorage';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface UIState {
	manageOptionColumns: boolean;

	sidebarIsExpand: boolean;

	savedSaturnTemplates: boolean;

	saturnActiveTemplate: Saturn.Template | null;

	lsStatus: LightstreamStatus;

	ordersIsExpand: boolean;
}

const initialState: UIState = {
	manageOptionColumns: false,

	savedSaturnTemplates: false,

	ordersIsExpand: false,

	sidebarIsExpand: Boolean(LocalstorageInstance.get('s', false)),

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

		toggleSidebar: (state, { payload }: PayloadAction<UIState['sidebarIsExpand']>) => {
			LocalstorageInstance.set('s', payload);
			state.sidebarIsExpand = payload;
		},

		setLsStatus: (state, { payload }: PayloadAction<UIState['lsStatus']>) => {
			state.lsStatus = payload;
		},

		setSaturnActiveTemplate: (state, { payload }: PayloadAction<UIState['saturnActiveTemplate']>) => {
			state.saturnActiveTemplate = payload;
		},

		toggleOrdersIsExpand: (state) => {
			state.ordersIsExpand = !state.ordersIsExpand;
		},
	},
});

export const {
	toggleManageOptionColumns,
	toggleSavedSaturnTemplates,
	setSaturnActiveTemplate,
	toggleSidebar,
	toggleOrdersIsExpand,
	setLsStatus,
} = uiSlice.actions;

export const getSidebarIsExpand = (state: RootState) => state.ui.sidebarIsExpand;
export const getOrdersIsExpand = (state: RootState) => state.ui.ordersIsExpand;
export const getManageOptionColumns = (state: RootState) => state.ui.manageOptionColumns;
export const getSavedSaturnTemplates = (state: RootState) => state.ui.savedSaturnTemplates;
export const getLsStatus = (state: RootState) => state.ui.lsStatus;
export const getSaturnActiveTemplate = (state: RootState) => state.ui.saturnActiveTemplate;

export default uiSlice.reducer;
