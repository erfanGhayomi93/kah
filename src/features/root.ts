import { combineReducers } from 'redux';
import uiSlice from './slices/uiSlice';

const rootReducer = combineReducers({
	ui: uiSlice,
});

export default rootReducer;
