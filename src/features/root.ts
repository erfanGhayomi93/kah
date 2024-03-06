import { combineReducers } from 'redux';
import brokerSlice from './slices/brokerSlice';
import modalSlice from './slices/modalSlice';
import tabSlice from './slices/tabSlice';
import tableSlice from './slices/tableSlice';
import uiSlice from './slices/uiSlice';
import userSlice from './slices/userSlice';

const rootReducer = combineReducers({
	ui: uiSlice,
	modal: modalSlice,
	user: userSlice,
	broker: brokerSlice,
	table: tableSlice,
	tab: tabSlice,
});

export default rootReducer;
