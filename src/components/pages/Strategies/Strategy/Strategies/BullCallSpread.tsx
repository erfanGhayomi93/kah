import { useBullCallSpreadStrategyQuery } from '@/api/queries/strategyQuery';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRendererRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { initialColumnsBullCallSpread } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import { setAnalyzeModal } from '@/features/slices/modalSlice';
import { setManageColumnsPanel, setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useLocalstorage } from '@/hooks';
import { dateFormatter, getColorBasedOnPercent, numFormatter, sepNumbers, toFixed } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type ISelectItem } from '..';
import Filters from '../components/Filters';
import StrategyActionCell from '../components/StrategyActionCell';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';

interface BullCallSpreadProps extends Strategy.GetAll {}

const BullCallSpread = (strategy: BullCallSpreadProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.BullCallSpread>>(null);

	const [useCommission, setUseCommission] = useLocalstorage('use_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'bull_call_spread_strategy_columns',
		initialColumnsBullCallSpread,
	);

	const [priceBasis, setPriceBasis] = useState<ISelectItem>({ id: 'BestLimit', title: t('strategy.headline') });

	const { data, isFetching } = useBullCallSpreadStrategyQuery({
		queryKey: ['bullCallSpreadQuery', priceBasis.id, useCommission],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const execute = (data: Strategy.BullCallSpread) => {
		//
	};

	const analyze = (data: Strategy.BullCallSpread) => {
		const contracts: TSymbolStrategy[] = [];

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
				onReset: () => setColumnsVisibility(initialColumnsBullCallSpread),
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.BullCallSpread>>>(
		() => [
			{
				colId: 'baseSymbolISIN',
				headerName: 'نماد پایه',
				width: 104,
				cellClass: 'cursor-pointer',
				pinned: 'right',
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
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspSymbolTitle',
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
				colId: 'lspStrikePrice',
				headerName: 'قیمت اعمال کال خرید',
				width: 176,
				valueGetter: ({ data }) => data?.lspStrikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestSellLimitPrice',
				headerName: 'قیمت فروشنده کال خرید',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestSellLimitQuantity',
				headerName: 'حجم فروشنده کال خرید',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestBuyLimitPrice',
				headerName: 'قیمت خریدار کال خرید',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestBuyLimitQuantity',
				headerName: 'حجم خریدار کال خرید',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspSymbolISIN',
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
				colId: 'hspStrikePrice',
				headerName: 'قیمت اعمال کال فروش',
				width: 176,
				valueGetter: ({ data }) => data?.hspStrikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestBuyLimitPrice',
				headerName: 'قیمت خریدار کال فروش',
				width: 176,
				valueGetter: ({ data }) => data?.hspBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestBuyLimitQuantity',
				headerName: 'حجم خریدار کال فروش',
				width: 176,
				valueGetter: ({ data }) => data?.hspBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestSellLimitPrice',
				headerName: 'قیمت بهترین فروشنده کال فروش',
				width: 192,
				valueGetter: ({ data }) => data?.hspBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestSellLimitQuantity',
				headerName: 'حجم سر خط فروش کال فروش',
				width: 176,
				valueGetter: ({ data }) => data?.hspBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspOpenPositionCount',
				headerName: 'موقعیت باز کال خرید',
				width: 152,
				valueGetter: ({ data }) => data?.lspOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspOpenPositionCount',
				headerName: 'موقعیت باز کال فروش',
				width: 152,
				valueGetter: ({ data }) => data?.hspOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspPremium',
				headerName: 'قیمت نماد کال خرید',
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.BullCallSpread, number>) => ({
					percent: data?.lspPremiumPercent ?? 0,
				}),
				valueGetter: ({ data }) => `${data?.lspPremium ?? 0}|${data?.lspPremiumPercent ?? 0}`,
				valueFormatter: ({ data }) => sepNumbers(String(data?.lspPremium ?? 0)),
			},
			{
				colId: 'hspPremium',
				headerName: 'قیمت نماد کال فروش',
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.BullCallSpread, number>) => ({
					percent: data?.hspPremiumPercent ?? 0,
				}),
				valueGetter: ({ data }) => `${data?.hspPremium ?? 0}|${data?.hspPremiumPercent ?? 0}`,
				valueFormatter: ({ data }) => sepNumbers(String(data?.hspPremium ?? 0)),
			},
			{
				colId: 'bullCallSpreadBEP',
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
				colId: 'maxProfit',
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
				colId: 'maxLoss',
				headerName: 'حداکثر زیان',
				width: 152,
				valueGetter: ({ data }) => data?.maxLoss ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'inUseCapital',
				headerName: 'سرمایه درگیر',
				width: 96,
				valueGetter: ({ data }) => data?.inUseCapital ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspTimeValue',
				headerName: 'ارزش زمانی کال خرید',
				width: 152,
				valueGetter: ({ data }) => data?.lspTimeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspTimeValue',
				headerName: 'ارزش زمانی کال فروش',
				width: 152,
				valueGetter: ({ data }) => data?.hspTimeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspIntrinsicValue',
				headerName: 'ارزش ذاتی کال خرید',
				width: 152,
				valueGetter: ({ data }) => data?.lspIntrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspIntrinsicValue',
				headerName: 'ارزش ذاتی کال فروش',
				width: 152,
				valueGetter: ({ data }) => data?.hspIntrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspTradeValue',
				headerName: 'ارزش معاملات آپشن کال خرید',
				width: 192,
				valueGetter: ({ data }) => data?.lspTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'hspTradeValue',
				headerName: 'ارزش معاملات آپشن کال فروش',
				width: 192,
				valueGetter: ({ data }) => data?.hspTradeValue ?? 0,
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
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseTradeVolume',
				headerName: 'حجم معاملات پایه',
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseLastTradedDate',
				headerName: 'آخرین معامله پایه',
				width: 152,
				valueGetter: ({ data }) => data?.baseLastTradedDate ?? 0,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				colId: 'ytm',
				headerName: 'YTM',
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده موثر تا سررسید',
				},
				cellClass: ({ value }) => getColorBasedOnPercent(value),
				valueGetter: ({ data }) => data?.ytm ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 6),
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
			<StrategyDetails
				strategy={strategy}
				steps={[t(`${type}.step_1`), t(`${type}.step_2`)]}
				condition={t(`${type}.condition`)}
			/>

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

				<Table<Strategy.BullCallSpread>
					ref={gridRef}
					rowData={rows}
					columnDefs={columnDefs}
					isFetching={isFetching}
				/>
			</div>
		</>
	);
};

export default BullCallSpread;
