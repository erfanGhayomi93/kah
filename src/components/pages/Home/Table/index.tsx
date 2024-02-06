import { useOptionWatchlistQuery } from '@/api/queries/optionQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import AgTable from '@/components/common/Tables/AgTable';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import { defaultOptionWatchlistColumns } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getOptionWatchlistColumns, setOptionWatchlistColumns } from '@/features/slices/tableSlice';
import { useWatchlistColumns } from '@/hooks';
import dayjs from '@/libs/dayjs';
import { numFormatter, openNewTab, sepNumbers } from '@/utils/helpers';
import {
	type CellClickedEvent,
	type ColDef,
	type ColumnMovedEvent,
	type GridApi,
	type ICellRendererParams,
} from '@ag-grid-community/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import ActionColumn from './ActionColumn';
import ManageWatchlistColumns from './ManageWatchlistColumns';
import NoData from './NoData';

interface TableProps {
	filters: Partial<IOptionWatchlistFilters>;
	setFilters: React.Dispatch<React.SetStateAction<Partial<IOptionWatchlistFilters>>>;
}

const Table = ({ filters, setFilters }: TableProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const watchlistColumnsIndex = useAppSelector(getOptionWatchlistColumns);

	const cWatchlistRef = useRef<Option.Root[]>([]);

	const gridRef = useRef<GridApi<Option.Root>>(null);

	const { data: watchlistData, isFetching } = useOptionWatchlistQuery({
		queryKey: ['optionWatchlistQuery', { ...filters, pageNumber: 1, pageSize: 25 }],
		refetchInterval: 3e5,
	});

	const { data: watchlistColumns } = useWatchlistColumns();

	const dateFormatter = (v: string | number) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD');
	};

	const addSymbol = () => {
		//
	};

	const onFiltersChanged = (newFilters: IOptionWatchlistFilters) => {
		setFilters(newFilters);
	};

	const onSymbolTitleClicked = ({ data }: CellClickedEvent<Option.Root>) => {
		try {
			if (!data) return;

			const { symbolISIN, baseSymbolISIN } = data.symbolInfo;

			if (baseSymbolISIN && symbolISIN)
				openNewTab('/fa/saturn', `symbolISIN=${baseSymbolISIN}&contractISIN=${symbolISIN}`);
		} catch (e) {
			//
		}
	};

	const onColumnMoved = ({ finished, toIndex }: ColumnMovedEvent<Option.Root>) => {
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

			const columnState = gridApi.getColumnState() as TOptionWatchlistColumnsState;
			gridApi.applyColumnState({
				state: columnState,
				applyOrder: true,
			});

			dispatch(setOptionWatchlistColumns(columnState));
		} catch (e) {
			//
		}
	};

	const modifiedWatchlistColumns = useMemo(() => {
		const result: Record<string, Option.Column> = {};

		try {
			if (!watchlistColumns) return result;

			for (let i = 0; i < watchlistColumns.length; i++) {
				const item = watchlistColumns[i];
				result[item.title] = item;
			}

			return result;
		} catch (e) {
			return result;
		}
	}, [JSON.stringify(watchlistColumns)]);

	const COLUMNS = useMemo(
		() =>
			[
				{
					headerName: 'نماد',
					colId: 'symbolTitle',
					initialHide: Boolean(modifiedWatchlistColumns?.symbolTitle?.isHidden ?? true),
					minWidth: 128,
					pinned: 'right',
					lockPosition: true,
					suppressMovable: true,
					cellClass: 'cursor-pointer',
					onCellClicked: onSymbolTitleClicked,
					valueGetter: ({ data }) => data!.symbolInfo.symbolTitle,
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				},
				{
					headerName: 'ارزش معاملات',
					colId: 'tradeValue',
					initialHide: Boolean(modifiedWatchlistColumns?.tradeValue?.isHidden ?? true),
					minWidth: 120,
					initialSort: 'desc',
					valueGetter: ({ data }) => data!.optionWatchlistData.tradeValue,
					valueFormatter: ({ value }) => numFormatter(value),
				},
				{
					headerName: 'آخرین قیمت',
					colId: 'premium',
					initialHide: Boolean(modifiedWatchlistColumns?.premium?.isHidden ?? true),
					minWidth: 128,
					cellRenderer: CellPercentRenderer,
					cellRendererParams: ({ data }: ICellRendererParams<Option.Root, number>) => ({
						percent: data ? data.optionWatchlistData.premium : 0,
					}),
					valueGetter: ({ data }) =>
						`${data!.optionWatchlistData.premium}|${data!.optionWatchlistData.premium}`,
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'دلتا',
					colId: 'delta',
					initialHide: Boolean(modifiedWatchlistColumns?.delta?.isHidden ?? true),
					minWidth: 56,
					valueGetter: ({ data }) => data!.optionWatchlistData.delta,
				},
				{
					headerName: 'آخرین قیمت پایه',
					colId: 'baseSymbolPrice',
					initialHide: Boolean(modifiedWatchlistColumns?.baseSymbolPrice?.isHidden ?? true),
					minWidth: 136,
					cellRenderer: CellPercentRenderer,
					cellRendererParams: ({ data }: ICellRendererParams<Option.Root, number>) => ({
						percent: data ? data.optionWatchlistData.baseSymbolPrice : 0,
					}),
					valueGetter: ({ data }) =>
						`${data!.optionWatchlistData.baseSymbolPrice}|${data!.optionWatchlistData.baseSymbolPrice}`,
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'سر به سر',
					colId: 'breakEvenPoint',
					initialHide: Boolean(modifiedWatchlistColumns?.breakEvenPoint?.isHidden ?? true),
					minWidth: 96,
					valueGetter: ({ data }) => String(data!.optionWatchlistData.breakEvenPoint),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'اهرم',
					colId: 'leverage',
					initialHide: Boolean(modifiedWatchlistColumns?.leverage?.isHidden ?? true),
					minWidth: 64,
					valueGetter: ({ data }) => String(data!.optionWatchlistData.leverage),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'موقعیت‌های باز',
					colId: 'openPositionCount',
					initialHide: Boolean(modifiedWatchlistColumns?.openPositionCount?.isHidden ?? true),
					minWidth: 128,
					valueGetter: ({ data }) => String(data!.optionWatchlistData.openPositionCount),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'IV',
					colId: 'impliedVolatility',
					initialHide: Boolean(modifiedWatchlistColumns?.impliedVolatility?.isHidden ?? true),
					minWidth: 96,
					valueGetter: ({ data }) => {
						const value = Number(data!.optionWatchlistData.impliedVolatility);
						if (isNaN(value)) return '−';

						return value.toFixed(2);
					},
				},
				{
					headerName: 'وضعیت',
					colId: 'iotm',
					initialHide: Boolean(modifiedWatchlistColumns?.iotm?.isHidden ?? true),
					minWidth: 96,
					cellClass: ({ value }) => {
						switch (value) {
							case 'ITM':
								return 'text-success-100';
							case 'OTM':
								return 'text-error-100';
							case 'ATM':
								return 'text-secondary-300';
							default:
								return '';
						}
					},
					valueGetter: ({ data }) => data!.optionWatchlistData.iotm,
				},
				{
					headerName: 'بلک شولز',
					colId: 'blackScholes',
					initialHide: Boolean(modifiedWatchlistColumns?.blackScholes?.isHidden ?? true),
					minWidth: 144,
					valueGetter: ({ data }) => String(data!.optionWatchlistData.blackScholes),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'حجم',
					colId: 'tradeVolume',
					initialHide: Boolean(modifiedWatchlistColumns?.tradeVolume?.isHidden ?? true),
					minWidth: 104,
					valueGetter: ({ data }) => String(data!.optionWatchlistData.tradeVolume),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'روز مانده',
					colId: 'dueDays',
					initialHide: Boolean(modifiedWatchlistColumns?.dueDays?.isHidden ?? true),
					minWidth: 96,
					valueGetter: ({ data }) => data!.symbolInfo.dueDays,
				},
				{
					headerName: 'قیمت اعمال',
					colId: 'strikePrice',
					initialHide: Boolean(modifiedWatchlistColumns?.strikePrice?.isHidden ?? true),
					minWidth: 112,
					valueGetter: ({ data }) => String(data!.symbolInfo.strikePrice),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'بهترین خرید',
					colId: 'bestBuyPrice',
					initialHide: Boolean(modifiedWatchlistColumns?.bestBuyPrice?.isHidden ?? true),
					minWidth: 112,
					cellStyle: {
						backgroundColor: 'rgba(12, 175, 130, 0.12)',
					},
					valueGetter: ({ data }) => String(data!.optionWatchlistData.bestBuyPrice),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'بهترین فروش',
					colId: 'bestSellPrice',
					initialHide: Boolean(modifiedWatchlistColumns?.bestSellPrice?.isHidden ?? true),
					minWidth: 120,
					cellStyle: {
						backgroundColor: 'rgba(254, 57, 87, 0.12)',
					},
					valueGetter: ({ data }) => String(data!.optionWatchlistData.bestSellPrice),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				/* {
				headerName: 'نام کامل آپشن',
				colId: 'symbolFullTitle',
				minWidth: 120,
				initialHide: Boolean(modifiedWatchlistColumns?.symbolTitle?.isHidden ?? true),
				valueGetter: ({ data }) => data!.symbolInfo.symbolTitle,
			}, */
				{
					headerName: 'نام پایه',
					colId: 'baseSymbolTitle',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.baseSymbolTitle?.isHidden ?? true),
					valueGetter: ({ data }) => data!.symbolInfo.baseSymbolTitle,
				},
				{
					headerName: 'قیمت پایانی',
					colId: 'closingPrice',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.closingPrice?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.closingPrice),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'نوسان پذیری',
					colId: 'historicalVolatility',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.historicalVolatility?.isHidden ?? true),
					valueGetter: ({ data }) => {
						const value = Number(data!.optionWatchlistData.impliedVolatility);
						if (isNaN(value)) return '−';

						return value.toFixed(2);
					},
				},
				{
					headerName: 'اندازه قرارداد',
					colId: 'contractSize',
					minWidth: 112,
					initialHide: Boolean(modifiedWatchlistColumns?.contractSize?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.symbolInfo.contractSize),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'ارزش زمانی',
					colId: 'timeValue',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.timeValue?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.timeValue),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'تتا',
					colId: 'theta',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.theta?.isHidden ?? true),
					valueGetter: ({ data }) => data!.optionWatchlistData.theta,
				},
				{
					headerName: 'تعداد معاملات روز',
					colId: 'tradeCount',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.tradeCount?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.tradeCount),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'تاریخ سررسید',
					colId: 'contractEndDate',
					minWidth: 120,
					initialHide: Boolean(modifiedWatchlistColumns?.contractEndDate?.isHidden ?? true),
					valueGetter: ({ data }) => data!.symbolInfo.contractEndDate,
					valueFormatter: ({ value }) => dateFormatter(value),
				},
				{
					headerName: 'شکاف',
					colId: 'spread',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.spread?.isHidden ?? true),
					valueGetter: ({ data }) => data!.optionWatchlistData.spread,
				},
				{
					headerName: 'اختلاف با بلک شولز',
					colId: 'blackScholesDifference',
					minWidth: 144,
					initialHide: Boolean(modifiedWatchlistColumns?.blackScholesDifference?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.blackScholesDifference),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'قیمت پایانی پایه',
					colId: 'baseClosingPrice',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.baseClosingPrice?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.baseClosingPrice),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'گاما',
					colId: 'gamma',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.gamma?.isHidden ?? true),
					valueGetter: ({ data }) => data!.optionWatchlistData.gamma,
				},
				{
					headerName: 'نوع آپشن',
					colId: 'optionType',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.optionType?.isHidden ?? true),
					cellClass: ({ value }) => {
						switch (value) {
							case 'Call':
								return 'text-success-100';
							case 'Put':
								return 'text-error-100';
							default:
								return 'text-gray-900';
						}
					},
					valueGetter: ({ data }) => data!.symbolInfo.optionType,
					valueFormatter: ({ value }) => {
						switch (value) {
							case 'Call':
								return t('side.buy');
							case 'Put':
								return t('side.sell');
							default:
								return '−';
						}
					},
				},
				{
					headerName: 'وجه تضمین لازم',
					colId: 'requiredMargin',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.requiredMargin?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.requiredMargin),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'وجه تضمین اولیه',
					colId: 'initialMargin',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.initialMargin?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.symbolInfo.initialMargin),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'رو',
					colId: 'rho',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.rho?.isHidden ?? true),
					valueGetter: ({ data }) => data!.optionWatchlistData.rho,
				},
				{
					headerName: 'وگا',
					colId: 'vega',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.vega?.isHidden ?? true),
					valueGetter: ({ data }) => data!.optionWatchlistData.vega,
				},
				{
					headerName: 'رشد',
					colId: 'growth',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.growth?.isHidden ?? true),
					valueGetter: ({ data }) => data!.optionWatchlistData.growth,
				},
				{
					headerName: 'پر ارزش',
					colId: 'contractValueType',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.contractValueType?.isHidden ?? true),
					valueGetter: ({ data }) => data!.optionWatchlistData.contractValueType,
				},
				{
					headerName: 'موقعیت‌های باز زیاد',
					colId: 'highOpenPosition',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.highOpenPosition?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.highOpenPosition),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'تاریخ آخرین معامله',
					colId: 'lastTradeDate',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.lastTradeDate?.isHidden ?? true),
					valueGetter: ({ data }) => data!.optionWatchlistData.lastTradeDate,
					valueFormatter: ({ value }) => dateFormatter(value),
				},
				{
					headerName: 'حجم خرید حقوقی',
					colId: 'legalBuyVolume',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.legalBuyVolume?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.legalBuyVolume),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'حجم خرید حقیقی',
					colId: 'individualBuyVolume',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.individualBuyVolume?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.individualBuyVolume),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'حجم فروش حقوقی',
					colId: 'legalSellVolume',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.legalSellVolume?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.legalSellVolume),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'حجم فروش حقیقی',
					colId: 'individualSellVolume',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.individualSellVolume?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.individualSellVolume),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'صنعت',
					colId: 'sectorName',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.sectorName?.isHidden ?? true),
					valueGetter: ({ data }) => data!.symbolInfo.sectorName,
				},
				{
					headerName: 'ارزش مفهومی معاملات',
					colId: 'notionalValue',
					minWidth: 160,
					initialHide: Boolean(modifiedWatchlistColumns?.notionalValue?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.notionalValue),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'ارزش ذاتی',
					colId: 'intrinsicValue',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.intrinsicValue?.isHidden ?? true),
					valueGetter: ({ data }) => String(data!.optionWatchlistData.intrinsicValue),
					valueFormatter: ({ value }) => sepNumbers(value),
				},
				{
					headerName: 'عملیات',
					colId: 'action',
					initialHide: Boolean(modifiedWatchlistColumns?.action?.isHidden ?? true),
					minWidth: 80,
					maxWidth: 80,
					pinned: 'left',
					sortable: false,
					cellRenderer: ActionColumn,
				},
			] as Array<ColDef<Option.Root>>,
		[],
	);

	const defaultColDef: ColDef<Option.Root> = useMemo(
		() => ({
			sortable: true,
			resizable: false,
			flex: 1,
		}),
		[],
	);

	useLayoutEffect(() => {
		ipcMain.handle<IOptionWatchlistFilters>('set_option_watchlist_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_option_watchlist_filters');
		};
	}, []);

	useLayoutEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		if (Array.isArray(watchlistColumnsIndex) && watchlistColumnsIndex.length > 0) {
			if (typeof watchlistColumnsIndex[0] === 'object' && 'colId' in watchlistColumnsIndex[0]) {
				gridApi.applyColumnState({ state: watchlistColumnsIndex, applyOrder: true });
			} else {
				dispatch(setOptionWatchlistColumns(defaultOptionWatchlistColumns));
				gridApi.applyColumnState({ state: defaultOptionWatchlistColumns, applyOrder: true });
			}
		}
	}, [watchlistColumnsIndex]);

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid || !watchlistColumns) return;

		try {
			for (let i = 0; i < watchlistColumns.length; i++) {
				const { isHidden, title } = watchlistColumns[i];

				eGrid.setColumnVisible(title, !isHidden);
			}
		} catch (e) {
			//
		}
	}, [watchlistColumns]);

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid) return;

		try {
			const dataIsEmpty = !Array.isArray(watchlistData) || watchlistData.length === 0;

			eGrid.setGridOption('suppressHorizontalScroll', dataIsEmpty);

			if (dataIsEmpty) {
				eGrid.setGridOption('rowData', []);
				cWatchlistRef.current = [];

				return;
			}

			const transaction: Record<'add' | 'remove' | 'update', Option.Root[]> = {
				add: [],
				remove: [],
				update: [],
			};

			const cWatchlistData = cWatchlistRef.current;
			const length = Math.max(cWatchlistData.length, watchlistData.length);
			for (let i = 0; i < length; i++) {
				const newItem = watchlistData[i];
				if (newItem) {
					const matchingItem = cWatchlistData.find(
						(item) => item.symbolInfo.symbolISIN === newItem.symbolInfo.symbolISIN,
					);
					if (matchingItem) transaction.update.push(newItem);
					else transaction.add.push(newItem);
				}

				const oldItem = cWatchlistData[i];
				if (oldItem) {
					const matchingItem = watchlistData.find(
						(item) => item.symbolInfo.symbolISIN === oldItem.symbolInfo.symbolISIN,
					);
					if (!matchingItem) transaction.remove.push(oldItem);
				}
			}

			eGrid.applyTransactionAsync(transaction);
			cWatchlistRef.current = watchlistData;
		} catch (e) {
			//
		}
	}, [JSON.stringify(watchlistData)]);

	const dataIsEmpty = !Array.isArray(watchlistData) || watchlistData.length === 0;

	return (
		<div
			style={{
				height: 'calc(100vh - 18rem)',
			}}
			className='relative'
		>
			<AgTable
				ref={gridRef}
				alwaysShowVerticalScroll
				suppressHorizontalScroll={dataIsEmpty}
				className={clsx('h-full', dataIsEmpty && 'overflow-hidden rounded border border-gray-500')}
				rowData={[]}
				columnDefs={COLUMNS}
				defaultColDef={defaultColDef}
				onColumnMoved={onColumnMoved}
				onSortChanged={() => storeColumns()}
				getRowId={({ data }) => data!.symbolInfo.symbolISIN}
				onColumnVisible={({ api, column }) => {
					try {
						if (!column) return;

						const colId = column.getColId();

						api.ensureColumnVisible(colId);
						api.flashCells({
							columns: [colId],
						});
					} catch (e) {
						//
					}
				}}
			/>

			{isFetching && (
				<div style={{ backdropFilter: 'blur(1px)' }} className='absolute left-0 top-0 h-full w-full'>
					<Loading />
				</div>
			)}

			<ManageWatchlistColumns />

			{dataIsEmpty && !isFetching && <NoData key='no-data' onAddSymbol={addSymbol} />}
		</div>
	);
};

export default Table;
