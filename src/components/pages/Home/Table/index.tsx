import AgTable from '@/components/common/Tables/AgTable';
import dayjs from '@/libs/dayjs';
import { numberFormatter } from '@/utils/helpers';
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
				colId: 'title',
				initialHide: false,
				cellClass: 'justify-end',
				width: 144,
				pinned: 'right',
				valueGetter: ({ data }) => data!.symbolInfo.title,
			},
			{
				headerName: 'پرمیوم',
				colId: 'premium',
				initialHide: false,
				width: 80,
				valueGetter: ({ data }) => data!.optionWatchlistData.premium,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'بلک شولز',
				colId: 'blackScholes',
				initialHide: false,
				width: 96,
				valueGetter: ({ data }) => data!.optionWatchlistData.blackScholes,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'O / I TM',
				colId: 'profitAndLoss',
				initialHide: false,
				width: 96,
				cellClass: ({ value }) => ['font-medium', value === 'ITM' ? 'text-success-100' : 'text-error-100'],
				valueGetter: ({ data }) => {
					const value = data!.optionWatchlistData.profitAndLoss;

					if (value === 'Profit') return 'ITM';
					return 'OTM';
				},
			},
			{
				headerName: 'ارزش زمانی',
				colId: 'timeValue',
				initialHide: false,
				width: 96,
				valueGetter: ({ data }) => data!.optionWatchlistData.timeValue,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'بازده طی دوره',
				colId: 'intervalInterest',
				initialHide: false,
				width: 120,
				valueGetter: ({ data }) => data!.optionWatchlistData.intervalInterest,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'بازده موثر سالانه',
				colId: 'annualEffectiveInterest',
				initialHide: false,
				width: 120,
				valueGetter: ({ data }) => data!.optionWatchlistData.annualEffectiveInterest,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'دلتا',
				colId: 'delta',
				initialHide: false,
				width: 80,
				valueGetter: ({ data }) => data!.optionWatchlistData.delta,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'حجم',
				colId: 'volume',
				initialHide: false,
				width: 88,
				valueGetter: ({ data }) => data!.optionWatchlistData.volume,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'رشد',
				colId: 'growth',
				initialHide: false,
				width: 88,
				cellClass: ({ value }) => {
					const valueAsNumber = Number(value);

					if (valueAsNumber > 0) return 'text-success-100';
					if (valueAsNumber < 0) return 'text-success-100';
					return '';
				},
				valueGetter: ({ data }) => data!.optionWatchlistData.growth,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'ارزش',
				colId: 'totalValue',
				initialHide: false,
				width: 112,
				valueGetter: ({ data }) => data!.optionWatchlistData.totalValue,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'پرارزش',
				colId: 'valueContract',
				initialHide: false,
				width: 88,
				cellClass: ({ value }) => ['font-medium', value === 'LIQ' ? 'text-success-100' : 'text-error-100'],
				valueGetter: ({ data }) => data!.optionWatchlistData.valueContract,
			},
			{
				headerName: 'موقعیت های باز',
				colId: 'openPositionCount',
				initialHide: false,
				width: 128,
				valueGetter: ({ data }) => data!.optionWatchlistData.openPositionCount,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'موقعیت باز زیاد',
				colId: 'highOpenPosition',
				initialHide: false,
				width: 120,
				cellClass: ({ value }) => ['font-medium', value === 'LIQ' ? 'text-success-100' : 'text-error-100'],
				valueGetter: ({ data }) => data!.optionWatchlistData.highOpenPosition,
			},
			{
				headerName: 'نوشنال ولیو',
				colId: 'notionalValue',
				initialHide: false,
				width: 112,
				valueGetter: ({ data }) => data!.optionWatchlistData.notionalValue,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'دارایی پایه',
				colId: 'baseSymbolTitle',
				initialHide: false,
				width: 96,
				valueGetter: ({ data }) => data!.symbolInfo.baseSymbolTitle,
			},
			{
				headerName: 'قیمت دارایی پایه',
				colId: 'lastPrice',
				initialHide: false,
				width: 120,
				valueGetter: ({ data }) => '—',
			},
			{
				headerName: 'قیمت اعمال',
				colId: 'strikePrice',
				initialHide: false,
				width: 96,
				valueGetter: ({ data }) => data!.symbolInfo.strikePrice,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'زمان سررسید',
				colId: 'daysToContractEndDate',
				initialHide: false,
				width: 112,
				cellClass: 'rtl',
				valueGetter: ({ data }) => data!.symbolInfo.daysToContractEndDate,
				valueFormatter: ({ value }) => `${value} روز`,
			},
			{
				headerName: 'اهرم خرید',
				colId: 'callLeverage',
				initialHide: false,
				width: 88,
				valueGetter: ({ data }) => data!.optionWatchlistData.callLeverage,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'بهترین خرید',
				colId: 'bestCallPrice',
				initialHide: false,
				width: 112,
				valueGetter: ({ data }) => data!.optionWatchlistData.bestCallPrice,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'فاصله تا بلک شولز خرید',
				colId: 'callToBlackScholes',
				initialHide: false,
				width: 176,
				valueGetter: ({ data }) => data!.optionWatchlistData.callToBlackScholes,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'فاصله تا بلک شولز فروش',
				colId: 'putToBlackScholes',
				initialHide: false,
				width: 176,
				valueGetter: ({ data }) => data!.optionWatchlistData.putToBlackScholes,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'بهترین فروش',
				colId: 'bestPutPrice',
				initialHide: false,
				width: 104,
				valueGetter: ({ data }) => data!.optionWatchlistData.bestPutPrice,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'اهرم فروش',
				colId: 'putLeverage',
				initialHide: false,
				width: 96,
				valueGetter: ({ data }) => data!.optionWatchlistData.putLeverage,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'اسپرد',
				colId: 'spread',
				initialHide: false,
				width: 80,
				valueGetter: ({ data }) => data!.optionWatchlistData.spread,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'وجه تضمین',
				colId: 'requiredMargin',
				initialHide: false,
				width: 104,
				valueGetter: ({ data }) => data!.optionWatchlistData.requiredMargin,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'حجم خرید حقیقی',
				colId: 'individualCallVolume',
				initialHide: false,
				width: 128,
				valueGetter: ({ data }) => data!.optionWatchlistData.individualCallVolume,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'حجم خرید حقوقی',
				colId: 'legalCallVolume',
				initialHide: false,
				width: 136,
				valueGetter: ({ data }) => data!.optionWatchlistData.legalCallVolume,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'حجم فروش حقیقی',
				colId: 'individualPutVolume',
				initialHide: false,
				width: 136,
				valueGetter: ({ data }) => data!.optionWatchlistData.individualPutVolume,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'حجم فروش حقوقی',
				colId: 'legalPutVolume',
				initialHide: false,
				width: 136,
				valueGetter: ({ data }) => data!.optionWatchlistData.legalPutVolume,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'تتا',
				colId: 'theta',
				initialHide: false,
				width: 96,
				valueGetter: ({ data }) => data!.optionWatchlistData.theta,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'رو',
				colId: 'rho',
				initialHide: false,
				width: 96,
				valueGetter: ({ data }) => data!.optionWatchlistData.rho,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'وگا',
				colId: 'vega',
				initialHide: false,
				width: 96,
				valueGetter: ({ data }) => data!.optionWatchlistData.vega,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'گاما',
				colId: 'gamma',
				initialHide: false,
				width: 96,
				valueGetter: ({ data }) => data!.optionWatchlistData.gamma,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'نام اختیار',
				colId: 'companyName',
				initialHide: false,
				width: 200,
				valueGetter: ({ data }) => data!.symbolInfo.companyName,
			},
			{
				headerName: 'نوع اختیار',
				colId: 'optionType',
				initialHide: false,
				width: 88,
				cellClass: ({ value }) => ['font-medium', value === 'Call' ? 'text-success-100' : 'text-error-100'],
				valueGetter: ({ data }) => data!.symbolInfo.optionType,
				valueFormatter: ({ value }) => (value === 'Call' ? 'خرید' : 'فروش'),
			},
			{
				headerName: 'نوسان پذیری',
				colId: 'volatility',
				initialHide: false,
				width: 112,
				valueGetter: ({ data }) => data!.optionWatchlistData.volatility,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'نوسان پذیری ضمنی خرید',
				colId: 'callImpliedVolatility',
				initialHide: false,
				width: 176,
				valueGetter: ({ data }) => data!.optionWatchlistData.callImpliedVolatility,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'نوسان پذیری ضمنی فروش',
				colId: 'putImpliedVolatility',
				initialHide: false,
				width: 176,
				valueGetter: ({ data }) => data!.optionWatchlistData.putImpliedVolatility,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber === 0 ? '—' : String(numberFormatter(Number(value)));
				},
			},
			{
				headerName: 'صنعت',
				colId: 'sectorTitle',
				initialHide: false,
				width: 200,
				valueGetter: ({ data }) => data!.symbolInfo.sectorTitle,
			},
			{
				headerName: 'تاریخ آخرین معامله',
				colId: 'lastTradeDateTime',
				initialHide: false,
				width: 136,
				valueGetter: ({ data }) => data!.optionWatchlistData.lastTradeDateTime,
				valueFormatter: ({ value }) => {
					if (typeof value !== 'string') return '—';
					return dayjs(value).calendar('jalali').format('YYYY/MM/DD');
				},
			},
			{
				headerName: 'محاسبه 120 درصد',
				colId: 'calculation120percent',
				initialHide: false,
				width: 136,
				valueGetter: ({ data }) => '—',
			},
			{
				headerName: 'محاسبه 150 درصد',
				colId: 'calculation150percent',
				initialHide: false,
				width: 136,
				valueGetter: ({ data }) => '—',
			},
			{
				headerName: 'عملیات',
				colId: 'action',
				initialHide: false,
				width: 80,
				pinned: 'left',
				cellRenderer: ActionColumn,
			},
		],
		[],
	);

	const dataIsEmpty = !Array.isArray(data) || data.length === 0;

	return (
		<div
			style={{
				height: 'calc(100vh - 19.6rem)',
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
				getRowId={({ data }) => data!.symbolInfo.symbolISIN}
			/>

			<ManageWatchlistColumns />

			{dataIsEmpty && <NoData key='no-data' onAddSymbol={addSymbol} />}
		</div>
	);
};

export default Table;
