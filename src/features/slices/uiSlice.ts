'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface UIState {
	
}

const initialState: UIState = {
	filters: {
		sort: {
			colId: 'title',
			type: 'asc',
		},
		defaultSortingType: 'asc',
	},
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
