import LocalstorageInstance from '@/classes/Localstorage';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

interface IOptionWatchlistTabIdPayload {
	id: TabState['optionWatchlistTabId'];
	updateLS: boolean;
}

export interface TabState {
	optionWatchlistTabId: number;
	ordersActiveTab: TOrdersTab;
}

const initialState: TabState = {
	optionWatchlistTabId: Number(LocalstorageInstance.get('awl', -1)) || -1,

	ordersActiveTab: LocalstorageInstance.get<TOrdersTab>('ot', 'open_orders'),
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

		setOrdersActiveTab: (state, { payload }: PayloadAction<TabState['ordersActiveTab']>) => {
			LocalstorageInstance.get<TOrdersTab>('ot', payload);
			state.ordersActiveTab = payload;
		},
	},
});

export const { setOptionWatchlistTabId, setOrdersActiveTab } = portfolioSlice.actions;

export const getOptionWatchlistTabId = (state: RootState) => state.tab.optionWatchlistTabId;
export const getOrdersActiveTab = (state: RootState) => state.tab.ordersActiveTab;

export default portfolioSlice.reducer;
