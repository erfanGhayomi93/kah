'use client';

import LocalstorageInstance from '@/classes/Localstorage';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface TabState {
	optionWatchlistTabId: number;
}

const initialState: TabState = {
	optionWatchlistTabId: Number(LocalstorageInstance.get('awl', -1)) || -1,
};

const portfolioSlice = createSlice({
	name: 'tab',
	initialState,
	reducers: {
		setOptionWatchlistTabId: (state, { payload }: PayloadAction<TabState['optionWatchlistTabId']>) => {
			LocalstorageInstance.set('awl', payload);
			state.optionWatchlistTabId = payload;
		},
	},
});

export const { setOptionWatchlistTabId } = portfolioSlice.actions;

export const getOptionWatchlistTabId = (state: RootState) => state.tab.optionWatchlistTabId;

export default portfolioSlice.reducer;
