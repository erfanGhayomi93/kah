import LocalstorageInstance from '@/classes/Localstorage';
import { defaultOptionWatchlistColumns } from '@/constants';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface TableState {
	optionWatchlistColumns: TOptionWatchlistColumnsState;
}

const initialState: TableState = {
	optionWatchlistColumns: LocalstorageInstance.get<TOptionWatchlistColumnsState>(
		'owci',
		defaultOptionWatchlistColumns,
	),
};

const tableSlice = createSlice({
	name: 'table',
	initialState,
	reducers: {
		setOptionWatchlistColumns: (state, { payload }: PayloadAction<TableState['optionWatchlistColumns']>) => {
			LocalstorageInstance.set('owci', payload);
			state.optionWatchlistColumns = payload;
		},
	},
});

export const { setOptionWatchlistColumns } = tableSlice.actions;

export const getOptionWatchlistColumns = (state: RootState) => state.table.optionWatchlistColumns;
export default tableSlice.reducer;
