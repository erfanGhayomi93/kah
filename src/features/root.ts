import { combineReducers } from 'redux';
import modalSlice from './slices/modalSlice';
import tabSlice from './slices/tabSlice';
import tableSlice from './slices/tableSlice';
import uiSlice from './slices/uiSlice';
import userSlice from './slices/userSlice';

const rootReducer = combineReducers({
	ui: uiSlice,
	modal: modalSlice,
	user: userSlice,
	table: tableSlice,
	tab: tabSlice,
});

export default rootReducer;
