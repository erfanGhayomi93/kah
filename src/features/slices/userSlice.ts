'use client';

import { getBrokerClientId } from '@/utils/cookie';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

interface IUserData {
	x: boolean;
}

export interface UserState {
	loggedIn: boolean;

	loggingIn: boolean;

	brokerIsSelected: boolean;

	userData: IUserData | null;
}

const initialState: UserState = {
	loggedIn: false,

	loggingIn: true,

	userData: null,

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

		setUserData: (state, { payload }: PayloadAction<UserState['userData']>) => {
			state.userData = payload;
		},
	},
});

export const { setIsLoggedIn, setIsLoggingIn, setBrokerIsSelected, setUserData } = userSlice.actions;

export const getIsLoggedIn = (state: RootState) => state.user.loggedIn;
export const getBrokerIsSelected = (state: RootState) => state.user.brokerIsSelected;
export const getUserData = (state: RootState) => state.user.userData;
export const getIsLoggingIn = (state: RootState) => state.user.loggingIn;

export default userSlice.reducer;
