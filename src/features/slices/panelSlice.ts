'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface BrokerState {
	manageWatchlistColumns: boolean;

	savedTemplates: boolean;

	symbolInfoPanel: string | null;

	manageTransactionColumnsPanel: boolean;

	manageInstantDepositColumnsPanel: boolean;
}

const initialState: BrokerState = {
	manageWatchlistColumns: false,

	savedTemplates: false,

	symbolInfoPanel: null,

	manageTransactionColumnsPanel: false,

	manageInstantDepositColumnsPanel: false,
};

const brokerSlice = createSlice({
	name: 'panel',
	initialState,
	reducers: {
		setSymbolInfoPanel: (state, { payload }: PayloadAction<BrokerState['symbolInfoPanel']>) => {
			if (payload !== undefined) state.symbolInfoPanel = payload;
		},

		setSavedTemplatesPanel: (state, { payload }: PayloadAction<BrokerState['savedTemplates']>) => {
			state.savedTemplates = payload;
		},

		setManageWatchlistColumnsPanel: (state, { payload }: PayloadAction<BrokerState['manageWatchlistColumns']>) => {
			state.manageWatchlistColumns = payload;
		},

		setManageTransactionColumnsPanel: (state, { payload }: PayloadAction<BrokerState['manageTransactionColumnsPanel']>) => {
			state.manageTransactionColumnsPanel = payload;
		},

		setManageInstantDepositColumnsPanel: (state, { payload }: PayloadAction<BrokerState['manageInstantDepositColumnsPanel']>) => {
			state.manageInstantDepositColumnsPanel = payload;
		},
	},
});

export const { setSymbolInfoPanel, setSavedTemplatesPanel, setManageWatchlistColumnsPanel, setManageTransactionColumnsPanel, setManageInstantDepositColumnsPanel } = brokerSlice.actions;

export const getManageWatchlistColumnsPanel = (state: RootState) => state.panel.manageWatchlistColumns;
export const getSymbolInfoPanel = (state: RootState) => state.panel.symbolInfoPanel;
export const getSavedTemplatesPanel = (state: RootState) => state.panel.savedTemplates;
export const getManageTransactionColumnsPanel = (state: RootState) => state.panel.manageTransactionColumnsPanel;
export const getManageInstantDepositColumnsPanel = (state: RootState) => state.panel.manageInstantDepositColumnsPanel;

export default brokerSlice.reducer;
