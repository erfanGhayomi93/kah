import LocalstorageInstance from '@/classes/Localstorage';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface TableState {
	optionWatchlistColumnsState: TOptionWatchlistColumnsState;
}

const initialState: TableState = {
	optionWatchlistColumnsState: LocalstorageInstance.get<TOptionWatchlistColumnsState>('owcs', []),
};

const tableSlice = createSlice({
	name: 'table',
	initialState,
	reducers: {
		setOptionWatchlistColumnsState: (
			state,
			{ payload }: PayloadAction<TableState['optionWatchlistColumnsState']>,
		) => {
			LocalstorageInstance.set('owcs', payload);
			state.optionWatchlistColumnsState = payload;
		},
	},
});

export const { setOptionWatchlistColumnsState } = tableSlice.actions;

export const getOptionWatchlistColumnsState = (state: RootState) => state.table.optionWatchlistColumnsState;

export default tableSlice.reducer;
