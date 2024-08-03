import LocalstorageInstance from '@/classes/Localstorage';
import { initialColumnsOptionChain } from '@/constants/columns';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface ColumnState {
	optionChain: Array<IManageColumn<string>>;
}

const initialState: ColumnState = {
	optionChain: LocalstorageInstance.get('option_chain_columns', initialColumnsOptionChain),
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		setOptionChainColumns: (state, { payload }: PayloadAction<ColumnState['optionChain']>) => {
			LocalstorageInstance.set('option_chain_columns', payload);
			state.optionChain = payload;
		},
	},
});

export const { setOptionChainColumns } = uiSlice.actions;

export const getOptionChainColumns = (state: RootState) => state.columns.optionChain;

export default uiSlice.reducer;
