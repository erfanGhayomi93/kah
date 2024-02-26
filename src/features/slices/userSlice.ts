'use client';

import { getBrokerClientId, getClientId } from '@/utils/cookie';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface UserState {
	loggedIn: boolean;

	loggingIn: boolean;

	brokerIsSelected: boolean;
}

const initialState: UserState = {
	loggedIn: Boolean(getClientId()),

	loggingIn: true,

	brokerIsSelected: Boolean(getBrokerClientId()),
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setIsLoggedIn: (state, { payload }: PayloadAction<UserState['loggedIn']>) => {
			state.loggedIn = payload;
		},

		setIsLoggingIn: (state, { payload }: PayloadAction<UserState['loggingIn']>) => {
			state.loggingIn = payload;
		},

		setBrokerIsSelected: (state, { payload }: PayloadAction<UserState['brokerIsSelected']>) => {
			state.brokerIsSelected = payload;
		},
	},
});

export const { setIsLoggedIn, setIsLoggingIn, setBrokerIsSelected } = userSlice.actions;

export const getIsLoggedIn = (state: RootState) => state.user.loggedIn;
export const getBrokerIsSelected = (state: RootState) => state.user.brokerIsSelected;
export const getIsLoggingIn = (state: RootState) => state.user.loggingIn;

export default userSlice.reducer;
