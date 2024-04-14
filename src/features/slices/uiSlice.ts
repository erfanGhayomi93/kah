'use client';

import LocalstorageInstance from '@/classes/Localstorage';
import { initialSymbolInfoPanelGrid } from '@/constants';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface UIState {
	sidebarIsExpand: boolean;

	saturnActiveTemplate: Saturn.Template | null;

	lsStatus: LightstreamStatus;

	ordersIsExpand: boolean;

	symbolInfoPanelGridLayout: ISymbolInfoPanelGrid[];
}

const initialState: UIState = {
	ordersIsExpand: false,

	sidebarIsExpand: false,

	saturnActiveTemplate: null,

	lsStatus: 'CONNECTING',

	symbolInfoPanelGridLayout: LocalstorageInstance.get('sipg', initialSymbolInfoPanelGrid, (v) => Array.isArray(v)),
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleSidebar: (state, { payload }: PayloadAction<UIState['sidebarIsExpand']>) => {
			state.sidebarIsExpand = payload;
		},

		setLsStatus: (state, { payload }: PayloadAction<UIState['lsStatus']>) => {
			state.lsStatus = payload;
		},

		setSaturnActiveTemplate: (state, { payload }: PayloadAction<UIState['saturnActiveTemplate']>) => {
			state.saturnActiveTemplate = payload;
		},

		setOrdersIsExpand: (state, { payload }: PayloadAction<UIState['ordersIsExpand']>) => {
			state.ordersIsExpand = payload;
		},

		setSymbolInfoPanelGridLayout: (state, { payload }: PayloadAction<UIState['symbolInfoPanelGridLayout']>) => {
			LocalstorageInstance.set('sipg', payload);
			state.symbolInfoPanelGridLayout = payload;
		},

		toggleOrdersIsExpand: (state) => {
			state.ordersIsExpand = !state.ordersIsExpand;
		},
	},
});

export const {
	setSaturnActiveTemplate,
	toggleSidebar,
	toggleOrdersIsExpand,
	setOrdersIsExpand,
	setLsStatus,
	setSymbolInfoPanelGridLayout,
} = uiSlice.actions;

export const getSidebarIsExpand = (state: RootState) => state.ui.sidebarIsExpand;
export const getOrdersIsExpand = (state: RootState) => state.ui.ordersIsExpand;
export const getLsStatus = (state: RootState) => state.ui.lsStatus;
export const getSaturnActiveTemplate = (state: RootState) => state.ui.saturnActiveTemplate;
export const getSymbolInfoPanelGridLayout = (state: RootState) => state.ui.symbolInfoPanelGridLayout;

export default uiSlice.reducer;
