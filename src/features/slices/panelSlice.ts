'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface BrokerState {
	symbolInfoPanel: string | null;
}

const initialState: BrokerState = {
	symbolInfoPanel: null,
};

const brokerSlice = createSlice({
	name: 'panel',
	initialState,
	reducers: {
		setSymbolInfoPanel: (state, { payload }: PayloadAction<BrokerState['symbolInfoPanel']>) => {
			state.symbolInfoPanel = payload;
		},
	},
});

export const { setSymbolInfoPanel } = brokerSlice.actions;

export const getSymbolInfoPanel = (state: RootState) => state.panel.symbolInfoPanel;

export default brokerSlice.reducer;
