'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface BrokerState {
	userData: Broker.User | null;

	userStatus: Broker.Status | null;

	userRemain: Broker.Remain | null;
}

const initialState: BrokerState = {
	userData: null,

	userStatus: null,

	userRemain: null,
};

const brokerSlice = createSlice({
	name: 'broker',
	initialState,
	reducers: {
		setUserData: (state, { payload }: PayloadAction<BrokerState['userData']>) => {
			state.userData = payload;
		},

		setUserStatus: (state, { payload }: PayloadAction<BrokerState['userStatus']>) => {
			state.userStatus = payload;
		},

		setUserRemain: (state, { payload }: PayloadAction<BrokerState['userRemain']>) => {
			state.userRemain = payload;
		},
	},
});

export const { setUserData, setUserStatus, setUserRemain } = brokerSlice.actions;

export const getUserData = (state: RootState) => state.broker.userData;
export const getUserStatus = (state: RootState) => state.broker.userStatus;
export const getUserRemain = (state: RootState) => state.broker.userRemain;

export default brokerSlice.reducer;
