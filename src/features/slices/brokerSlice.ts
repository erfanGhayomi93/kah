'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface BrokerState {
	userInfo: Broker.User | null;

	userStatus: Broker.Status | null;

	userRemain: Broker.Remain | null;
}

const initialState: BrokerState = {
	userInfo: null,

	userStatus: null,

	userRemain: null,
};

const brokerSlice = createSlice({
	name: 'broker',
	initialState,
	reducers: {
		setUserInfo: (state, { payload }: PayloadAction<BrokerState['userInfo']>) => {
			state.userInfo = payload;
		},

		setUserStatus: (state, { payload }: PayloadAction<BrokerState['userStatus']>) => {
			state.userStatus = payload;
		},

		setUserRemain: (state, { payload }: PayloadAction<BrokerState['userRemain']>) => {
			state.userRemain = payload;
		},
	},
});

export const { setUserInfo, setUserStatus, setUserRemain } = brokerSlice.actions;

export const getUserInfo = (state: RootState) => state.broker.userInfo;
export const getUserStatus = (state: RootState) => state.broker.userStatus;
export const getUserRemain = (state: RootState) => state.broker.userRemain;

export default brokerSlice.reducer;
