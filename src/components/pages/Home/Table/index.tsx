import { useOptionWatchlistQuery } from '@/api/queries/optionQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import AgTable from '@/components/common/Tables/AgTable';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
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
		queryKey: ['optionWatchlistQuery', filters],
	});

	const addSymbol = () => {
		//
	};

	const onFiltersChanged = (newFilters: IOptionWatchlistFilters) => {
		setFilters(newFilters);
	};

	const COLUMNS: Array<ColDef<Option.Root>> = useMemo(
		() => [
			{
				headerName: 'نماد',
				colId: 'symbolTitle',
				initialHide: false,
				minWidth: 128,
				pinned: 'right',
				cellClass: 'justify-end',
				valueGetter: ({ data }) => data!.symbolInfo.symbolTitle,
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},
			{
				headerName: 'ارزش معاملات',
				colId: 'tradeValue',
				initialHide: false,
				minWidth: 112,
				initialSort: 'desc',
				valueGetter: ({ data }) => data!.optionWatchlistData.tradeValue,
			},
			{
				headerName: 'آخرین قیمت',
				colId: 'premium',
				initialHide: false,
				minWidth: 128,
				valueGetter: ({ data }) => data!.optionWatchlistData.premium,
			},
			{
				headerName: 'دلتا',
				colId: 'delta',
				initialHide: false,
				minWidth: 56,
				valueGetter: ({ data }) => data!.optionWatchlistData.delta,
			},
			{
				headerName: 'آخرین قیمت پایه',
				colId: 'baseSymbolPrice',
				initialHide: false,
				minWidth: 128,
				valueGetter: ({ data }) => data!.optionWatchlistData.baseSymbolPrice,
			},
			{
				headerName: 'سر به سر',
				colId: 'breakEvenPoint',
				initialHide: false,
				minWidth: 96,
				valueGetter: ({ data }) => data!.optionWatchlistData.breakEvenPoint,
			},
			{
				headerName: 'اهرم',
				colId: 'leverage',
				initialHide: false,
				minWidth: 64,
				valueGetter: ({ data }) => data!.optionWatchlistData.leverage,
			},
			{
				headerName: 'موقعیت‌های باز',
				colId: 'openPositionCount',
				initialHide: false,
				minWidth: 120,
				valueGetter: ({ data }) => data!.optionWatchlistData.openPositionCount,
			},
			{
				headerName: 'IV',
				colId: 'impliedVolatility',
				initialHide: false,
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
				initialHide: false,
				minWidth: 56,
				cellClass: ({ value }) => {
					switch (value.toLowerCase()) {
						case 'atm':
							return 'text-lg text-success-100';
						case 'otm':
							return 'text-lg text-error-100';
						case 'itm':
							return 'text-lg text-primary-100';
						default:
							return '';
					}
				},
				valueGetter: ({ data }) => data!.optionWatchlistData.iotm,
			},
			{
				headerName: 'بلک شولز',
				colId: 'blackScholes',
				initialHide: true,
				minWidth: 144,
				valueGetter: ({ data }) => data!.optionWatchlistData.blackScholes,
			},
			{
				headerName: 'حجم',
				colId: 'tradeVolume',
				initialHide: false,
				minWidth: 104,
				valueGetter: ({ data }) => data!.optionWatchlistData.tradeVolume,
			},
			{
				headerName: 'روز مانده',
				colId: 'dueDays',
				initialHide: false,
				minWidth: 48,
				valueGetter: ({ data }) => data!.symbolInfo.dueDays,
			},
			{
				headerName: 'قیمت اعمال',
				colId: 'strikePrice',
				initialHide: false,
				minWidth: 96,
				valueGetter: ({ data }) => data!.symbolInfo.strikePrice,
			},
			{
				headerName: 'بهترین خرید',
				colId: 'bestBuyPrice',
				initialHide: false,
				minWidth: 96,
				cellStyle: {
					backgroundColor: 'rgba(25, 135, 84, 0.1)',
				},
				valueGetter: ({ data }) => data!.optionWatchlistData.bestBuyPrice,
			},
			{
				headerName: 'بهترین فروش',
				colId: 'bestSellPrice',
				initialHide: false,
				minWidth: 96,
				cellStyle: {
					backgroundColor: 'rgba(220, 53, 69, 0.1)',
				},
				valueGetter: ({ data }) => data!.optionWatchlistData.bestSellPrice,
			},
			{
				headerName: 'نام کامل آپشن',
				colId: 'symbolTitle',
				initialHide: true,
				valueGetter: ({ data }) => data!.symbolInfo.symbolTitle,
			},
			{
				headerName: 'نام پایه',
				colId: 'baseSymbolTitle',
				initialHide: true,
				valueGetter: ({ data }) => data!.symbolInfo.baseSymbolTitle,
			},
			{
				headerName: 'قیمت پایانی',
				colId: 'closingPrice',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.closingPrice,
			},
			{
				headerName: 'نوسان پذیری',
				colId: 'historicalVolatility',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.historicalVolatility,
			},
			{
				headerName: 'اندازه قرارداد',
				colId: 'contractSize',
				initialHide: true,
				valueGetter: ({ data }) => data!.symbolInfo.contractSize,
			},
			{
				headerName: 'ارزش زمانی',
				colId: 'timeValue',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.timeValue,
			},
			{
				headerName: 'تتا',
				colId: 'theta',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.theta,
			},
			{
				headerName: 'تعداد معاملات روز',
				colId: 'tradeCount',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.tradeCount,
			},
			{
				headerName: 'تاریخ سررسید',
				colId: 'contractEndDate',
				initialHide: true,
				valueGetter: ({ data }) => data!.symbolInfo.contractEndDate,
			},
			{
				headerName: 'شکاف',
				colId: 'spread',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.spread,
			},
			{
				headerName: 'اختلاف با بلک شولز',
				colId: 'blackScholesDifference',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.blackScholesDifference,
			},
			{
				headerName: 'قیمت پایانی پایه',
				colId: 'baseClosingPrice',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.baseClosingPrice,
			},
			{
				headerName: 'گاما',
				colId: 'gamma',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.gamma,
			},
			{
				headerName: 'نوع آپشن',
				colId: 'optionType',
				initialHide: true,
				valueGetter: ({ data }) => data!.symbolInfo.optionType,
			},
			{
				headerName: 'وجه تضمین لازم',
				colId: 'requiredMargin',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.requiredMargin,
			},
			{
				headerName: 'وجه تضمین اولیه',
				colId: 'initialMargin',
				initialHide: true,
				valueGetter: ({ data }) => data!.symbolInfo.initialMargin,
			},
			{
				headerName: 'رو',
				colId: 'rho',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.rho,
			},
			{
				headerName: 'وگا',
				colId: 'vega',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.vega,
			},
			{
				headerName: 'رشد',
				colId: 'growth',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.growth,
			},
			{
				headerName: 'پر ارزش',
				colId: 'contractValueType',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.contractValueType,
			},
			{
				headerName: 'موقعیت‌های باز زیاد',
				colId: 'highOpenPosition',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.highOpenPosition,
			},
			{
				headerName: 'تاریخ آخرین معامله',
				colId: 'lastTradeDate',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.lastTradeDate,
			},
			{
				headerName: 'حجم خرید حقوقی',
				colId: 'legalBuyVolume',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.legalBuyVolume,
			},
			{
				headerName: 'حجم خرید حقیقی',
				colId: 'individualBuyVolume',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.individualBuyVolume,
			},
			{
				headerName: 'حجم فروش حقوقی',
				colId: 'legalSellVolume',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.legalSellVolume,
			},
			{
				headerName: 'حجم فروش حقیقی',
				colId: 'individualSellVolume',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.individualSellVolume,
			},
			{
				headerName: 'صنعت',
				colId: 'sectorName',
				initialHide: true,
				valueGetter: ({ data }) => data!.symbolInfo.sectorName,
			},
			{
				headerName: 'ارزش مفهومی معاملات',
				colId: 'notionalValue',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.notionalValue,
			},
			{
				headerName: 'ارزش ذاتی',
				colId: 'intrinsicValue',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.intrinsicValue,
			},
			{
				headerName: 'عملیات',
				colId: 'action',
				initialHide: false,
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
		if (!eGrid) return;

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
