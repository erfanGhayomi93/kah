import { useLongCallStrategyQuery } from '@/api/queries/strategyQuery';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRendererRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { initialColumnsLongCall } from '@/constants/strategies';
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

interface LongCallProps extends Strategy.GetAll {}

const LongCall = (strategy: LongCallProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.LongCall>>(null);

	const [useCommission, setUseCommission] = useLocalstorage('use_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'long_call_strategy_columns',
		initialColumnsLongCall,
	);

	const [priceBasis, setPriceBasis] = useState<ISelectItem>({ id: 'BestLimit', title: t('strategy.headline') });

	const { data, isFetching } = useLongCallStrategyQuery({
		queryKey: ['longCallQuery', priceBasis.id, useCommission],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const execute = (data: Strategy.LongCall) => {
		//
	};

	const analyze = (data: Strategy.LongCall) => {
		try {
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
					side: 'buy',
					marketUnit: data.marketUnit,
					requiredMargin: {
						value: data.requiredMargin,
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
		} catch (e) {
			//
		}
	};

	const showColumnsPanel = () => {
		dispatch(
			setManageColumnsPanel({
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnChanged: (_, columns) => setColumnsVisibility(columns),
				onReset: () => setColumnsVisibility(initialColumnsLongCall),
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.LongCall>>>(
		() => [
			{
				colId: 'symbolISIN',
				headerName: 'نماد پایه',
				minWidth: 104,
				flex: 1,
				pinned: 'right',
				cellClass: 'cursor-pointer',
				onCellClicked: ({ data }) => onSymbolTitleClicked(data!.baseSymbolISIN),
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
				minWidth: 120,
				valueGetter: ({ data }) => data?.dueDays ?? 0,
			},
			{
				colId: 'callSymbolISIN',
				headerName: 'اختیار خرید',
				minWidth: 128,
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
				minWidth: 96,
				cellClass: 'gray',
				valueGetter: ({ data }) => data?.strikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'openPositionCount',
				headerName: 'موقعیت باز',
				minWidth: 112,
				valueGetter: ({ data }) => data?.openPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'premium',
				headerName: 'آخرین قیمت نماد آپشن',
				minWidth: 152,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.CoveredCall, number>) => ({
					percent: data?.premium ?? 0,
				}),
				valueGetter: ({ data }) => `${data?.premium ?? 0}|${data?.tradePriceVarPreviousTradePercent ?? 0}`,
				valueFormatter: ({ data }) => sepNumbers(String(data?.premium ?? 0)),
			},
			{
				colId: 'optionBestBuyLimitPrice',
				headerName: 'قیمت بهترین خریدار',
				minWidth: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestBuyLimitQuantity',
				headerName: 'حجم سرخط خرید',
				minWidth: 120,
				cellClass: 'buy',
				valueGetter: ({ data }) => 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestSellLimitPrice',
				headerName: 'قیمت بهترین فروشنده',
				minWidth: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.optionBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestSellLimitQuantity',
				headerName: 'حجم سرخط فروش',
				minWidth: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.optionBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'longCallBEP',
				headerName: 'سر به سر استراتژی',
				minWidth: 128,
				cellClass: ({ data }) =>
					getColorBasedOnPercent((data?.baseLastTradedPrice ?? 0) - (data?.longCallBEP ?? 0)),
				valueGetter: ({ data }) => data?.longCallBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'maxProfit',
				headerName: 'بیشینه سود',
				minWidth: 160,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'سود در صورت اعمال به ازای یک قرارداد آپشن',
				},
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.CoveredCall, number>) => ({
					percent: data?.maxProfitPercent ?? 0,
				}),
				valueGetter: ({ data }) => `${data!.profitAmount}|${data!.profitPercentUntilSettlement}`,
				valueFormatter: ({ data }) => sepNumbers(String(data!.profitAmount)),
			},
			{
				colId: 'blackScholes',
				headerName: 'بلک شولز',
				minWidth: 96,
				valueGetter: ({ data }) => data?.blackScholes ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
			},
			{
				colId: 'timeValue',
				headerName: 'ارزش زمانی',
				minWidth: 96,
				valueGetter: ({ data }) => data?.timeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'intrinsicValue',
				headerName: 'ارزش ذاتی',
				minWidth: 96,
				valueGetter: ({ data }) => data?.intrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'profit',
				headerName: 'مقدار سود',
				minWidth: 104,
				valueFormatter: () => t('common.infinity'),
			},
			{
				colId: 'bepDifference',
				headerName: 'اختلاف تا سر به سر',
				minWidth: 136,
				valueGetter: ({ data }) => data?.bepDifference ?? 0,
				valueFormatter: ({ data }) => sepNumbers(String(data?.bepDifference ?? 0)),
			},
			{
				colId: 'tradeValue',
				headerName: 'ارزش معاملات آپشن',
				minWidth: 136,
				valueGetter: ({ data }) => data?.tradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeValue',
				headerName: 'ارزش معاملات سهم پایه',
				minWidth: 152,
				valueGetter: ({ data }) => data?.baseTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeCount',
				headerName: 'تعداد معاملات پایه',
				minWidth: 128,
				valueGetter: ({ data }) => data?.baseTradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseTradeVolume',
				headerName: 'حجم معاملات پایه',
				minWidth: 136,
				valueGetter: ({ data }) => data?.baseTradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseLastTradedDate',
				headerName: 'آخرین معامله پایه',
				minWidth: 120,
				valueGetter: ({ data }) => data?.baseLastTradedDate ?? 0,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				colId: 'actions',
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
			<StrategyDetails strategy={strategy} steps={[t(`${type}.step_1`)]} />

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

				<Table<Strategy.LongCall>
					ref={gridRef}
					rowData={rows}
					columnDefs={columnDefs}
					isFetching={isFetching}
				/>
			</div>
		</>
	);
};

export default LongCall;
