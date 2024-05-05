'use client';

import LocalstorageInstance from '@/classes/Localstorage';
import { defaultDepositWithReceiptReportsColumn, defaultInstantDepositReportsColumn, defaultOptionWatchlistColumns, defaultTransactionColumns } from '@/constants';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';

export interface TableState {
	optionWatchlistColumns: TOptionWatchlistColumnsState;
	transactionsColumns: TTransactionColumnsState;
	instantDepositColumns: TInstantDepositColumnsState;
	depositWithReceiptReportsColumns: TDepositWithReceiptReportsColumnsState;
}

const initialState: TableState = {
	optionWatchlistColumns: LocalstorageInstance.get<TOptionWatchlistColumnsState>(
		'owci',
		defaultOptionWatchlistColumns,
	),

	transactionsColumns: LocalstorageInstance.get<TTransactionColumnsState>(
		'transaction_column',
		defaultTransactionColumns,
	),

	instantDepositColumns: LocalstorageInstance.get<TInstantDepositColumnsState>(
		'instant_deposit_column',
		defaultInstantDepositReportsColumn,
	),

	depositWithReceiptReportsColumns: LocalstorageInstance.get<TDepositWithReceiptReportsColumnsState>(
		'deposit_with_receipt_column',
		defaultDepositWithReceiptReportsColumn,
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

		setTransactionsColumns: (state, { payload }: PayloadAction<TableState['transactionsColumns']>) => {
			LocalstorageInstance.set('transaction_column', payload);
			state.transactionsColumns = payload;
		},

		setInstantDepositColumns: (state, { payload }: PayloadAction<TableState['instantDepositColumns']>) => {
			LocalstorageInstance.set('instant_deposit_column', payload);
			state.instantDepositColumns = payload;
		},

		setDepositWithReceiptColumns: (state, { payload }: PayloadAction<TableState['depositWithReceiptReportsColumns']>) => {
			LocalstorageInstance.set('deposit_with_receipt_column', payload);
			state.depositWithReceiptReportsColumns = payload;
		},
	},
});

export const { setOptionWatchlistColumns, setTransactionsColumns, setInstantDepositColumns, setDepositWithReceiptColumns } = tableSlice.actions;

export const getOptionWatchlistColumns = (state: RootState) => state.table.optionWatchlistColumns;
export const getTransactionsColumns = (state: RootState) => state.table.transactionsColumns;
export const getInstantDepositColumns = (state: RootState) => state.table.instantDepositColumns;
export const getDepositWithReceiptReportsColumns = (state: RootState) => state.table.depositWithReceiptReportsColumns;

export default tableSlice.reducer;
