'use client';

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root';

export const store = () =>
	configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
	});

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
