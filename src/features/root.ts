import { combineReducers } from 'redux';
import brokerSlice from './slices/brokerSlice';
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
	panel: panelSlice,
	broker: brokerSlice,
	table: tableSlice,
	tab: tabSlice,
});

export default rootReducer;
