import { useBullCallSpreadQuery } from '@/api/queries/strategyQuery';
import AgTable from '@/components/common/Tables/AgTable';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRendererRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { dateFormatter, numFormatter, sepNumbers, toFixed } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { useEffect, useMemo, useRef } from 'react';
import NoTableData from '../components/NoTableData';
import StrategyActionCell from '../components/StrategyActionCell';

interface BullCallSpreadProps {
	priceBasis: TPriceBasis;
	withCommission: boolean;
}

const BullCallSpread = ({ priceBasis, withCommission }: BullCallSpreadProps) => {
	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.BullCallSpread>>(null);

	const { data, isFetching } = useBullCallSpreadQuery({
		queryKey: ['bullCallSpreadQuery', priceBasis, withCommission],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const goToTechnicalChart = (data: Strategy.BullCallSpread) => {
		//
	};

	const execute = (data: Strategy.BullCallSpread) => {
		//
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.BullCallSpread>>>(
		() => [
			{
				headerName: 'نماد پایه',
				width: 104,
				cellClass: 'cursor-pointer',
				pinned: 'right',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.baseSymbolISIN),
				valueGetter: ({ data }) => data?.baseSymbolTitle ?? '−',
			},
			{
				headerName: 'قیمت پایه',
				colId: 'baseSymbolPrice',
				minWidth: 108,
				valueGetter: ({ data }) =>
					`${data?.baseLastTradedPrice ?? 0}|${data?.baseTradePriceVarPreviousTradePercent ?? 0}`,
				valueFormatter: ({ data }) => sepNumbers(String(data?.baseLastTradedPrice ?? 0)),
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.CoveredCall, number>) => ({
					percent: data?.baseTradePriceVarPreviousTradePercent ?? 0,
				}),
			},
			{
				headerName: 'مانده تا سررسید',
				width: 120,
				valueGetter: ({ data }) => data?.dueDays ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'کال خرید',
				width: 128,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.lspSymbolISIN),
				valueGetter: ({ data }) => data?.lspSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRendererRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.BullCallSpread) => data?.lspiotm ?? 0,
				},
			},
			{
				headerName: 'قیمت اعمال کال خرید',
				width: 176,
				valueGetter: ({ data }) => data?.lspStrikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'قیمت فروشنده کال خرید',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'حجم فروشنده کال خرید',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'قیمت خریدار کال خرید',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'حجم خریدار کال خرید',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'کال فروش',
				width: 128,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.hspSymbolISIN),
				valueGetter: ({ data }) => data?.hspSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRendererRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.BullCallSpread) => data?.hspiotm ?? 0,
				},
			},
			{
				headerName: 'قیمت اعمال کال فروش',
				width: 176,
				valueGetter: ({ data }) => data?.hspStrikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'قیمت خریدار کال فروش',
				width: 176,
				valueGetter: ({ data }) => data?.hspBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'حجم خریدار کال فروش',
				width: 176,
				valueGetter: ({ data }) => data?.hspBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'قیمت بهترین فروشنده کال فروش',
				width: 192,
				valueGetter: ({ data }) => data?.hspBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'حجم سر خط فروش کال فروش',
				width: 176,
				valueGetter: ({ data }) => data?.hspBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'موقعیت باز کال خرید',
				width: 152,
				valueGetter: ({ data }) => data?.lspOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'موقعیت باز کال فروش',
				width: 152,
				valueGetter: ({ data }) => data?.hspOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'قیمت نماد کال خرید با درصد',
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.BullCallSpread, number>) => ({
					percent: data?.lspPremiumPercent ?? 0,
				}),
				valueGetter: ({ data }) => `${data?.lspPremium ?? 0}|${data?.lspPremiumPercent ?? 0}`,
				valueFormatter: ({ data }) => sepNumbers(String(data?.lspPremium ?? 0)),
			},
			{
				headerName: 'قیمت نماد کال فروش با درصد',
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.BullCallSpread, number>) => ({
					percent: data?.hspPremiumPercent ?? 0,
				}),
				valueGetter: ({ data }) => `${data?.hspPremium ?? 0}|${data?.hspPremiumPercent ?? 0}`,
				valueFormatter: ({ data }) => sepNumbers(String(data?.hspPremium ?? 0)),
			},
			{
				headerName: 'قیمت سر به سر',
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'درصد گرانی یا همان درصد اختلاف سر به سر و قیمت فعلی',
				},
				valueGetter: ({ data }) => data?.bullCallSpreadBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'بیشینه سود',
				width: 184,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'سود در صورت اعمال به ازای یک قرارداد آپشن',
				},
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.BullCallSpread, number>) => ({
					percent: data?.maxProfitPercent ?? 0,
				}),
				valueGetter: ({ data }) => `${data?.maxProfit ?? 0}|${data?.maxProfitPercent ?? 0}`,
				valueFormatter: ({ data }) => sepNumbers(String(data?.maxProfit ?? 0)),
			},
			{
				headerName: 'حداکثر زیان',
				width: 152,
				valueGetter: ({ data }) => data?.maxLoss ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'سرمایه درگیر',
				width: 96,
				valueGetter: ({ data }) => data?.inUseCapital ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'ارزش زمانی کال خرید',
				width: 152,
				valueGetter: ({ data }) => data?.lspTimeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'ارزش زمانی کال فروش',
				width: 152,
				valueGetter: ({ data }) => data?.hspTimeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'ارزش ذاتی کال خرید',
				width: 152,
				valueGetter: ({ data }) => data?.lspIntrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'ارزش ذاتی کال فروش',
				width: 152,
				valueGetter: ({ data }) => data?.hspIntrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'ارزش معاملات آپشن کال خرید',
				width: 192,
				valueGetter: ({ data }) => data?.lspTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				headerName: 'ارزش معاملات آپشن کال فروش',
				width: 192,
				valueGetter: ({ data }) => data?.hspTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				headerName: 'ارزش معاملات سهم پایه',
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				headerName: 'تعداد معاملات پایه',
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'حجم معاملات پایه',
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'آخرین معامله پایه',
				width: 152,
				valueGetter: ({ data }) => data?.baseLastTradedDate ?? 0,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				headerName: 'YTM',
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده موثر تا سررسید',
				},
				cellClass: ({ value }) => (value < 0 ? 'text-error-100' : 'text-success-100'),
				valueGetter: ({ data }) => data?.ytm ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 6),
			},
			{
				headerName: 'عملیات',
				width: 80,
				pinned: 'left',
				cellRenderer: StrategyActionCell,
				cellRendererParams: {
					goToTechnicalChart,
					execute,
				},
			},
		],
		[],
	);

	const defaultColDef: ColDef<Strategy.BullCallSpread> = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			minWidth: 96,
		}),
		[],
	);

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid) return;

		try {
			eGrid.setGridOption('rowData', data);
		} catch (e) {
			//
		}
	}, [data]);

	const rows = data ?? [];

	return (
		<>
			<AgTable<Strategy.BullCallSpread>
				suppressColumnVirtualisation={false}
				ref={gridRef}
				rowData={rows}
				rowHeight={40}
				headerHeight={48}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				className='h-full border-0'
			/>

			{rows.length === 0 && !isFetching && <NoTableData />}
		</>
	);
};

export default BullCallSpread;
