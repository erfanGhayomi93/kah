import AgTable from '@/components/common/Tables/AgTable';
import dayjs from '@/libs/dayjs';
import { numberFormatter } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo, useRef } from 'react';
import ActionColumn from './ActionColumn';

interface TableProps {
	data: Option.Root[];
}

const Table = ({ data }: TableProps) => {
	const t = useTranslations();

	const tableRef = useRef<GridApi<Option.Root>>(null);

	const COLUMNS: Array<ColDef<Option.Root>> = useMemo(
		() => [
			{
				headerName: 'نماد',
				colId: 'title',
				headerClass: 'justify-start',
				cellClass: 'justify-end',
				width: 200,
				pinned: 'right',
				valueGetter: ({ data }) => data!.symbolInfo.title,
			},
			{
				headerName: 'پرمیوم',
				colId: 'premium',
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
				width: 88,
				cellClass: ({ value }) => ['font-medium', value === 'LIQ' ? 'text-success-100' : 'text-error-100'],
				valueGetter: ({ data }) => data!.optionWatchlistData.valueContract,
			},
			{
				headerName: 'موقعیت های باز',
				colId: 'openPositionCount',
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
				width: 120,
				cellClass: ({ value }) => ['font-medium', value === 'LIQ' ? 'text-success-100' : 'text-error-100'],
				valueGetter: ({ data }) => data!.optionWatchlistData.highOpenPosition,
			},
			{
				headerName: 'نوشنال ولیو',
				colId: 'notionalValue',
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
				width: 96,
				valueGetter: ({ data }) => data!.symbolInfo.baseSymbolTitle,
			},
			{
				headerName: 'قیمت دارایی پایه',
				colId: 'lastPrice',
				width: 120,
				valueGetter: ({ data }) => '—',
			},
			{
				headerName: 'قیمت اعمال',
				colId: 'strikePrice',
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
				width: 112,
				cellClass: 'rtl',
				valueGetter: ({ data }) => data!.symbolInfo.daysToContractEndDate,
				valueFormatter: ({ value }) => `${value} روز`,
			},
			{
				headerName: 'اهرم خرید',
				colId: 'callLeverage',
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
				width: 200,
				valueGetter: ({ data }) => data!.symbolInfo.companyName,
			},
			{
				headerName: 'نوع اختیار',
				colId: 'optionType',
				width: 88,
				cellClass: ({ value }) => ['font-medium', value === 'Call' ? 'text-success-100' : 'text-error-100'],
				valueGetter: ({ data }) => data!.symbolInfo.optionType,
				valueFormatter: ({ value }) => (value === 'Call' ? 'خرید' : 'فروش'),
			},
			{
				headerName: 'نوسان پذیری',
				colId: 'volatility',
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
				width: 200,
				valueGetter: ({ data }) => data!.symbolInfo.sectorTitle,
			},
			{
				headerName: 'تاریخ آخرین معامله',
				colId: 'lastTradeDateTime',
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
				width: 136,
				valueGetter: ({ data }) => '—',
			},
			{
				headerName: 'محاسبه 150 درصد',
				colId: 'calculation150percent',
				width: 136,
				valueGetter: ({ data }) => '—',
			},
			{
				headerName: 'عملیات',
				colId: 'action',
				width: 80,
				pinned: 'left',
				cellRenderer: ActionColumn,
			},
		],
		[],
	);

	const addSymbol = () => {
		//
	};

	const dataIsEmpty = data.length === 0;

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

			<div
				className='absolute flex-col gap-32 flex-justify-center'
				style={{
					top: 'calc(50% + 4.8rem)',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}}
			>
				<Image width='134' height='120' alt='welcome' src='/static/images/no-data-table.png' />
				<span className='text-base font-medium text-gray-300'>
					{t.rich('option_page.no_data_table', {
						symbol: (chunk) => (
							<button type='button' className='text-link underline' onClick={addSymbol}>
								{chunk}
							</button>
						),
					})}
				</span>
			</div>
		</div>
	);
};

export default Table;
