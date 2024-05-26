'use client';

import { injectStore } from '@/api/inject-store';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root';

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

injectStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
