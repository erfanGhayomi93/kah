import { useConversionStrategyQuery } from '@/api/queries/strategyQuery';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRendererRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { initialColumnsConversion } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import { setAnalyzeModal, setDescriptionModal } from '@/features/slices/modalSlice';
import { setManageColumnsPanel, setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useLocalstorage } from '@/hooks';
import { dateFormatter, getColorBasedOnPercent, numFormatter, sepNumbers, toFixed } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type ISelectItem } from '..';
import Filters from '../components/Filters';
import StrategyActionCell from '../components/StrategyActionCell';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';

const ConversionDescription = dynamic(() => import('../Descriptions/ConversionDescription'), {
	ssr: false,
});

interface ConversionProps extends Strategy.GetAll {}

const Conversion = (strategy: ConversionProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.Conversion>>(null);

	const [useCommission, setUseCommission] = useLocalstorage('use_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'conversion_strategy_columns',
		initialColumnsConversion,
	);

	const [priceBasis, setPriceBasis] = useState<ISelectItem>({ id: 'BestLimit', title: t('strategy.headline') });

	const { data, isFetching } = useConversionStrategyQuery({
		queryKey: ['conversionQuery', priceBasis.id, useCommission],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const execute = (data: Strategy.Conversion) => {
		//
	};

	const analyze = (data: Strategy.Conversion) => {
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

	const readMore = () => {
		dispatch(
			setDescriptionModal({
				title: (
					<>
						{t(`strategies.strategy_title_${type}`)} <span className='text-gray-700'>({title})</span>
					</>
				),
				description: () => <ConversionDescription />,
				onRead: () => dispatch(setDescriptionModal(null)),
			}),
		);
	};

	const showColumnsPanel = () => {
		dispatch(
			setManageColumnsPanel({
				initialColumns: initialColumnsConversion,
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnChanged: (_, columns) => setColumnsVisibility(columns),
				onReset: () => setColumnsVisibility(initialColumnsConversion),
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.Conversion>>>(
		() => [
			{
				colId: 'baseSymbolISIN',
				headerName: 'نماد پایه',
				width: 104,
				pinned: 'right',
				cellClass: 'cursor-pointer justify-end',
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
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.LongStraddle, number>) => ({
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
				colId: 'strikePrice',
				headerName: 'قیمت اعمال',
				width: 96,
				cellClass: 'gray',
				valueGetter: ({ data }) => data?.strikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callPremium',
				headerName: 'قیمت نماد کال',
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.LongStraddle, number>) => ({
					percent: data?.callPremiumPercent ?? 0,
				}),
				valueGetter: ({ data }) => `${data?.callPremium ?? 0}|${data?.callPremiumPercent ?? 0}`,
				valueFormatter: ({ data }) => sepNumbers(String(data?.callPremium ?? 0)),
			},
			{
				colId: 'putPremium',
				headerName: 'قیمت نماد پوت',
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.LongStraddle, number>) => ({
					percent: data?.putPremiumPercent ?? 0,
				}),
				valueGetter: ({ data }) => `${data?.putPremium ?? 0}|${data?.putPremiumPercent ?? 0}`,
				valueFormatter: ({ data }) => sepNumbers(String(data?.putPremium ?? 0)),
			},
			{
				colId: 'callSymbolISIN',
				headerName: 'کال',
				width: 128,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.callSymbolISIN),
				valueGetter: ({ data }) => data?.callSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRendererRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.LongStraddle) => data!.callIOTM,
				},
			},
			{
				colId: 'callBestBuyLimitPrice',
				headerName: 'بهترین خریدار کال',
				width: 176,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.callBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callBestBuyLimitQuantity',
				headerName: 'حجم سر خط خرید کال',
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.callBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callOpenPositionCount',
				headerName: 'موقعیت باز کال',
				width: 152,
				valueGetter: ({ data }) => data?.callOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callBestSellLimitPrice',
				headerName: 'بهترین فروشنده کال',
				width: 204,
				valueGetter: ({ data }) => data?.callBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callBestSellLimitQuantity',
				headerName: 'حجم سر خط فروش کال',
				width: 192,
				valueGetter: ({ data }) => data?.callBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putSymbolISIN',
				headerName: 'پوت',
				width: 128,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.putSymbolISIN),
				valueGetter: ({ data }) => data?.putSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRendererRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.LongStraddle) => data!.putIOTM,
				},
			},
			{
				colId: 'putBestSellLimitPrice',
				headerName: 'بهترین فروشنده پوت',
				width: 204,
				valueGetter: ({ data }) => data?.putBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putBestSellLimitQuantity',
				headerName: 'حجم سر خط فروش پوت',
				width: 192,
				valueGetter: ({ data }) => data?.putBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putOpenPositionCount',
				headerName: 'موقعیت باز پوت',
				width: 152,
				valueGetter: ({ data }) => data?.putOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putBestBuyLimitPrice',
				headerName: 'بهترین خریدار پوت',
				width: 176,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.putBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putBestBuyLimitQuantity',
				headerName: 'حجم سر خط خرید پوت',
				width: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.putBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'profit',
				headerName: 'بازده',
				minWidth: 104,
				valueFormatter: () => t('common.infinity'),
			},
			{
				colId: 'inUseCapital',
				headerName: 'سرمایه درگیر',
				width: 96,
				valueGetter: ({ data }) => data?.inUseCapital ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
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
				colId: 'callTradeValue',
				headerName: 'ارزش معاملات کال',
				width: 160,
				valueGetter: ({ data }) => data?.callTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'putTradeValue',
				headerName: 'ارزش معاملات پوت',
				width: 160,
				valueGetter: ({ data }) => data?.putTradeValue ?? 0,
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
			<StrategyDetails strategy={strategy} steps={[]} readMore={readMore} />

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

				<Table<Strategy.Conversion>
					ref={gridRef}
					rowData={rows}
					columnDefs={columnDefs}
					isFetching={isFetching}
				/>
			</div>
		</>
	);
};

export default Conversion;
