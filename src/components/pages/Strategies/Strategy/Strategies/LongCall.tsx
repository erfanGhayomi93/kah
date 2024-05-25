import { useLongCallStrategyQuery } from '@/api/queries/strategyQuery';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRendererRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { initialColumnsLongCall, initialHiddenColumnsLongCall } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import { setAnalyzeModal, setDescriptionModal } from '@/features/slices/modalSlice';
import { setManageColumnsPanel, setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useInputs, useLocalstorage } from '@/hooks';
import { dateFormatter, getColorBasedOnPercent, numFormatter, sepNumbers, toFixed, uuidv4 } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo, useRef } from 'react';
import Filters from '../components/Filters';
import StrategyActionCell from '../components/StrategyActionCell';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';

const LongCallDescription = dynamic(() => import('../Descriptions/LongCallDescription'), {
	ssr: false,
});

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

	const { inputs, setFieldValue, setFieldsValue } = useInputs<IStrategyFilter>({
		priceBasis: 'BestLimit',
		symbolBasis: 'BestLimit',
		pageSize: 20,
		pageNumber: 1,
	});

	const { data, isFetching } = useLongCallStrategyQuery({
		queryKey: [
			'longCallQuery',
			{ priceBasis: inputs.priceBasis, symbolBasis: inputs.symbolBasis, withCommission: useCommission },
		],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
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

	const readMore = () => {
		dispatch(
			setDescriptionModal({
				title: (
					<>
						{t(`${type}.title`)} <span className='text-gray-700'>({title})</span>
					</>
				),
				description: () => <LongCallDescription />,
				onRead: () => dispatch(setDescriptionModal(null)),
			}),
		);
	};

	const goToTheNextPage = () => {
		setFieldsValue((prev) => ({
			pageNumber: prev.pageNumber + 1,
		}));
	};

	const showColumnsPanel = () => {
		dispatch(
			setManageColumnsPanel({
				initialColumns: initialColumnsLongCall,
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnChanged: (_, columns) => setColumnsVisibility(columns),
				onReset: () => setColumnsVisibility(initialColumnsLongCall),
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.LongCall> & { colId: TLongCallColumns }>>(
		() => [
			{
				colId: 'baseSymbolTitle',
				headerName: 'نماد پایه',
				initialHide: initialHiddenColumnsLongCall.baseSymbolTitle,
				minWidth: 104,
				flex: 1,
				pinned: 'right',
				cellClass: 'cursor-pointer justify-end',
				onCellClicked: ({ data }) => onSymbolTitleClicked(data!.baseSymbolISIN),
				valueGetter: ({ data }) => data?.baseSymbolTitle ?? '−',
			},
			{
				colId: 'baseTradePriceVarPreviousTradePercent',
				headerName: 'قیمت پایه',
				initialHide: initialHiddenColumnsLongCall.baseTradePriceVarPreviousTradePercent,
				minWidth: 108,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.LongCall>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [
					data?.baseLastTradedPrice ?? 0,
					data?.baseTradePriceVarPreviousTradePercent ?? 0,
				],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'dueDays',
				headerName: 'مانده تا سررسید',
				initialHide: initialHiddenColumnsLongCall.dueDays,
				minWidth: 120,
				valueGetter: ({ data }) => data?.dueDays ?? 0,
			},
			{
				colId: 'symbolTitle',
				headerName: 'کال',
				initialHide: initialHiddenColumnsLongCall.symbolTitle,
				minWidth: 128,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.symbolISIN),
				valueGetter: ({ data }) => data?.symbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRendererRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.LongCall) => data!.iotm,
				},
			},
			{
				colId: 'strikePrice',
				headerName: 'قیمت اعمال',
				initialHide: initialHiddenColumnsLongCall.strikePrice,
				minWidth: 96,
				cellClass: 'gray',
				valueGetter: ({ data }) => data?.strikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'openPositionCount',
				headerName: 'موقعیت باز',
				initialHide: initialHiddenColumnsLongCall.openPositionCount,
				minWidth: 112,
				valueGetter: ({ data }) => data?.openPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'tradePriceVarPreviousTradePercent',
				headerName: 'قیمت نماد آپشن',
				initialHide: initialHiddenColumnsLongCall.tradePriceVarPreviousTradePercent,
				minWidth: 152,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.LongCall>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.premium ?? 0, data?.tradePriceVarPreviousTradePercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'optionBestSellLimitPrice',
				headerName: 'بهترین فروشنده',
				initialHide: initialHiddenColumnsLongCall.optionBestSellLimitPrice,
				minWidth: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.optionBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestSellLimitQuantity',
				headerName: 'حجم سرخط فروش',
				initialHide: initialHiddenColumnsLongCall.optionBestSellLimitQuantity,
				minWidth: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.optionBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestLimitPrice',
				headerName: 'بهترین خریدار',
				initialHide: initialHiddenColumnsLongCall.optionBestLimitPrice,
				minWidth: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionBestLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestLimitVolume',
				headerName: 'حجم سرخط خرید',
				initialHide: initialHiddenColumnsLongCall.optionBestLimitVolume,
				minWidth: 120,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionBestLimitVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'longCallBEP',
				headerName: 'سر به سر',
				initialHide: initialHiddenColumnsLongCall.longCallBEP,
				minWidth: 128,
				cellClass: ({ data }) =>
					getColorBasedOnPercent((data?.baseLastTradedPrice ?? 0) - (data?.longCallBEP ?? 0)),
				valueGetter: ({ data }) => data?.longCallBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'profitPercent',
				headerName: 'حداکثر بازده',
				initialHide: initialHiddenColumnsLongCall.profitPercent,
				minWidth: 160,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'سود در صورت اعمال به ازای یک قرارداد آپشن',
				},
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.LongCall>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.profitAmount ?? 0, data?.profitPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'profit',
				headerName: 'بازده',
				initialHide: initialHiddenColumnsLongCall.profit,
				minWidth: 104,
				valueFormatter: () => t('common.infinity'),
			},
			{
				colId: 'blackScholes',
				headerName: 'بلک شولز',
				initialHide: initialHiddenColumnsLongCall.blackScholes,
				minWidth: 96,
				valueGetter: ({ data }) => data?.blackScholes ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
			},
			{
				colId: 'timeValue',
				headerName: 'ارزش زمانی',
				initialHide: initialHiddenColumnsLongCall.timeValue,
				minWidth: 96,
				valueGetter: ({ data }) => data?.timeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'intrinsicValue',
				headerName: 'ارزش ذاتی',
				initialHide: initialHiddenColumnsLongCall.intrinsicValue,
				minWidth: 96,
				valueGetter: ({ data }) => data?.intrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'bepDifference',
				headerName: 'اختلاف تا سر به سر',
				initialHide: initialHiddenColumnsLongCall.bepDifference,
				minWidth: 136,
				valueGetter: ({ data }) => data?.bepDifference ?? 0,
				valueFormatter: ({ data }) => sepNumbers(String(data?.bepDifference ?? 0)),
			},
			{
				colId: 'tradeValue',
				headerName: 'ارزش معاملات آپشن',
				initialHide: initialHiddenColumnsLongCall.tradeValue,
				minWidth: 136,
				valueGetter: ({ data }) => data?.tradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeValue',
				headerName: 'ارزش معاملات سهم پایه',
				initialHide: initialHiddenColumnsLongCall.baseTradeValue,
				minWidth: 152,
				valueGetter: ({ data }) => data?.baseTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeCount',
				headerName: 'تعداد معاملات پایه',
				initialHide: initialHiddenColumnsLongCall.baseTradeCount,
				minWidth: 128,
				valueGetter: ({ data }) => data?.baseTradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseTradeVolume',
				headerName: 'حجم معاملات پایه',
				initialHide: initialHiddenColumnsLongCall.baseTradeVolume,
				minWidth: 136,
				valueGetter: ({ data }) => data?.baseTradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseLastTradedDate',
				headerName: 'آخرین معامله پایه',
				initialHide: initialHiddenColumnsLongCall.baseLastTradedDate,
				minWidth: 120,
				valueGetter: ({ data }) => data?.baseLastTradedDate ?? 0,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				colId: 'actions',
				headerName: 'عملیات',
				initialHide: initialHiddenColumnsLongCall.actions,
				width: 80,
				sortable: false,
				pinned: 'left',
				cellRenderer: StrategyActionCell,
				cellRendererParams: {
					analyze,
				},
			},
		],
		[],
	);

	return (
		<>
			<StrategyDetails strategy={strategy} steps={[t(`${type}.step_1`)]} readMore={readMore} />

			<div className='relative flex-1 gap-16 overflow-hidden rounded bg-white p-16 flex-column'>
				<Filters
					type={type}
					title={title}
					useCommission={useCommission}
					onManageColumns={showColumnsPanel}
					setFieldValue={setFieldValue}
					onCommissionChanged={setUseCommission}
					priceBasis={inputs.priceBasis}
					symbolBasis={inputs.symbolBasis}
				/>

				<Table<Strategy.LongCall>
					ref={gridRef}
					rowData={data ?? []}
					columnDefs={columnDefs}
					isFetching={isFetching}
					fetchNextPage={goToTheNextPage}
					pageNumber={inputs.pageNumber}
					pageSize={inputs.pageSize}
					columnsVisibility={columnsVisibility}
				/>
			</div>
		</>
	);
};

export default LongCall;
