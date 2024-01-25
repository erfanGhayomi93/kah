import { combineReducers } from 'redux';
import modalSlice from './slices/modalSlice';
import uiSlice from './slices/uiSlice';
import userSlice from './slices/userSlice';

const rootReducer = combineReducers({
	ui: uiSlice,
	modal: modalSlice,
	user: userSlice,
});

export default rootReducer;
