import { type AppStore } from '@/features/store';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export let store: AppStore;

export const injectStore = (_store: AppStore) => {
	store = _store;
};
