import { useCoveredCallQuery } from '@/api/queries/strategyQuery';
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

interface CoveredCallProps {
	priceBasis: TPriceBasis;
	withCommission: boolean;
}

const CoveredCall = ({ priceBasis, withCommission }: CoveredCallProps) => {
	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.CoveredCall>>(null);

	const { data, isFetching } = useCoveredCallQuery({
		queryKey: ['coveredCallQuery', priceBasis, withCommission],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const goToTechnicalChart = (data: Strategy.CoveredCall) => {
		//
	};

	const execute = (data: Strategy.CoveredCall) => {
		//
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.CoveredCall>>>(
		() => [
			{
				headerName: 'نماد پایه',
				width: 104,
				pinned: 'right',
				cellClass: 'cursor-pointer',
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
			},
			{
				headerName: 'اختیار خرید',
				width: 128,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.symbolISIN),
				valueGetter: ({ data }) => data?.symbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRendererRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.CoveredCall) => data!.iotm,
				},
			},
			{
				headerName: 'قیمت اعمال',
				width: 96,
				cellClass: 'gray',
				valueGetter: ({ data }) => data?.strikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'موقعیت باز',
				width: 112,
				valueGetter: ({ data }) => data?.openPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'قیمت بهترین خریدار',
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'حجم سرخط خرید',
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'قیمت بهترین فروشنده',
				width: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.optionBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'حجم سر خط فروش',
				width: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.optionBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'سر به سر استراتژی',
				width: 136,
				cellClass: ({ data }) =>
					(data?.baseLastTradedPrice ?? 0) - (data?.coveredCallBEP ?? 0) < 0
						? 'text-success-100'
						: 'text-error-100',
				valueGetter: ({ data }) => data?.coveredCallBEP ?? 0,
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
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.CoveredCall, number>) => ({
					percent: data?.maxProfitPercent ?? 0,
				}),
				valueGetter: ({ data }) => `${data!.maxProfit}|${data!.maxProfitPercent}`,
				valueFormatter: ({ data }) => sepNumbers(String(data!.maxProfit)),
			},
			{
				headerName: 'سود عدم اعمال',
				width: 184,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده تا سررسید در صورت عدم اعمال توسط خریدار آپشن به ازای یک قرارداد آپشن',
				},
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.CoveredCall, number>) => ({
					percent: data?.nonExpiredProfitPercent ?? 0,
				}),
				valueGetter: ({ data }) => `${data!.nonExpiredProfit}|${data!.nonExpiredProfitPercent}`,
				valueFormatter: ({ data }) => sepNumbers(String(data!.nonExpiredProfit)),
			},
			{
				headerName: 'سرمایه درگیر',
				width: 96,
				valueGetter: ({ data }) => data?.inUseCapital ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'آخرین قیمت نماد آپشن',
				width: 152,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.CoveredCall, number>) => ({
					percent: data?.premium ?? 0,
				}),
				valueGetter: ({ data }) => `${data?.premium ?? 0}|${data?.tradePriceVarPreviousTradePercent ?? 0}`,
				valueFormatter: ({ data }) => sepNumbers(String(data?.premium ?? 0)),
			},
			{
				headerName: 'اختلاف تا سر به سر',
				width: 136,
				valueGetter: ({ data }) => data?.bepDifference ?? 0,
				valueFormatter: ({ data }) => sepNumbers(String(data?.bepDifference ?? 0)),
			},
			{
				headerName: 'ارزش معاملات آپشن',
				width: 136,
				valueGetter: ({ data }) => data?.tradeValue ?? 0,
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
				width: 128,
				valueGetter: ({ data }) => data?.baseTradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'حجم معاملات پایه',
				width: 136,
				valueGetter: ({ data }) => data?.baseTradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				headerName: 'آخرین معامله پایه',
				width: 120,
				valueGetter: ({ data }) => data?.baseLastTradedDate ?? 0,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				headerName: 'YTM سرخط خرید',
				width: 120,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده موثر تا سررسید',
				},
				cellClass: ({ value }) => (value < 0 ? 'text-error-100' : 'text-success-100'),
				valueGetter: ({ data }) => data?.bestBuyYTM ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
			},
			{
				headerName: 'YTM سرخط فروش',
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده موثر تا سررسید',
				},
				cellClass: ({ value }) => (value < 0 ? 'text-error-100' : 'text-success-100'),
				valueGetter: ({ data }) => data?.bestSellYTM ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
			},
			{
				headerName: 'پوشش ریسک',
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip:
						'پوشش ریسک یا حاشیه اطمینان درصدی است که سهم پایه می‌تواند حداکثر کاهش خود را داشته باشد، ولی استراتژی کاورد کال وارد زیان نشود.',
				},
				cellClass: ({ value }) => (value < 0 ? 'text-error-100' : 'text-success-100'),
				valueGetter: ({ data }) => data?.riskCoverage ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
			},
			{
				headerName: 'YTM عدم اعمال',
				width: 120,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده موثر تا سررسید در صورت عدم اعمال توسط خریدار اختیار',
				},
				cellClass: ({ value }) => (value < 0 ? 'text-error-100' : 'text-success-100'),
				valueGetter: ({ data }) => data?.nonExpiredYTM ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
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

	const defaultColDef: ColDef<Strategy.CoveredCall> = useMemo(
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
			<AgTable<Strategy.CoveredCall>
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

export default CoveredCall;
