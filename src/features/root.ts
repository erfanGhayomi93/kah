import { combineReducers } from 'redux';
import brokerSlice from './slices/brokerSlice';
import columnSlice from './slices/columnSlice';
import modalSlice from './slices/modalSlice';
import panelSlice from './slices/panelSlice';
import tabSlice from './slices/tabSlice';
import tableSlice from './slices/tableSlice';
import uiSlice from './slices/uiSlice';
import userSlice from './slices/userSlice';

const rootReducer = combineReducers({
	user: userSlice,
	ui: uiSlice,
	modal: modalSlice,
	columns: columnSlice,
	panel: panelSlice,
	broker: brokerSlice,
	table: tableSlice,
	tab: tabSlice,
});

export default rootReducer;
