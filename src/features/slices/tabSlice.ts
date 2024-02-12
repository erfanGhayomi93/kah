'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface TabState {
	optionWatchlistTabId: number;
}

const initialState: TabState = {
	optionWatchlistTabId: -1,
};

const portfolioSlice = createSlice({
	name: 'tab',
	initialState,
	reducers: {
		setOptionWatchlistTabId: (state, { payload }: PayloadAction<TabState['optionWatchlistTabId']>) => {
			state.optionWatchlistTabId = payload;
		},
	},
});

export const { setOptionWatchlistTabId } = portfolioSlice.actions;

export const getOptionWatchlistTabId = (state: RootState) => state.tab.optionWatchlistTabId;

export default portfolioSlice.reducer;
