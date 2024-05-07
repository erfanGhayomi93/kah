'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';
import { type PanelState } from './types/panelSlice.interfaces';

const initialState: PanelState = {
	manageWatchlistColumns: false,

	savedTemplates: false,

	symbolInfoPanel: null,

	manageTransactionColumnsPanel: false,

	manageInstantDepositColumnsPanel: false,

	manageColumns: null,
};

const brokerSlice = createSlice({
	name: 'panel',
	initialState,
	reducers: {
		setSymbolInfoPanel: (state, { payload }: PayloadAction<PanelState['symbolInfoPanel']>) => {
			if (payload !== undefined) state.symbolInfoPanel = payload;
		},

		setSavedTemplatesPanel: (state, { payload }: PayloadAction<PanelState['savedTemplates']>) => {
			state.savedTemplates = payload;
		},

		setManageWatchlistColumnsPanel: (state, { payload }: PayloadAction<PanelState['manageWatchlistColumns']>) => {
			state.manageWatchlistColumns = payload;
		},

		setManageTransactionColumnsPanel: (
			state,
			{ payload }: PayloadAction<PanelState['manageTransactionColumnsPanel']>,
		) => {
			state.manageTransactionColumnsPanel = payload;
		},

		setManageInstantDepositColumnsPanel: (
			state,
			{ payload }: PayloadAction<PanelState['manageInstantDepositColumnsPanel']>,
		) => {
			state.manageInstantDepositColumnsPanel = payload;
		},

		setManageColumnsPanel: (state, { payload }: PayloadAction<PanelState['manageColumns']>) => {
			state.manageColumns = payload;
		},
	},
});

export const {
	setSymbolInfoPanel,
	setSavedTemplatesPanel,
	setManageWatchlistColumnsPanel,
	setManageTransactionColumnsPanel,
	setManageInstantDepositColumnsPanel,
	setManageColumnsPanel,
} = brokerSlice.actions;

export const getManageWatchlistColumnsPanel = (state: RootState) => state.panel.manageWatchlistColumns;
export const getSymbolInfoPanel = (state: RootState) => state.panel.symbolInfoPanel;
export const getSavedTemplatesPanel = (state: RootState) => state.panel.savedTemplates;
export const getManageTransactionColumnsPanel = (state: RootState) => state.panel.manageTransactionColumnsPanel;
export const getManageInstantDepositColumnsPanel = (state: RootState) => state.panel.manageInstantDepositColumnsPanel;
export const getManageColumnsPanel = (state: RootState) => state.panel.manageColumns;

export default brokerSlice.reducer;
