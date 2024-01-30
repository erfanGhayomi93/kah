import { useOptionWatchlistQuery } from '@/api/queries/optionQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import AgTable from '@/components/common/Tables/AgTable';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import { useWatchlistColumns } from '@/hooks';
import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import clsx from 'clsx';
import { useEffect, useMemo, useRef } from 'react';
import ActionColumn from './ActionColumn';
import ManageWatchlistColumns from './ManageWatchlistColumns';
import NoData from './NoData';

interface TableProps {
	filters: Partial<IOptionWatchlistFilters>;
	setFilters: React.Dispatch<React.SetStateAction<Partial<IOptionWatchlistFilters>>>;
}

const Table = ({ filters, setFilters }: TableProps) => {
	const cWatchlistRef = useRef<Option.Root[]>([]);

	const gridRef = useRef<GridApi<Option.Root>>(null);

	const { data: watchlistData, isFetching } = useOptionWatchlistQuery({
		queryKey: ['optionWatchlistQuery', { ...filters, pageNumber: 1, pageSize: 25 }],
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

	const COLUMNS: Array<ColDef<Option.Root>> = useMemo(
		() => [
			{
				headerName: 'نماد',
				colId: 'symbolTitle',
				initialHide: Boolean(modifiedWatchlistColumns?.symbolTitle?.isHidden ?? true),
				minWidth: 128,
				pinned: 'right',
				valueGetter: ({ data }) => data!.symbolInfo.symbolTitle,
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},
			{
				headerName: 'ارزش معاملات',
				colId: 'tradeValue',
				initialHide: Boolean(modifiedWatchlistColumns?.tradeValue?.isHidden ?? true),
				minWidth: 120,
				initialSort: 'desc',
				valueGetter: ({ data }) => numFormatter(data!.optionWatchlistData.tradeValue),
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
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.premium)),
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
				minWidth: 128,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Option.Root, number>) => ({
					percent: data ? data.optionWatchlistData.baseSymbolPrice : 0,
				}),
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.baseSymbolPrice)),
			},
			{
				headerName: 'سر به سر',
				colId: 'breakEvenPoint',
				initialHide: Boolean(modifiedWatchlistColumns?.breakEvenPoint?.isHidden ?? true),
				minWidth: 96,
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.breakEvenPoint)),
			},
			{
				headerName: 'اهرم',
				colId: 'leverage',
				initialHide: Boolean(modifiedWatchlistColumns?.leverage?.isHidden ?? true),
				minWidth: 64,
				valueGetter: ({ data }) => data!.optionWatchlistData.leverage,
			},
			{
				headerName: 'موقعیت‌های باز',
				colId: 'openPositionCount',
				initialHide: Boolean(modifiedWatchlistColumns?.openPositionCount?.isHidden ?? true),
				minWidth: 120,
				valueGetter: ({ data }) => data!.optionWatchlistData.openPositionCount,
			},
			{
				headerName: 'IV',
				colId: 'impliedVolatility',
				initialHide: Boolean(modifiedWatchlistColumns?.impliedVolatility?.isHidden ?? true),
				minWidth: 64,
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
					switch (value.toLowerCase()) {
						case 'atm':
							return 'text-success-100';
						case 'otm':
							return 'text-error-100';
						case 'itm':
							return 'text-primary-100';
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
				valueGetter: ({ data }) => data!.optionWatchlistData.blackScholes,
			},
			{
				headerName: 'حجم',
				colId: 'tradeVolume',
				initialHide: Boolean(modifiedWatchlistColumns?.tradeVolume?.isHidden ?? true),
				minWidth: 104,
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.tradeVolume)),
			},
			{
				headerName: 'روز مانده',
				colId: 'dueDays',
				initialHide: Boolean(modifiedWatchlistColumns?.dueDays?.isHidden ?? true),
				minWidth: 72,
				valueGetter: ({ data }) => data!.symbolInfo.dueDays,
			},
			{
				headerName: 'قیمت اعمال',
				colId: 'strikePrice',
				initialHide: Boolean(modifiedWatchlistColumns?.strikePrice?.isHidden ?? true),
				minWidth: 96,
				valueGetter: ({ data }) => sepNumbers(String(data!.symbolInfo.strikePrice)),
			},
			{
				headerName: 'بهترین خرید',
				colId: 'bestBuyPrice',
				initialHide: Boolean(modifiedWatchlistColumns?.bestBuyPrice?.isHidden ?? true),
				minWidth: 112,
				cellStyle: {
					backgroundColor: 'rgba(25, 135, 84, 0.1)',
				},
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.bestBuyPrice)),
			},
			{
				headerName: 'بهترین فروش',
				colId: 'bestSellPrice',
				initialHide: Boolean(modifiedWatchlistColumns?.bestSellPrice?.isHidden ?? true),
				minWidth: 112,
				cellStyle: {
					backgroundColor: 'rgba(220, 53, 69, 0.1)',
				},
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.bestSellPrice)),
			},
			{
				headerName: 'نام کامل آپشن',
				colId: 'symbolTitle',
				minWidth: 120,
				initialHide: Boolean(modifiedWatchlistColumns?.symbolTitle?.isHidden ?? true),
				valueGetter: ({ data }) => data!.symbolInfo.symbolTitle,
			},
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
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.closingPrice)),
			},
			{
				headerName: 'نوسان پذیری',
				colId: 'historicalVolatility',
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.historicalVolatility?.isHidden ?? true),
				valueGetter: ({ data }) => data!.optionWatchlistData.historicalVolatility,
			},
			{
				headerName: 'اندازه قرارداد',
				colId: 'contractSize',
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.contractSize?.isHidden ?? true),
				valueGetter: ({ data }) => sepNumbers(String(data!.symbolInfo.contractSize)),
			},
			{
				headerName: 'ارزش زمانی',
				colId: 'timeValue',
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.timeValue?.isHidden ?? true),
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.timeValue)),
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
				valueGetter: ({ data }) => data!.optionWatchlistData.tradeCount,
			},
			{
				headerName: 'تاریخ سررسید',
				colId: 'contractEndDate',
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.contractEndDate?.isHidden ?? true),
				valueGetter: ({ data }) => dateFormatter(data!.symbolInfo.contractEndDate),
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
				valueGetter: ({ data }) => data!.optionWatchlistData.blackScholesDifference,
			},
			{
				headerName: 'قیمت پایانی پایه',
				colId: 'baseClosingPrice',
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.baseClosingPrice?.isHidden ?? true),
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.baseClosingPrice)),
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
				valueGetter: ({ data }) => data!.symbolInfo.optionType,
			},
			{
				headerName: 'وجه تضمین لازم',
				colId: 'requiredMargin',
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.requiredMargin?.isHidden ?? true),
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.requiredMargin)),
			},
			{
				headerName: 'وجه تضمین اولیه',
				colId: 'initialMargin',
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.initialMargin?.isHidden ?? true),
				valueGetter: ({ data }) => sepNumbers(String(data!.symbolInfo.initialMargin)),
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
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.highOpenPosition)),
			},
			{
				headerName: 'تاریخ آخرین معامله',
				colId: 'lastTradeDate',
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.lastTradeDate?.isHidden ?? true),
				valueGetter: ({ data }) => dateFormatter(data!.optionWatchlistData.lastTradeDate),
			},
			{
				headerName: 'حجم خرید حقوقی',
				colId: 'legalBuyVolume',
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.legalBuyVolume?.isHidden ?? true),
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.legalBuyVolume)),
			},
			{
				headerName: 'حجم خرید حقیقی',
				colId: 'individualBuyVolume',
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.individualBuyVolume?.isHidden ?? true),
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.individualBuyVolume)),
			},
			{
				headerName: 'حجم فروش حقوقی',
				colId: 'legalSellVolume',
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.legalSellVolume?.isHidden ?? true),
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.legalSellVolume)),
			},
			{
				headerName: 'حجم فروش حقیقی',
				colId: 'individualSellVolume',
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.individualSellVolume?.isHidden ?? true),
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.individualSellVolume)),
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
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.notionalValue)),
			},
			{
				headerName: 'ارزش ذاتی',
				colId: 'intrinsicValue',
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.intrinsicValue?.isHidden ?? true),
				valueGetter: ({ data }) => sepNumbers(String(data!.optionWatchlistData.intrinsicValue)),
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
		],
		[],
	);

	const defaultColDef: ColDef<Option.Root> = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			flex: 1,
		}),
		[],
	);

	useEffect(() => {
		ipcMain.handle<IOptionWatchlistFilters>('set_option_watchlist_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_option_watchlist_filters');
		};
	}, []);

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
				height: 'calc(100vh - 25.2rem)',
			}}
			className='relative'
		>
			<AgTable
				ref={gridRef}
				suppressHorizontalScroll={dataIsEmpty}
				className={clsx('h-full', dataIsEmpty && 'overflow-hidden rounded border border-gray-500')}
				rowData={[]}
				columnDefs={COLUMNS}
				defaultColDef={defaultColDef}
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
