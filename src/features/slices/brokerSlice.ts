import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface BrokerState {
	urls: IBrokerUrls | null;
}

const initialState: BrokerState = {
	urls: null,
};

const brokerSlice = createSlice({
	name: 'broker',
	initialState,
	reducers: {
		setBrokerURLs: (state, { payload }: PayloadAction<BrokerState['urls']>) => {
			state.urls = payload;
		},
	},
});

export const { setBrokerURLs } = brokerSlice.actions;

export const getBrokerURLs = (state: RootState) => state.broker.urls;

export default brokerSlice.reducer;
