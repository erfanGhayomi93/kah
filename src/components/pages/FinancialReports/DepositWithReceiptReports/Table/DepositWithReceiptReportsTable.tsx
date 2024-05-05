import AgTable from '@/components/common/Tables/AgTable';
import { defaultDepositWithReceiptReportsColumn, defaultTransactionColumns } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getDepositWithReceiptReportsColumns, setDepositWithReceiptColumns } from '@/features/slices/tableSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef, type ColumnMovedEvent, type GridApi } from '@ag-grid-community/core';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';

interface DepositWithReceiptReportsTableProps {
	reports: Reports.IDepositWithReceipt[] | null;
}

const DepositWithReceiptReportsTable = ({ reports }: DepositWithReceiptReportsTableProps) => {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const isLoggedIn = useAppSelector(getIsLoggedIn);

	const cWatchlistRef = useRef<Reports.IDepositWithReceipt[]>([]);

	const gridRef = useRef<GridApi<Reports.IDepositWithReceipt>>(null);

	const dispatch = useAppDispatch();

	const depositWithReceiptReportsColumnsIndex = useAppSelector(getDepositWithReceiptReportsColumns);

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

			const columnState = gridApi.getColumnState() as TDepositWithReceiptReportsColumnsState;
			gridApi.applyColumnState({
				state: columnState,
				applyOrder: true,
			});

			dispatch(setDepositWithReceiptColumns(columnState));
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

	const COLUMNS = useMemo<Array<ColDef<Reports.IDepositWithReceipt>>>(
		() =>
			[
				{
					headerName: t('deposit_with_receipt_page.id_column'),
					field: 'id',
					maxWidth: 112,
					minWidth: 112,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueGetter: ({ node }) => String((node?.childIndex ?? 0) + 1),
				},
				{
					headerName: t('deposit_with_receipt_page.date_column'),
					field: 'receiptDate',
					maxWidth: 144,
					minWidth: 144,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value ?? ''),
				},
				{
					headerName: t('deposit_with_receipt_page.broker_bank_column'),
					field: 'providerType',
					maxWidth: 250,
					minWidth: 250,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
				},
				{
					headerName: t('deposit_with_receipt_page.receipt_number_column'),
					field: 'receiptNumber',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					maxWidth: 250,
					minWidth: 250,
					// valueFormatter: ({ value }) => t('bank_accounts.' + value)
				},
				{
					headerName: t('deposit_with_receipt_page.price_column'),
					field: 'amount',
					maxWidth: 250,
					minWidth: 250,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
				},
				{
					headerName: t('deposit_with_receipt_page.status_column'),
					field: 'state',
					initialHide: false,
					suppressMovable: true,
					sortable: false,

					valueFormatter: ({ value }) => sepNumbers(String(value)),
				},
				{
					headerName: t('deposit_with_receipt_page.operation_column'),
					field: 'state',
					maxWidth: 200,
					minWidth: 200,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => t('states.state_' + value),
				},
			] as Array<ColDef<Reports.IDepositWithReceipt>>,
		[],
	);

	const defaultColDef: ColDef<Reports.IDepositWithReceipt> = useMemo(
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

		if (Array.isArray(depositWithReceiptReportsColumnsIndex) && depositWithReceiptReportsColumnsIndex.length > 0) {
			if (
				typeof depositWithReceiptReportsColumnsIndex[0] === 'object' &&
				'colId' in depositWithReceiptReportsColumnsIndex[0]
			) {
				gridApi.applyColumnState({ state: depositWithReceiptReportsColumnsIndex, applyOrder: true });
			} else {
				dispatch(setDepositWithReceiptColumns(defaultDepositWithReceiptReportsColumn));
				gridApi.applyColumnState({ state: defaultTransactionColumns, applyOrder: true });
			}
		}
	}, [depositWithReceiptReportsColumnsIndex]);

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

			const transaction: Record<'add' | 'remove' | 'update', Reports.IDepositWithReceipt[]> = {
				add: [],
				remove: [],
				update: [],
			};

			const cWatchlistData = cWatchlistRef.current;
			const length = Math.max(cWatchlistData.length, reports.length);
			for (let i = 0; i < length; i++) {
				const newItem = reports[i];
				if (newItem) {
					const matchingItem = cWatchlistData.find((item) => item.id === newItem.id);
					if (matchingItem) transaction.update.push(newItem);
					else transaction.add.push(newItem);
				}

				const oldItem = cWatchlistData[i];
				if (oldItem) {
					const matchingItem = reports.find((item) => item.id === oldItem.id);
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
			<AgTable<Reports.IDepositWithReceipt>
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

export default DepositWithReceiptReportsTable;
