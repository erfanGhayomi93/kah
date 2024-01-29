'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface UserState {
	loggedIn: boolean;
	loggingIn: boolean;
}

const initialState: UserState = {
	loggedIn: false,
	loggingIn: true,
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
	},
});

export const { setIsLoggedIn, setIsLoggingIn } = userSlice.actions;

export const getIsLoggedIn = (state: RootState) => state.user.loggedIn;
export const getIsLoggingIn = (state: RootState) => state.user.loggingIn;

export default userSlice.reducer;
