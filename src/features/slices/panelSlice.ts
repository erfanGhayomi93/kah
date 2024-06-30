import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '../store';
import { type PanelState } from './types/panelSlice.interfaces';

const initialState: PanelState = {
	savedTemplates: false,

	symbolInfoPanel: null,

	manageTransactionColumnsPanel: false,

	manageInstantDepositColumnsPanel: false,
};

const brokerSlice = createSlice({
	name: 'panel',
	initialState,
	reducers: {
		setSymbolInfoPanel: (state, { payload }: PayloadAction<PanelState['symbolInfoPanel']>) => {
			if (payload !== undefined) state.symbolInfoPanel = payload;
		},

		setSavedTemplatesPanel: (state, { payload }: PayloadAction<PanelState['savedTemplates']>) => {
			state.savedTemplates = payload;
		},

		setManageTransactionColumnsPanel: (
			state,
			{ payload }: PayloadAction<PanelState['manageTransactionColumnsPanel']>,
		) => {
			state.manageTransactionColumnsPanel = payload;
		},

		setManageInstantDepositColumnsPanel: (
			state,
			{ payload }: PayloadAction<PanelState['manageInstantDepositColumnsPanel']>,
		) => {
			state.manageInstantDepositColumnsPanel = payload;
		},
	},
});

export const {
	setSymbolInfoPanel,
	setSavedTemplatesPanel,
	setManageTransactionColumnsPanel,
	setManageInstantDepositColumnsPanel,
} = brokerSlice.actions;

export const getSymbolInfoPanel = (state: RootState) => state.panel.symbolInfoPanel;
export const getSavedTemplatesPanel = (state: RootState) => state.panel.savedTemplates;
export const getManageTransactionColumnsPanel = (state: RootState) => state.panel.manageTransactionColumnsPanel;
export const getManageInstantDepositColumnsPanel = (state: RootState) => state.panel.manageInstantDepositColumnsPanel;

export default brokerSlice.reducer;
