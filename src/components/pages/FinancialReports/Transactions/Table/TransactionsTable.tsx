import AgTable from '@/components/common/Tables/AgTable';
import { defaultTransactionColumns } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getTransactionsColumns, setTransactionsColumns } from '@/features/slices/tableSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import {
	type ColDef,
	type ColumnMovedEvent,
	type GridApi
} from '@ag-grid-community/core';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';

interface WatchlistTableProps {
	reports: Reports.ITransactions[] | null;
	finalRemain: number;
	lastTrades: number;
}

const TransactionsTable = ({ reports, finalRemain, lastTrades }: WatchlistTableProps) => {

	const t = useTranslations();

	const queryClient = useQueryClient();

	const isLoggedIn = useAppSelector(getIsLoggedIn);

	const cWatchlistRef = useRef<Reports.ITransactions[]>([]);

	const gridRef = useRef<GridApi<Reports.ITransactions>>(null);

	const dispatch = useAppDispatch();

	const transactionColumnIndex = useAppSelector(getTransactionsColumns);

	// const { data: watchlistColumns } = useWatchlistColumns();

	const onColumnMoved = ({ finished, toIndex }: ColumnMovedEvent<Reports.ITransactions>) => {
		try {
			if (!finished || toIndex === undefined) return;
			storeColumns();
		} catch (e) {
			//
		}
	};

	const storeColumns = () => {
		try {
			const gridApi = gridRef.current;
			if (!gridApi) return;

			const columnState = gridApi.getColumnState() as TTransactionColumnsState;
			gridApi.applyColumnState({
				state: columnState,
				applyOrder: true,
			});

			dispatch(setTransactionsColumns(columnState));
		} catch (e) {
			//
		}
	};

	const dateFormatter = (v: string | number) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD');
	};

	// const onDelete = async (symbol: Option.Root) => {
	// 	try {
	// 		if (!isLoggedIn) {
	// 			toast.error(t('alerts.login_to_your_account'));
	// 			dispatch(setLoginModal({}));
	// 			return;
	// 		}

	// 		const { symbolISIN, symbolTitle } = symbol.symbolInfo;

	// 		try {
	// 			const gridApi = gridRef.current;
	// 			if (gridApi) {
	// 				const queryKey = ['optionWatchlistQuery', { watchlistId: id ?? -1 }];

	// 				queryClient.setQueriesData(
	// 					{
	// 						exact: false,
	// 						queryKey,
	// 					},
	// 					(c) => {
	// 						return (c as Option.Root[]).filter((item) => item.symbolInfo.symbolISIN !== symbolISIN);
	// 					},
	// 				);
	// 			}
	// 		} catch (e) {
	// 			//
	// 		}

	// 		await brokerAxios.post(routes.optionWatchlist.RemoveSymbolCustomWatchlist, {
	// 			id,
	// 			symbolISIN,
	// 		});

	// 		const toastId = 'watchlist_symbol_removed_successfully';
	// 		if (toast.isActive(toastId)) {
	// 			toast.update(toastId, {
	// 				render: t('alerts.watchlist_symbol_removed_successfully', { symbolTitle }),
	// 				autoClose: 2500,
	// 			});
	// 		} else {
	// 			toast.success(t('alerts.watchlist_symbol_removed_successfully', { symbolTitle }), {
	// 				toastId: 'watchlist_symbol_removed_successfully',
	// 				autoClose: 2500,
	// 			});
	// 		}
	// 	} catch (e) {
	// 		//
	// 	}
	// };

	// const onAdd = (symbol: Option.Root) => {
	// 	if (!isLoggedIn) {
	// 		toast.error(t('alerts.login_to_your_account'));
	// 		dispatch(setLoginModal({}));
	// 		return;
	// 	}

	// 	const { symbolISIN, symbolTitle } = symbol.symbolInfo;

	// 	dispatch(
	// 		setMoveSymbolToWatchlistModal({
	// 			symbolISIN,
	// 			symbolTitle,
	// 		}),
	// 	);
	// };

	// const modifiedWatchlistColumns = useMemo(() => {
	// 	const result: Record<string, Option.Column> = {};

	// 	try {
	// 		if (!watchlistColumns) return result;

	// 		for (let i = 0; i < watchlistColumns.length; i++) {
	// 			const item = watchlistColumns[i];
	// 			result[item.title] = item;
	// 		}

	// 		return result;
	// 	} catch (e) {
	// 		return result;
	// 	}
	// }, [JSON.stringify(watchlistColumns)]);

	const COLUMNS = useMemo<Array<ColDef<Reports.ITransactions>>>(
		() =>
			[
				{
					headerName: t('transactions_reports_page.id_column'),
					field: 'symbolIsin',
					pinned: 'right',
					maxWidth: 96,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueGetter: ({ node }) => String((node?.childIndex ?? 0) + 1),
				},
				{
					headerName: t('transactions_reports_page.date_column'),
					field: 'date',
					maxWidth: 96,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value ?? ''),
				},
				{
					headerName: t('transactions_reports_page.operator_column'),
					field: 'transactionType',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ data }) => t('transactions_reports_page.operator_type_' + data?.transactionType),
					cellClass: ({ data }) => {
						switch (data?.transactionType) {
							case 'Buy':
								return 'text-success-100';
							case 'Sell':
								return 'text-error-100';
							default:
								return 'text-text-100';
						}
					},
				},
				{
					headerName: t('transactions_reports_page.description_column'),
					field: 'description',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					minWidth: 144,
					valueFormatter: ({ data }) => (data?.description === 'payfast-1561') ? t('transactions_reports_page.payfast') : data?.description,
				},
				{
					headerName: t('transactions_reports_page.debit_column'),
					field: 'debit',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellClass: ({ value }) => clsx('ltr', {
						'text-error-100': value < 0
					}),
					valueFormatter: ({ data }) => (Number(data?.debit)) >= 0 ? sepNumbers(String(data?.debit)) : `(${sepNumbers(String(data?.debit))})`,
				},
				{
					headerName: t('transactions_reports_page.credit_column'),
					field: 'credit',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellClass: ({ data }) => clsx('ltr', {
						'text-error-100': (Number(data?.credit)) < 0,
					}),
					valueFormatter: ({ data }) => (Number(data?.credit)) >= 0 ? sepNumbers(String(data?.credit)) : `(${sepNumbers(String(data?.credit))})`,

				},
				{
					headerName: t('transactions_reports_page.remain_column'),
					field: 'remaining',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellClass: ({ data }) => clsx('ltr', ((Number(data?.remaining)) > 0) ? 'text-success-400' : 'text-error-300'),
					valueFormatter: ({ data }) => (Number(data?.remaining)) >= 0 ? sepNumbers(String(data?.remaining)) : `(${sepNumbers(String(data?.remaining))})`,
				},
				{
					headerName: t('transactions_reports_page.station_column'),
					field: 'station',
					maxWidth: 144,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
				}
			] as Array<ColDef<Reports.ITransactions>>,
		[],
	);

	const defaultColDef: ColDef<Reports.ITransactions> = useMemo(
		() => ({
			sortable: true,
			resizable: false,
			flex: 1,
		}),
		[],
	);

	// useEffect(() => {
	// 	const gridApi = gridRef.current;
	// 	if (!gridApi) return;

	// 	const actionColumn = gridApi.getColumn('action');
	// 	if (!actionColumn) return;

	// 	const colDef: ColDef<Option.Root> = {
	// 		headerName: t('option_page.action'),
	// 		colId: 'action',
	// 		initialHide: Boolean(modifiedWatchlistColumns?.action?.isHidden ?? true),
	// 		minWidth: 80,
	// 		maxWidth: 80,
	// 		pinned: 'left',
	// 		hide: false,
	// 		sortable: false,
	// 		resizable: false,
	// 		cellRenderer: ActionColumn,
	// 		cellRendererParams: {
	// 			onAdd,
	// 			onDelete,
	// 			addable: true,
	// 			deletable: id > -1,
	// 		},
	// 	};

	// 	actionColumn.setColDef(colDef, colDef, 'api');
	// }, [id]);

	useEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		if (Array.isArray(transactionColumnIndex) && transactionColumnIndex.length > 0) {
			if (typeof transactionColumnIndex[0] === 'object' && 'colId' in transactionColumnIndex[0]) {
				gridApi.applyColumnState({ state: transactionColumnIndex, applyOrder: true });
			} else {
				dispatch(setTransactionsColumns(defaultTransactionColumns));
				gridApi.applyColumnState({ state: defaultTransactionColumns, applyOrder: true });
			}
		}
	}, [transactionColumnIndex]);

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid) return;

		try {
			const dataIsEmpty = !Array.isArray(reports) || reports.length === 0;

			if (dataIsEmpty) {
				eGrid.setGridOption('rowData', []);
				cWatchlistRef.current = [];

				return;
			}

			const transaction: Record<'add' | 'remove' | 'update', Reports.ITransactions[]> = {
				add: [],
				remove: [],
				update: [],
			};

			const cWatchlistData = cWatchlistRef.current;
			const length = Math.max(cWatchlistData.length, reports.length);
			for (let i = 0; i < length; i++) {
				const newItem = reports[i];
				if (newItem) {
					const matchingItem = cWatchlistData.find(
						(item) => item.symbolIsin === newItem.symbolIsin,
					);
					if (matchingItem) transaction.update.push(newItem);
					else transaction.add.push(newItem);
				}

				const oldItem = cWatchlistData[i];
				if (oldItem) {
					const matchingItem = reports.find(
						(item) => item.symbolIsin === oldItem.symbolIsin,
					);
					if (!matchingItem) transaction.remove.push(oldItem);
				}
			}

			eGrid.applyTransactionAsync(transaction);
			cWatchlistRef.current = reports;
		} catch (e) {
			//
		}
	}, [JSON.stringify(reports)]);

	// useEffect(() => {
	// 	const eGrid = gridRef.current;
	// 	if (!eGrid || !watchlistColumns) return;

	// 	try {
	// 		for (let i = 0; i < watchlistColumns.length; i++) {
	// 			const { isHidden, title } = watchlistColumns[i];
	// 			eGrid.setColumnsVisible([title], !isHidden);
	// 		}
	// 	} catch (e) {
	// 		//
	// 	}
	// }, [watchlistColumns]);

	const dataIsEmpty = !Array.isArray(reports) || reports.length === 0;



	return (
		<>
			<AgTable<Reports.ITransactions>
				ref={gridRef}
				rowData={reports}
				rowHeight={40}
				headerHeight={48}
				columnDefs={COLUMNS}
				defaultColDef={defaultColDef}
				suppressRowClickSelection={false}
				className='h-full border-0'
			/>
		</>
	);
};

export default TransactionsTable;
