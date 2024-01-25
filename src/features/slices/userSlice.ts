'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface UserState {
	loggedIn: boolean;
}

const initialState: UserState = {
	loggedIn: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setLoggedIn: (state, { payload }: PayloadAction<UserState['loggedIn']>) => {
			state.loggedIn = payload;
		},
	},
});

export const { setLoggedIn } = userSlice.actions;

export const getIsLoggedIn = (state: RootState) => state.user.loggedIn;

export default userSlice.reducer;
