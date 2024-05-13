import { useCoveredCallStrategyQuery } from '@/api/queries/strategyQuery';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRendererRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { initialColumnsCoveredCall } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import { setAnalyzeModal } from '@/features/slices/modalSlice';
import { setManageColumnsPanel, setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useLocalstorage } from '@/hooks';
import { dateFormatter, getColorBasedOnPercent, numFormatter, sepNumbers, toFixed, uuidv4 } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type ISelectItem } from '..';
import Filters from '../components/Filters';
import StrategyActionCell from '../components/StrategyActionCell';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';

interface CoveredCallProps extends Strategy.GetAll {}

const CoveredCall = (strategy: CoveredCallProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.CoveredCall>>(null);

	const [useCommission, setUseCommission] = useLocalstorage('use_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'covered_call_strategy_columns',
		initialColumnsCoveredCall,
	);

	const [priceBasis, setPriceBasis] = useState<ISelectItem>({ id: 'BestLimit', title: t('strategy.headline') });

	const { data, isFetching } = useCoveredCallStrategyQuery({
		queryKey: ['coveredCallQuery', priceBasis.id, useCommission],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const execute = (data: Strategy.CoveredCall) => {
		//
	};

	const analyze = (data: Strategy.CoveredCall) => {
		const contracts: TSymbolStrategy[] = [
			{
				type: 'option',
				id: uuidv4(),
				symbol: {
					symbolTitle: data.symbolTitle,
					symbolISIN: data.symbolISIN,
					optionType: 'call',
					baseSymbolPrice: data.baseLastTradedPrice,
					historicalVolatility: data.historicalVolatility,
				},
				contractSize: data.contractSize,
				price: data.premium || 1,
				quantity: 1,
				settlementDay: data.contractEndDate,
				strikePrice: data.strikePrice,
				side: 'sell',
				marketUnit: data.marketUnit,
				requiredMargin: {
					value: data.requiredMargin,
				},
			},
			{
				type: 'base',
				id: uuidv4(),
				marketUnit: data.baseMarketUnit,
				quantity: 1,
				price: data.baseLastTradedPrice,
				side: 'buy',
				symbol: {
					symbolTitle: data.baseSymbolTitle,
					symbolISIN: data.baseSymbolISIN,
					baseSymbolPrice: data.baseLastTradedPrice,
				},
			},
		];

		dispatch(
			setAnalyzeModal({
				symbol: {
					symbolTitle: data.baseSymbolTitle,
					symbolISIN: data.baseSymbolISIN,
				},
				contracts,
			}),
		);
	};

	const showColumnsPanel = () => {
		dispatch(
			setManageColumnsPanel({
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnChanged: (_, columns) => setColumnsVisibility(columns),
				onReset: () => setColumnsVisibility(initialColumnsCoveredCall),
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.CoveredCall>>>(
		() => [
			{
				colId: 'baseSymbolISIN',
				headerName: 'نماد پایه',
				width: 104,
				pinned: 'right',
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.baseSymbolISIN),
				valueGetter: ({ data }) => data?.baseSymbolTitle ?? '−',
			},
			{
				colId: 'baseLastTradedPrice',
				headerName: 'قیمت پایه',
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
				colId: 'dueDays',
				headerName: 'مانده تا سررسید',
				width: 120,
				valueGetter: ({ data }) => data?.dueDays ?? 0,
			},
			{
				colId: 'callSymbolISIN',
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
				colId: 'strikePrice',
				headerName: 'قیمت اعمال',
				width: 96,
				cellClass: 'gray',
				valueGetter: ({ data }) => data?.strikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'openPositionCount',
				headerName: 'موقعیت باز',
				width: 112,
				valueGetter: ({ data }) => data?.openPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestBuyLimitPrice',
				headerName: 'قیمت بهترین خریدار',
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestBuyLimitQuantity',
				headerName: 'حجم سرخط خرید',
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestSellLimitPrice',
				headerName: 'قیمت بهترین فروشنده',
				width: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.optionBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestSellLimitQuantity',
				headerName: 'حجم سر خط فروش',
				width: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.optionBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'coveredCallBEP',
				headerName: 'سر به سر استراتژی',
				width: 136,
				cellClass: ({ data }) =>
					getColorBasedOnPercent((data?.baseLastTradedPrice ?? 0) - (data?.coveredCallBEP ?? 0)),
				valueGetter: ({ data }) => data?.coveredCallBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'maxProfit',
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
				colId: 'nonExpiredProfit',
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
				colId: 'inUseCapital',
				headerName: 'سرمایه درگیر',
				width: 96,
				valueGetter: ({ data }) => data?.inUseCapital ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'premium',
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
				colId: 'bepDifference',
				headerName: 'اختلاف تا سر به سر',
				width: 136,
				valueGetter: ({ data }) => data?.bepDifference ?? 0,
				valueFormatter: ({ data }) => sepNumbers(String(data?.bepDifference ?? 0)),
			},
			{
				colId: 'tradeValue',
				headerName: 'ارزش معاملات آپشن',
				width: 136,
				valueGetter: ({ data }) => data?.tradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeValue',
				headerName: 'ارزش معاملات سهم پایه',
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeCount',
				headerName: 'تعداد معاملات پایه',
				width: 128,
				valueGetter: ({ data }) => data?.baseTradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseTradeVolume',
				headerName: 'حجم معاملات پایه',
				width: 136,
				valueGetter: ({ data }) => data?.baseTradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseLastTradedDate',
				headerName: 'آخرین معامله پایه',
				width: 120,
				valueGetter: ({ data }) => data?.baseLastTradedDate ?? 0,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				colId: 'bestBuyYTM',
				headerName: 'YTM سرخط خرید',
				width: 120,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده موثر تا سررسید',
				},
				cellClass: ({ value }) => getColorBasedOnPercent(value),
				valueGetter: ({ data }) => data?.bestBuyYTM ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
			},
			{
				colId: 'bestSellYTM',
				headerName: 'YTM سرخط فروش',
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده موثر تا سررسید',
				},
				cellClass: ({ value }) => getColorBasedOnPercent(value),
				valueGetter: ({ data }) => data?.bestSellYTM ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
			},
			{
				colId: 'riskCoverage',
				headerName: 'پوشش ریسک',
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip:
						'پوشش ریسک یا حاشیه اطمینان درصدی است که سهم پایه می‌تواند حداکثر کاهش خود را داشته باشد، ولی استراتژی کاورد کال وارد زیان نشود.',
				},
				cellClass: ({ value }) => getColorBasedOnPercent(value),
				valueGetter: ({ data }) => data?.riskCoverage ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
			},
			{
				colId: 'nonExpiredYTM',
				headerName: 'YTM عدم اعمال',
				width: 120,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده موثر تا سررسید در صورت عدم اعمال توسط خریدار اختیار',
				},
				cellClass: ({ value }) => getColorBasedOnPercent(value),
				valueGetter: ({ data }) => data?.nonExpiredYTM ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
			},
			{
				colId: 'action',
				headerName: 'عملیات',
				width: 80,
				pinned: 'left',
				cellRenderer: StrategyActionCell,
				cellRendererParams: {
					execute,
					analyze,
				},
			},
		],
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

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid || !Array.isArray(columnsVisibility)) return;

		try {
			for (let i = 0; i < columnsVisibility.length; i++) {
				const { hidden, id } = columnsVisibility[i];
				eGrid.setColumnsVisible([id], !hidden);
			}
		} catch (e) {
			//
		}
	}, [columnsVisibility]);

	const rows = data ?? [];

	return (
		<>
			<StrategyDetails strategy={strategy} steps={[t(`${type}.step_1`), t(`${type}.step_2`)]} />

			<div className='relative flex-1 gap-16 overflow-hidden rounded bg-white p-16 flex-column'>
				<Filters
					type={type}
					title={title}
					useCommission={useCommission}
					priceBasis={priceBasis}
					onManageColumns={showColumnsPanel}
					onPriceBasisChanged={setPriceBasis}
					onCommissionChanged={setUseCommission}
				/>

				<div className='relative flex-1 gap-16 overflow-hidden rounded bg-white p-16 flex-column'>
					<Table<Strategy.CoveredCall>
						ref={gridRef}
						rowData={rows}
						columnDefs={columnDefs}
						isFetching={isFetching}
					/>
				</div>
			</div>
		</>
	);
};

export default CoveredCall;
