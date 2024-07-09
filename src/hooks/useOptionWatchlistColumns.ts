import { useResetOptionWatchlistMutation, useUpdateOptionWatchlistMutation } from '@/api/mutations/optionMutations';
import { useDefaultOptionSymbolColumnsQuery, useOptionSymbolColumnsQuery } from '@/api/queries/optionQueries';
import ipcMain from '@/classes/IpcMain';
import LocalstorageInstance from '@/classes/Localstorage';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setOptionWatchlistColumns } from '@/features/slices/tableSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import { useEffect, useMemo, useState } from 'react';

const useOptionWatchlistColumns = () => {
	const dispatch = useAppDispatch();

	const isLoggedIn = useAppSelector(getIsLoggedIn);

	const [columns, setColumns] = useState<Option.Column[]>([]);

	const {
		data: userColumnsData,
		isLoading: isLoadingUserColumnsData,
		isError: isErrorUserColumnsData,
	} = useOptionSymbolColumnsQuery({
		queryKey: ['optionSymbolColumnsQuery'],
		enabled: isLoggedIn,
	});

	const {
		data: defaultColumnsData,
		isLoading: isLoadingDefaultColumnsData,
		isError: isErrorDefaultColumnsData,
	} = useDefaultOptionSymbolColumnsQuery({
		queryKey: ['defaultOptionSymbolColumnsQuery'],
	});

	const { mutate: resetColumns } = useResetOptionWatchlistMutation();

	const { mutate: hiddenWatchlistColumn } = useUpdateOptionWatchlistMutation();

	const resetColumnsToDefault = () => {
		if (isLoggedIn) resetColumns();

		if (!Array.isArray(defaultColumnsData)) return;

		LocalstorageInstance.set('owc', defaultColumnsData);

		setColumns(defaultColumnsData ?? []);
		ipcMain.send('set_option_watchlist_columns', defaultColumnsData);
	};

	const hideSingleColumn = (id: number, isHidden: boolean) => {
		if (isLoggedIn) {
			hiddenWatchlistColumn({ id, isHidden });
		}

		const newColumnsData = [...columns];
		const specifyColumnIndex = newColumnsData.findIndex((col) => col.id === id);

		newColumnsData[specifyColumnIndex].isHidden = isHidden;
		newColumnsData.sort((a, b) => a.order - b.order);

		LocalstorageInstance.set('owc', newColumnsData);

		ipcMain.send('set_option_watchlist_columns', newColumnsData);

		setColumns(newColumnsData);
		dispatch(setOptionWatchlistColumns(newColumnsData.map((item) => ({ colId: item.title }))));
	};

	const hideGroupColumns = (updatedColumns: IManageColumn[]) => {
		const cols: Record<string, boolean> = {};
		for (let i = 0; i < columns.length; i++) {
			const col = updatedColumns[i];
			cols[col.id] = col.hidden;
		}

		const newColumnsData = [...columns];
		for (let i = 0; i < newColumnsData.length; i++) {
			const col = newColumnsData[i];
			if (col.title in cols) newColumnsData[i].isHidden = Boolean(cols[col.title]);
		}

		LocalstorageInstance.set('owc', newColumnsData);

		ipcMain.send('set_option_watchlist_columns', newColumnsData);

		setColumns(newColumnsData);
		dispatch(setOptionWatchlistColumns(newColumnsData.map((item) => ({ colId: item.title }))));
	};

	const defaultOptionWatchlistColumns = useMemo<TOptionWatchlistColumnsState>(() => {
		if (!Array.isArray(defaultColumnsData)) return [];

		const data = [...defaultColumnsData];
		data.sort((a, b) => a.order - b.order);

		return data.map((item) => ({
			colId: item.title,
		}));
	}, [defaultColumnsData]);

	useEffect(() => {
		const removeHandler = ipcMain.handle('set_option_watchlist_columns', setColumns);
		return () => {
			removeHandler();
		};
	}, []);

	useEffect(() => {
		if (isLoggedIn) {
			setColumns(userColumnsData ?? []);
			return;
		}

		const storedDefaultColumnsData = LocalstorageInstance.get<Option.Column[]>('owc', []);

		setColumns(
			Array.isArray(storedDefaultColumnsData) && storedDefaultColumnsData.length > 3
				? storedDefaultColumnsData
				: defaultColumnsData ?? [],
		);
	}, [isLoggedIn, userColumnsData, defaultColumnsData]);

	return {
		watchlistColumns: columns ?? [],
		defaultColumns: defaultColumnsData ?? [],
		defaultOptionWatchlistColumns,
		isLoading: isLoadingUserColumnsData ?? isLoadingDefaultColumnsData,
		hasError: isErrorUserColumnsData ?? isErrorDefaultColumnsData,
		resetColumnsToDefault,
		hideSingleColumn,
		hideGroupColumns,
	};
};

export default useOptionWatchlistColumns;
