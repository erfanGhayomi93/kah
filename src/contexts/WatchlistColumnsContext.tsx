'use client';

import axios from '@/api/axios';
import routes from '@/api/routes';
import LocalstorageInstance from '@/classes/Localstorage';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getIsLoggedIn, setIsLoggedIn, setIsLoggingIn } from '@/features/slices/userSlice';
import { createContext, useLayoutEffect, useRef, useState } from 'react';

type TSetDataFn<T> = (id: number, isHidden: boolean) => T;

interface IWatchlistColumnsContext {
	data: Option.Column[];
	setHiddenColumn: TSetDataFn<void>;
	setColumns: (data: Option.Column[]) => void;
	resetColumns: () => Promise<Option.Column[]>;
}

const defaultParams: IWatchlistColumnsContext = {
	data: LocalstorageInstance.get<Option.Column[]>('option_watchlist_columns', []),
	setColumns: () => {},
	setHiddenColumn: () => {},
	resetColumns: () =>
		new Promise<Option.Column[]>((resolve) => {
			resolve([]);
		}),
};

export const WatchlistColumnsContext = createContext<IWatchlistColumnsContext>(defaultParams);

const WatchlistColumnsProvider = ({ children }: { children: React.ReactNode }) => {
	const fetched = useRef<null | 'user' | 'default'>(null);

	const dispatch = useAppDispatch();

	const isLoggedIn = useAppSelector(getIsLoggedIn);

	const [data, setData] = useState<Option.Column[]>(defaultParams.data);

	const fetchUserColumns = async () => {
		try {
			const response = await axios.get<ServerResponse<Option.Column[]>>(
				routes.optionWatchlist.OptionSymbolColumns,
				{},
			);
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			dispatch(setIsLoggedIn(true));
			setData(data.result);

			fetched.current = 'user';
		} catch (e) {
			dispatch(setIsLoggedIn(false));
			fetchDefaultColumns();
		} finally {
			dispatch(setIsLoggingIn(false));
		}
	};

	const fetchDefaultColumns = async () => {
		try {
			const storedData = LocalstorageInstance.get<Option.Column[]>('option_watchlist_columns', []);
			if (storedData && Array.isArray(storedData) && storedData.length > 0 && 'isHidden' in storedData[0]) {
				setData(storedData);
			} else {
				const response = await axios.get<ServerResponse<Option.Column[]>>(
					routes.optionWatchlist.DefaultOptionSymbolColumns,
				);
				const { data } = response;

				if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

				setData(data.result);
			}
		} catch (e) {
			//
		} finally {
			dispatch(setIsLoggingIn(false));
		}
	};

	const updateLocalstorage: TSetDataFn<void> = async (id, isHidden) => {
		setData((prevData) => {
			try {
				const newColumnsData = [...prevData] as Option.Column[];

				const specifyColumnIndex = newColumnsData.findIndex((col) => col.id === id);

				newColumnsData[specifyColumnIndex].isHidden = isHidden;

				LocalstorageInstance.set('option_watchlist_columns', newColumnsData);

				return newColumnsData;
			} catch (e) {
				return prevData;
			}
		});
	};

	const updateService: TSetDataFn<void> = async (id, isHidden) => {
		try {
			updateLocalstorage(id, isHidden);

			const response = await axios.post<ServerResponse<boolean>>(
				routes.optionWatchlist.UpdateOptionSymbolColumns,
				{
					id,
					isHidden,
				},
			);
			const { data } = response;

			if (response.status === 401) dispatch(setIsLoggedIn(false));

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');
		} catch (e) {
			//
		}
	};

	const setHiddenColumn: TSetDataFn<void> = (id, isHidden) => {
		try {
			if (isLoggedIn) {
				updateService(id, isHidden);
				return;
			}

			updateLocalstorage(id, isHidden);
		} catch (e) {
			//
		}
	};

	const setColumns = (columns: Option.Column[]) => {
		try {
			setData(columns);
			LocalstorageInstance.set('option_watchlist_columns', data);
		} catch (e) {
			//
		}
	};

	const resetColumns = () =>
		new Promise<Option.Column[]>(async (resolve, reject) => {
			try {
				let result: Option.Column[] = [];

				if (isLoggedIn) {
					await axios.post<ServerResponse<boolean>>(routes.optionWatchlist.ResetOptionSymbolColumns);

					const response = await axios.get<ServerResponse<Option.Column[]>>(
						routes.optionWatchlist.OptionSymbolColumns,
						{},
					);
					const { data } = response;

					if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

					result = data.result;
				} else {
					const response = await axios.get<ServerResponse<Option.Column[]>>(
						routes.optionWatchlist.DefaultOptionSymbolColumns,
					);
					const { data } = response;

					if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

					result = data.result;
				}

				setData(result);
				resolve(result);
			} catch (e) {
				reject();
			}
		});

	useLayoutEffect(() => {
		if (fetched.current === null || (isLoggedIn && fetched.current !== 'user')) fetchUserColumns();
		else if (!isLoggedIn && fetched.current !== 'default') fetchDefaultColumns();
	}, [isLoggedIn]);

	return (
		<WatchlistColumnsContext.Provider value={{ data, setColumns, resetColumns, setHiddenColumn }}>
			{children}
		</WatchlistColumnsContext.Provider>
	);
};

export default WatchlistColumnsProvider;
