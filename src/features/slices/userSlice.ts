import * as cookies from '@/utils/cookie';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface UserState {
	loggedIn: boolean;

	brokerIsSelected: boolean;

	orderBasket: null | OrderBasket.Root;
}

const initialState: UserState = {
	loggedIn: Boolean(cookies.getClientId()),

	brokerIsSelected: Boolean(cookies.getBrokerClientId()[0]),

	orderBasket: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setIsLoggedIn: (state, { payload }: PayloadAction<UserState['loggedIn']>) => {
			state.loggedIn = payload;
		},

		setBrokerIsSelected: (state, { payload }: PayloadAction<UserState['brokerIsSelected']>) => {
			state.brokerIsSelected = payload;
		},

		setOrderBasket: (state, { payload }: PayloadAction<UserState['orderBasket']>) => {
			state.orderBasket = payload === null ? null : payload.orders.length === 0 ? null : payload;
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
				const orders = [...state.orderBasket.orders].filter((order) => order.id !== payload);
				state.orderBasket =
					orders.length === 0
						? null
						: {
								...state.orderBasket,
								orders,
							};
			}
		},
	},
});

export const { setIsLoggedIn, setOrderBasket, setBrokerIsSelected, setOrderBasketOrders, removeOrderBasketOrder } =
	userSlice.actions;

export const getIsLoggedIn = (state: RootState) => state.user.loggedIn;
export const getBrokerIsSelected = (state: RootState) => state.user.brokerIsSelected;
export const getOrderBasket = (state: RootState) => state.user.orderBasket;

export default userSlice.reducer;
