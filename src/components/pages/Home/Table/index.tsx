import AgTable from '@/components/common/Tables/AgTable';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import clsx from 'clsx';
import { useMemo, useRef } from 'react';
import ActionColumn from './ActionColumn';
import ManageWatchlistColumns from './ManageWatchlistColumns';
import NoData from './NoData';

interface TableProps {
	data: Option.Root[];
}

const Table = ({ data }: TableProps) => {
	const tableRef = useRef<GridApi<Option.Root>>(null);

	const addSymbol = () => {
		//
	};

	const COLUMNS: Array<ColDef<Option.Root>> = useMemo(
		() => [
			{
				headerName: 'نماد',
				colId: 'symbolTitle',
				initialHide: false,
				width: 144,
				pinned: 'right',
				cellClass: 'justify-end',
				valueGetter: ({ data }) => data!.symbolInfo.symbolTitle,
			},
			{
				headerName: 'ارزش معاملات',
				colId: 'tradeValue',
				initialHide: false,
				initialSort: 'asc',
				valueGetter: ({ data }) => data!.optionWatchlistData.tradeValue,
			},
			{
				headerName: 'آخرین قیمت',
				colId: 'premium',
				initialHide: false,
				valueGetter: ({ data }) => data!.optionWatchlistData.premium,
			},
			{
				headerName: 'دلتا',
				colId: 'delta',
				initialHide: false,
				valueGetter: ({ data }) => data!.optionWatchlistData.delta,
			},
			{
				headerName: 'آخرین قیمت پایه',
				colId: 'baseSymbolPrice',
				initialHide: false,
				valueGetter: ({ data }) => data!.optionWatchlistData.baseSymbolPrice,
			},
			{
				headerName: 'سر به سر',
				colId: 'breakEvenPoint',
				initialHide: false,
				valueGetter: ({ data }) => data!.optionWatchlistData.breakEvenPoint,
			},
			{
				headerName: 'اهرم',
				colId: 'leverage',
				initialHide: false,
				valueGetter: ({ data }) => data!.optionWatchlistData.leverage,
			},
			{
				headerName: 'موقعیت‌های باز',
				colId: 'openPositionCount',
				initialHide: false,
				valueGetter: ({ data }) => data!.optionWatchlistData.openPositionCount,
			},
			{
				headerName: 'نوسان پذیری ضمنی',
				colId: 'impliedVolatility',
				initialHide: false,
				valueGetter: ({ data }) => data!.optionWatchlistData.impliedVolatility,
			},
			{
				headerName: 'بلک شولز',
				colId: 'blackScholes',
				initialHide: false,
				valueGetter: ({ data }) => data!.optionWatchlistData.blackScholes,
			},
			{
				headerName: 'روز مانده',
				colId: 'dueDays',
				initialHide: false,
				valueGetter: ({ data }) => data!.symbolInfo.dueDays,
			},
			{
				headerName: 'قیمت اعمال',
				colId: 'strikePrice',
				initialHide: false,
				valueGetter: ({ data }) => data!.symbolInfo.strikePrice,
			},
			{
				headerName: 'بهترین خرید',
				colId: 'bestBuyPrice',
				initialHide: false,
				valueGetter: ({ data }) => data!.optionWatchlistData.bestBuyPrice,
			},
			{
				headerName: 'بهترین فروش',
				colId: 'bestBuyPrice',
				initialHide: false,
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
				colId: 'optionType',
				initialHide: true,
				valueGetter: ({ data }) => data!.optionWatchlistData.requiredMargin,
			},
			{
				headerName: 'وجه تضمین اولیه',
				colId: 'optionType',
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
				width: 80,
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
			cellStyle: ({ column }) => ({
				backgroundColor: column.getSort() ? 'rgba(0, 104, 137, 0.1)' : '',
			}),
		}),
		[],
	);

	const dataIsEmpty = !Array.isArray(data) || data.length === 0;

	return (
		<div
			style={{
				height: 'calc(100vh - 25.2rem)',
				maxHeight: dataIsEmpty ? 'calc(100vh - 32rem)' : undefined,
			}}
			className='relative'
		>
			<AgTable
				ref={tableRef}
				suppressHorizontalScroll={dataIsEmpty}
				className={clsx('h-full', dataIsEmpty && 'overflow-hidden rounded border border-gray-500')}
				rowData={data}
				columnDefs={COLUMNS}
				defaultColDef={defaultColDef}
				getRowId={({ data }) => data!.symbolInfo.symbolISIN}
			/>

			<ManageWatchlistColumns />

			{dataIsEmpty && <NoData key='no-data' onAddSymbol={addSymbol} />}
		</div>
	);
};

export default Table;
