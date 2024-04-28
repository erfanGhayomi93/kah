'use client';

import LocalstorageInstance from '@/classes/Localstorage';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

interface IOptionWatchlistTabIdPayload {
	id: TabState['optionWatchlistTabId'];

	updateLS: boolean;
}

export interface TabState {
	optionWatchlistTabId: number;
	strategyTrend: TStrategyMarketTrend;
}

const initialState: TabState = {
	optionWatchlistTabId: Number(LocalstorageInstance.get('awl', -1)) || -1,
	strategyTrend: 'all',
};

const portfolioSlice = createSlice({
	name: 'tab',
	initialState,
	reducers: {
		setOptionWatchlistTabId: (
			state,
			{ payload }: PayloadAction<IOptionWatchlistTabIdPayload | TabState['optionWatchlistTabId']>,
		) => {
			if (typeof payload === 'number') {
				LocalstorageInstance.set('awl', payload);
				state.optionWatchlistTabId = payload;
			} else {
				if (payload.updateLS) LocalstorageInstance.set('awl', payload);
				state.optionWatchlistTabId = payload.id;
			}
		},

		setStrategyTrend: (state, { payload }: PayloadAction<TabState['strategyTrend']>) => {
			state.strategyTrend = payload;
		},
	},
});

export const { setOptionWatchlistTabId, setStrategyTrend } = portfolioSlice.actions;

export const getOptionWatchlistTabId = (state: RootState) => state.tab.optionWatchlistTabId;
export const getStrategyTrend = (state: RootState) => state.tab.strategyTrend;

export default portfolioSlice.reducer;
