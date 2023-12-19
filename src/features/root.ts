import { combineReducers } from 'redux';
import modalSlice from './slices/modalSlice';
import uiSlice from './slices/uiSlice';

const rootReducer = combineReducers({
	ui: uiSlice,
	modal: modalSlice,
});

export default rootReducer;
