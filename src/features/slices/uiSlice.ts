'use client';

import { createSlice } from '@reduxjs/toolkit';

export interface UIState {
	test: boolean;
}

const initialState: UIState = {
	test: true,
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		//
	},
});

// export const { setFilterValue, setFiltersValue } = uiSlice.actions;

// export const getOptionFilters = (state: RootState) => state.ui.filters;

export default uiSlice.reducer;
