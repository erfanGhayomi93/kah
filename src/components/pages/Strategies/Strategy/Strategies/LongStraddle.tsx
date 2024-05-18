import { useLongStraddleStrategyQuery } from '@/api/queries/strategyQuery';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRendererRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import { initialColumnsLongStraddle } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import { setAnalyzeModal, setDescriptionModal } from '@/features/slices/modalSlice';
import { setManageColumnsPanel, setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useInputs, useLocalstorage } from '@/hooks';
import { dateFormatter, numFormatter, sepNumbers, uuidv4 } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';
import Filters from '../components/Filters';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';
import StrategyActionCell from '../TableComponents/StrategyActionCell';

const LongStraddleDescription = dynamic(() => import('../Descriptions/LongStraddleDescription'), {
	ssr: false,
});

interface LongStraddleProps extends Strategy.GetAll {}

const LongStraddle = (strategy: LongStraddleProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.LongStraddle>>(null);

	const [useCommission, setUseCommission] = useLocalstorage('use_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'Long_straddle_strategy_columns',
		initialColumnsLongStraddle,
	);

	const { inputs, setFieldValue, setFieldsValue } = useInputs<IStrategyFilter>({
		priceBasis: 'BestLimit',
		symbolBasis: 'BestLimit',
		pageSize: 20,
		pageNumber: 1,
	});

	const { data, isFetching } = useLongStraddleStrategyQuery({
		queryKey: ['longStraddleQuery', { ...inputs, withCommission: useCommission }],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const analyze = (data: Strategy.LongStraddle) => {
		const contracts: TSymbolStrategy[] = [
			{
				type: 'option',
				id: uuidv4(),
				symbol: {
					symbolTitle: data.callSymbolTitle,
					symbolISIN: data.callSymbolISIN,
					optionType: 'call',
					baseSymbolPrice: data.baseLastTradedPrice,
					historicalVolatility: data.historicalVolatility,
				},
				contractSize: data.contractSize,
				price: data.callPremium || 1,
				quantity: 1,
				settlementDay: data.contractEndDate,
				strikePrice: data.strikePrice,
				side: 'buy',
				marketUnit: data.marketUnit,
				requiredMargin: {
					value: data.callRequiredMargin,
				},
			},
			{
				type: 'option',
				id: uuidv4(),
				symbol: {
					symbolTitle: data.putSymbolTitle,
					symbolISIN: data.putSymbolISIN,
					optionType: 'put',
					baseSymbolPrice: data.baseLastTradedPrice,
					historicalVolatility: data.historicalVolatility,
				},
				contractSize: data.contractSize,
				price: data.putPremium || 1,
				quantity: 1,
				settlementDay: data.contractEndDate,
				strikePrice: data.strikePrice,
				side: 'buy',
				marketUnit: data.marketUnit,
				requiredMargin: {
					value: data.putRequiredMargin,
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

	const readMore = () => {
		dispatch(
			setDescriptionModal({
				title: (
					<>
						{t(`${type}.title`)} <span className='text-gray-700'>({title})</span>
					</>
				),
				description: () => <LongStraddleDescription />,
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
				initialColumns: initialColumnsLongStraddle,
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnChanged: (_, columns) => setColumnsVisibility(columns),
				onReset: () => setColumnsVisibility(initialColumnsLongStraddle),
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.LongStraddle>>>(
		() => [
			{
				colId: 'baseSymbolTitle',
				headerName: 'نماد پایه',
				width: 104,
				pinned: 'right',
				cellClass: 'cursor-pointer justify-end',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.baseSymbolISIN),
				valueGetter: ({ data }) => data?.baseSymbolTitle ?? '−',
			},
			{
				colId: 'baseTradePriceVarPreviousTradePercent',
				headerName: 'قیمت پایه',
				minWidth: 108,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.LongStraddle, number>) => ({
					percent: data?.baseTradePriceVarPreviousTradePercent ?? 0,
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
				colId: 'callSymbolTitle',
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
				colId: 'callBestSellLimitPrice',
				headerName: 'قیمت فروشنده کال',
				width: 176,
				valueGetter: ({ data }) => data?.callBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callBestSellLimitQuantity',
				headerName: 'حجم فروشنده کال',
				width: 176,
				valueGetter: ({ data }) => data?.callBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putSymbolTitle',
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
				headerName: 'قیمت فروشنده پوت',
				width: 176,
				valueGetter: ({ data }) => data?.putBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putBestSellLimitQuantity',
				headerName: 'حجم فروشنده پوت',
				width: 176,
				valueGetter: ({ data }) => data?.putBestSellLimitQuantity ?? 0,
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
				colId: 'putOpenPositionCount',
				headerName: 'موقعیت باز پوت',
				width: 152,
				valueGetter: ({ data }) => data?.putOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callPremiumPercent',
				headerName: 'قیمت نماد کال',
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.LongStraddle, number>) => ({
					percent: data?.callPremiumPercent ?? 0,
				}),
				valueGetter: ({ data }) => [data?.callPremium ?? 0, data?.callPremiumPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'putPremiumPercent',
				headerName: 'قیمت نماد پوت',
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.LongStraddle, number>) => ({
					percent: data?.putPremiumPercent ?? 0,
				}),
				valueGetter: ({ data }) => [data?.putPremium ?? 0, data?.putPremiumPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'highBEP',
				headerName: 'سر به سر بالا',
				width: 152,
				valueGetter: ({ data }) => data?.highBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lowBEP',
				headerName: 'سر به سر پایین',
				width: 152,
				valueGetter: ({ data }) => data?.lowBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'maxLoss',
				headerName: 'حداکثر زیان زیان',
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
				colId: 'callTimeValue',
				headerName: 'ارزش زمانی کال',
				width: 152,
				valueGetter: ({ data }) => data?.callTimeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putTimeValue',
				headerName: 'ارزش زمانی پوت',
				width: 152,
				valueGetter: ({ data }) => data?.putTimeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callIntrinsicValue',
				headerName: 'ارزش ذاتی کال',
				width: 152,
				valueGetter: ({ data }) => data?.callIntrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putIntrinsicValue',
				headerName: 'ارزش ذاتی پوت',
				width: 152,
				valueGetter: ({ data }) => data?.putIntrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callBestSellLimitPrice',
				headerName: 'بهترین خریدار کال',
				width: 176,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.callBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callBestSellLimitQuantity',
				headerName: 'حجم سر خط خرید کال',
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.callBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putBestSellLimitPrice',
				headerName: 'بهترین خریدار پوت',
				width: 176,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.putBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putBestSellLimitQuantity',
				headerName: 'حجم سر خط خرید پوت',
				width: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.putBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
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

	return (
		<>
			<StrategyDetails
				strategy={strategy}
				steps={[t(`${type}.step_1`), t(`${type}.step_2`)]}
				condition={t(`${type}.condition`)}
				readMore={readMore}
			/>

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

				<Table<Strategy.LongStraddle>
					ref={gridRef}
					rowData={data ?? []}
					columnDefs={columnDefs}
					isFetching={isFetching}
					fetchNextPage={goToTheNextPage}
					pageNumber={inputs.pageNumber}
					pageSize={inputs.pageSize}
				/>
			</div>
		</>
	);
};

export default LongStraddle;
