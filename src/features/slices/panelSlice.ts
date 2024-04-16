'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface BrokerState {
	manageWatchlistColumns: boolean;

	savedTemplates: boolean;

	symbolInfoPanel: string | null;
}

const initialState: BrokerState = {
	manageWatchlistColumns: false,

	savedTemplates: false,

	symbolInfoPanel: null,
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
	},
});

export const { setSymbolInfoPanel, setSavedTemplatesPanel, setManageWatchlistColumnsPanel } = brokerSlice.actions;

export const getManageWatchlistColumnsPanel = (state: RootState) => state.panel.manageWatchlistColumns;
export const getSymbolInfoPanel = (state: RootState) => state.panel.symbolInfoPanel;
export const getSavedTemplatesPanel = (state: RootState) => state.panel.savedTemplates;

export default brokerSlice.reducer;
