import LocalstorageInstance from '@/classes/Localstorage';
import { initialColumnsOptionChain } from '@/constants/columns';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface ColumnState {
	optionChain: Array<IManageColumn<string>>;
	optionWatchlist: Array<IManageColumn<string>>;
}

const initialState: ColumnState = {
	optionChain: LocalstorageInstance.get('option_chain_columns', initialColumnsOptionChain),
	optionWatchlist: LocalstorageInstance.get('owc', initialColumnsOptionChain),
};

const columnSlice = createSlice({
	name: 'column',
	initialState,
	reducers: {
		setOptionChainColumns: (state, { payload }: PayloadAction<ColumnState['optionChain']>) => {
			LocalstorageInstance.set('option_chain_columns', payload);
			state.optionChain = payload;
		},

		setOptionWatchlistColumns: (state, { payload }: PayloadAction<ColumnState['optionWatchlist']>) => {
			LocalstorageInstance.set('owc', payload);
			state.optionWatchlist = payload;
		},
	},
});

export const { setOptionChainColumns, setOptionWatchlistColumns } = columnSlice.actions;

export const getOptionChainColumns = (state: RootState) => state.column.optionChain;
export const getOptionWatchlistColumns = (state: RootState) => state.column.optionWatchlist;

export default columnSlice.reducer;
