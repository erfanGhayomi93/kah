'use client';

import { getBrokerClientId, getClientId } from '@/utils/cookie';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface UserState {
	loggedIn: boolean;

	loggingIn: boolean;

	brokerIsSelected: boolean;

	orderBasket: null | OrderBasket.Root;
}

const initialState: UserState = {
	loggedIn: Boolean(getClientId()),

	loggingIn: true,

	brokerIsSelected: Boolean(getBrokerClientId()[0]),

	orderBasket: null,
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

		setOrderBasket: (state, { payload }: PayloadAction<UserState['orderBasket']>) => {
			state.orderBasket = payload;
		},

		setOrderBasketOrders: (state, { payload }: PayloadAction<OrderBasket.Order[]>) => {
			if (state.orderBasket !== null) {
				state.orderBasket = {
					...state.orderBasket,
					orders: payload,
				};
			}
		},

		removeOrderBasketOrder: (state, { payload }: PayloadAction<string>) => {
			if (state.orderBasket !== null) {
				const orders = [...state.orderBasket.orders];
				state.orderBasket = {
					...state.orderBasket,
					orders: orders.filter((order) => order.id !== payload),
				};
			}
		},
	},
});

export const {
	setIsLoggedIn,
	setIsLoggingIn,
	setOrderBasket,
	setBrokerIsSelected,
	setOrderBasketOrders,
	removeOrderBasketOrder,
} = userSlice.actions;

export const getIsLoggedIn = (state: RootState) => state.user.loggedIn;
export const getBrokerIsSelected = (state: RootState) => state.user.brokerIsSelected;
export const getIsLoggingIn = (state: RootState) => state.user.loggingIn;
export const getOrderBasket = (state: RootState) => state.user.orderBasket;

export default userSlice.reducer;
