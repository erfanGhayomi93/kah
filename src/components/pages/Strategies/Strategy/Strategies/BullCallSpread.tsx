import { useBullCallSpreadStrategyQuery } from '@/api/queries/strategyQuery';
import lightStreamInstance from '@/classes/Lightstream';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { ChartDownSVG, ChartUpSVG, StraightLineSVG } from '@/components/icons';
import { initialColumnsBullCallSpread, initialHiddenColumnsBullCallSpread } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import {
	setAnalyzeModal,
	setDescriptionModal,
	setManageColumnsModal,
	setStrategyFiltersModal,
} from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useInputs, useLocalstorage, useSubscription } from '@/hooks';
import { dateFormatter, getColorBasedOnPercent, numFormatter, sepNumbers, uuidv4 } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import Filters from '../components/Filters';
import StrategyActionCell from '../components/StrategyActionCell';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';

const BullCallSpreadDescription = dynamic(() => import('../Descriptions/BullCallSpreadDescription'), {
	ssr: false,
});

interface BullCallSpreadProps extends Strategy.GetAll {}

const BullCallSpread = (strategy: BullCallSpreadProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.BullCallSpread>>(null);

	const { subscribe } = useSubscription();

	const [hashTable, setHashTable] = useState<string[]>([]);

	const [useCommission, setUseCommission] = useLocalstorage('use_trade_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'bull_call_spread_strategy_columns',
		initialColumnsBullCallSpread,
	);

	const { inputs: filters, setInputs: setFilters } = useInputs<Partial<IBullCallSpreadFiltersModalState>>({});

	const { inputs, setFieldValue } = useInputs<IStrategyFilter>({
		priceBasis: 'BestLimitPrice',
		symbolBasis: 'BestLimit',
		pageSize: 20,
		pageNumber: 1,
	});

	const { data = [], isFetching } = useBullCallSpreadStrategyQuery({
		queryKey: [
			'bullCallSpreadQuery',
			{ priceBasis: inputs.priceBasis, symbolBasis: inputs.symbolBasis, withCommission: useCommission },
			{ ...filters },
		],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const analyze = (data: Strategy.BullCallSpread) => {
		try {
			const contracts: TSymbolStrategy[] = [
				{
					type: 'option',
					id: uuidv4(),
					symbol: {
						symbolTitle: data.lspSymbolTitle,
						symbolISIN: data.lspSymbolISIN,
						optionType: 'call',
						baseSymbolPrice: data.baseLastTradedPrice,
						historicalVolatility: data.historicalVolatility,
						contractSize: data.contractSize,
						settlementDay: new Date(data.contractEndDate),
						strikePrice: data.lspStrikePrice,
						requiredMargin: data.lspRequiredMargin,
					},
					price: data.lspPremium || 1,
					quantity: 1,
					side: 'buy',
					marketUnit: data.marketUnit,
				},
				{
					type: 'option',
					id: uuidv4(),
					symbol: {
						symbolTitle: data.hspSymbolTitle,
						symbolISIN: data.hspSymbolISIN,
						optionType: 'call',
						baseSymbolPrice: data.baseLastTradedPrice,
						historicalVolatility: data.historicalVolatility,
						contractSize: data.contractSize,
						settlementDay: new Date(data.contractEndDate),
						strikePrice: data.hspStrikePrice,
						requiredMargin: data.hspRequiredMargin,
					},
					price: data.hspPremium || 1,
					quantity: 1,
					side: 'sell',
					marketUnit: data.marketUnit,
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
						{t(`${type}.title`)} <span className='text-gray-500'>({title})</span>
					</>
				),
				description: () => <BullCallSpreadDescription />,
				onRead: () => dispatch(setDescriptionModal(null)),
			}),
		);
	};

	const showColumnsManagementModal = () => {
		dispatch(
			setManageColumnsModal({
				initialColumns: initialColumnsBullCallSpread,
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnsChanged: (columns) =>
					setColumnsVisibility(columns as Array<IManageColumn<TBullCallSpreadColumns>>),
				onReset: () => setColumnsVisibility(initialColumnsBullCallSpread),
			}),
		);
	};

	const onFiltersChanged = (newFilters: Partial<ILongCallFiltersModalState>) => {
		setFilters(newFilters);
	};

	const onSymbolUpdate = (updateInfo: ItemUpdate) => {
		try {
			const key: string = updateInfo.getItemName();
			const rowNode = gridRef.current!.getRowNode(key);

			if (!rowNode) return;

			const symbolData = { ...rowNode.data! };

			updateInfo.forEachChangedField((fieldName, _b, value) => {
				if (value && fieldName in symbolData) {
					const valueAsNumber = Number(value);

					// @ts-expect-error: Typescript can not detect lightstream types
					symbolData[fieldName] = isNaN(valueAsNumber) ? value : valueAsNumber;
				}
			});

			rowNode.setData(symbolData);
		} catch (e) {
			//
		}
	};

	const showFilters = () => {
		dispatch(
			setStrategyFiltersModal({
				baseSymbols: filters.baseSymbols ?? [],
				onSubmit: onFiltersChanged,
				filters: [
					{
						id: 'HSPIOTM',
						title: t('strategy_filters.HSPIOTM'),
						mode: 'array',
						type: 'string',
						data: [
							{
								value: 'atm',
								title: t('strategy_filters.atm'),
								icon: <StraightLineSVG />,
								className: {
									enable: 'btn-secondary',
									disabled: 'btn-secondary-outline',
								},
							},
							{
								value: 'otm',
								title: t('strategy_filters.otm'),
								icon: <ChartDownSVG />,
								className: {
									enable: 'btn-error',
									disabled: 'btn-error-outline',
								},
							},
							{
								value: 'itm',
								title: t('strategy_filters.itm'),
								icon: <ChartUpSVG />,
								className: {
									enable: 'btn-success',
									disabled: 'btn-success-outline',
								},
							},
						],
						initialValue: filters?.HSPIOTM ?? [],
					},
					{
						id: 'LSPIOTM',
						title: t('strategy_filters.LSPIOTM'),
						mode: 'array',
						type: 'string',
						data: [
							{
								value: 'atm',
								title: t('strategy_filters.atm'),
								icon: <StraightLineSVG />,
								className: {
									enable: 'btn-secondary',
									disabled: 'btn-secondary-outline',
								},
							},
							{
								value: 'otm',
								title: t('strategy_filters.otm'),
								icon: <ChartDownSVG />,
								className: {
									enable: 'btn-error',
									disabled: 'btn-error-outline',
								},
							},
							{
								value: 'itm',
								title: t('strategy_filters.itm'),
								icon: <ChartUpSVG />,
								className: {
									enable: 'btn-success',
									disabled: 'btn-success-outline',
								},
							},
						],
						initialValue: filters?.LSPIOTM ?? [],
					},
					{
						id: 'dueDays',
						title: t('strategy_filters.due_days'),
						mode: 'range',
						type: 'integer',
						label: [t('strategy_filters.from'), t('strategy_filters.to')],
						placeholder: [t('strategy_filters.first_value'), t('strategy_filters.second_value')],
						initialValue: [filters.dueDays?.[0] ?? null, filters.dueDays?.[1] ?? null],
					},
					{
						id: 'LSPLeastOpenPositions',
						title: t('strategy_filters.LSP_least_open_positions'),
						mode: 'single',
						type: 'integer',
						label: t('strategy_filters.from'),
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.LSPLeastOpenPositions ?? null,
					},
					{
						id: 'HSPLeastOpenPositions',
						title: t('strategy_filters.HSP_least_open_positions'),
						mode: 'single',
						type: 'integer',
						label: t('strategy_filters.from'),
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.HSPLeastOpenPositions ?? null,
					},
					{
						id: 'leastMaxProfitPercent',
						title: t('strategy_filters.max_profit'),
						mode: 'single',
						type: 'percent',
						label: t('strategy_filters.from'),
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.leastMaxProfitPercent ?? null,
					},
					{
						id: 'leastYTM',
						title: t('strategy_filters.ytm'),
						mode: 'single',
						type: 'integer',
						label: t('strategy_filters.from'),
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.leastYTM ?? null,
					},
				],
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.BullCallSpread> & { colId: TBullCallSpreadColumns }>>(
		() => [
			{
				colId: 'baseSymbolTitle',
				headerName: 'نماد پایه',
				initialHide: initialHiddenColumnsBullCallSpread.baseSymbolTitle,
				width: 104,
				maxWidth: 104,
				pinned: 'right',
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.baseSymbolISIN),
				valueGetter: ({ data }) => data?.baseSymbolTitle ?? '−',
			},
			{
				colId: 'baseTradePriceVarPreviousTradePercent',
				headerName: 'قیمت پایه',
				initialHide: initialHiddenColumnsBullCallSpread.baseTradePriceVarPreviousTradePercent,
				minWidth: 108,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.BullCallSpread>) => ({
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
				initialHide: initialHiddenColumnsBullCallSpread.dueDays,
				width: 120,
				valueGetter: ({ data }) => data?.dueDays ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspSymbolTitle',
				headerName: 'کال خرید',
				initialHide: initialHiddenColumnsBullCallSpread.lspSymbolTitle,
				minWidth: 144,
				maxWidth: 144,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.lspSymbolISIN),
				valueGetter: ({ data }) => data?.lspSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.BullCallSpread) => data?.lspiotm ?? 0,
				},
			},
			{
				colId: 'lspStrikePrice',
				headerName: 'قیمت اعمال کال خرید',
				initialHide: initialHiddenColumnsBullCallSpread.lspStrikePrice,
				width: 176,
				valueGetter: ({ data }) => data?.lspStrikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestSellLimitPrice',
				headerName: 'بهترین فروشنده کال خرید',
				initialHide: initialHiddenColumnsBullCallSpread.lspBestSellLimitPrice,
				cellClass: 'sell',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestSellLimitQuantity',
				headerName: 'حجم فروشنده کال خرید',
				initialHide: initialHiddenColumnsBullCallSpread.lspBestSellLimitQuantity,
				cellClass: 'sell',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestBuyLimitPrice',
				headerName: 'بهترین خریدار کال خرید',
				initialHide: initialHiddenColumnsBullCallSpread.lspBestBuyLimitPrice,
				cellClass: 'buy',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestBuyLimitQuantity',
				headerName: 'حجم خریدار کال خرید',
				initialHide: initialHiddenColumnsBullCallSpread.lspBestBuyLimitQuantity,
				cellClass: 'buy',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspSymbolTitle',
				headerName: 'کال فروش',
				initialHide: initialHiddenColumnsBullCallSpread.hspSymbolTitle,
				minWidth: 144,
				maxWidth: 144,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.hspSymbolISIN),
				valueGetter: ({ data }) => data?.hspSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.BullCallSpread) => data?.hspiotm ?? 0,
				},
			},
			{
				colId: 'hspStrikePrice',
				headerName: 'قیمت اعمال کال فروش',
				initialHide: initialHiddenColumnsBullCallSpread.hspStrikePrice,
				width: 176,
				valueGetter: ({ data }) => data?.hspStrikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestBuyLimitPrice',
				headerName: 'بهترین خریدار کال فروش',
				cellClass: 'buy',
				initialHide: initialHiddenColumnsBullCallSpread.hspBestBuyLimitPrice,
				width: 176,
				valueGetter: ({ data }) => data?.hspBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestBuyLimitQuantity',
				headerName: 'حجم خریدار کال فروش',
				cellClass: 'buy',
				initialHide: initialHiddenColumnsBullCallSpread.hspBestBuyLimitQuantity,
				width: 176,
				valueGetter: ({ data }) => data?.hspBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestSellLimitPrice',
				headerName: 'بهترین فروشنده کال فروش',
				cellClass: 'sell',
				initialHide: initialHiddenColumnsBullCallSpread.hspBestSellLimitPrice,
				width: 204,
				valueGetter: ({ data }) => data?.hspBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestSellLimitQuantity',
				headerName: 'حجم فروشنده کال فروش',
				cellClass: 'sell',
				initialHide: initialHiddenColumnsBullCallSpread.hspBestSellLimitQuantity,
				width: 192,
				valueGetter: ({ data }) => data?.hspBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspOpenPositionCount',
				headerName: 'موقعیت باز کال خرید',
				initialHide: initialHiddenColumnsBullCallSpread.lspOpenPositionCount,
				width: 152,
				valueGetter: ({ data }) => data?.lspOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspOpenPositionCount',
				headerName: 'موقعیت باز کال فروش',
				initialHide: initialHiddenColumnsBullCallSpread.hspOpenPositionCount,
				width: 152,
				valueGetter: ({ data }) => data?.hspOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspPremiumPercent',
				headerName: 'قیمت نماد کال خرید',
				initialHide: initialHiddenColumnsBullCallSpread.lspPremiumPercent,
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.BullCallSpread>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.lspPremium ?? 0, data?.lspPremiumPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'hspPremiumPercent',
				headerName: 'قیمت نماد کال فروش',
				initialHide: initialHiddenColumnsBullCallSpread.hspPremiumPercent,
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.BullCallSpread>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.hspPremium ?? 0, data?.hspPremiumPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'bullCallSpreadBEP',
				headerName: 'سر به سر',
				initialHide: initialHiddenColumnsBullCallSpread.bullCallSpreadBEP,
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'درصد گرانی یا همان درصد اختلاف سر به سر و قیمت فعلی',
				},
				valueGetter: ({ data }) => data?.bullCallSpreadBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'maxProfitPercent',
				headerName: 'حداکثر بازده',
				initialHide: initialHiddenColumnsBullCallSpread.maxProfitPercent,
				width: 184,
				initialSort: 'asc',
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'سود در صورت اعمال به ازای یک قرارداد آپشن',
				},
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.BullCallSpread>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.maxProfit ?? 0, data?.maxProfitPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'maxLoss',
				headerName: 'حداکثر زیان',
				initialHide: initialHiddenColumnsBullCallSpread.maxLoss,
				width: 152,
				cellClass: ({ value }) => getColorBasedOnPercent(value, true),
				valueGetter: ({ data }) => data?.maxLoss ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'inUseCapital',
				headerName: 'سرمایه درگیر',
				initialHide: initialHiddenColumnsBullCallSpread.inUseCapital,
				width: 96,
				valueGetter: ({ data }) => data?.inUseCapital ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspTimeValue',
				headerName: 'ارزش زمانی کال خرید',
				initialHide: initialHiddenColumnsBullCallSpread.lspTimeValue,
				width: 152,
				valueGetter: ({ data }) => data?.lspTimeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspTimeValue',
				headerName: 'ارزش زمانی کال فروش',
				initialHide: initialHiddenColumnsBullCallSpread.hspTimeValue,
				width: 152,
				valueGetter: ({ data }) => data?.hspTimeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspIntrinsicValue',
				headerName: 'ارزش ذاتی کال خرید',
				initialHide: initialHiddenColumnsBullCallSpread.lspIntrinsicValue,
				width: 152,
				valueGetter: ({ data }) => data?.lspIntrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspIntrinsicValue',
				headerName: 'ارزش ذاتی کال فروش',
				initialHide: initialHiddenColumnsBullCallSpread.hspIntrinsicValue,
				width: 152,
				valueGetter: ({ data }) => data?.hspIntrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspTradeValue',
				headerName: 'ارزش معاملات آپشن کال خرید',
				initialHide: initialHiddenColumnsBullCallSpread.lspTradeValue,
				width: 192,
				valueGetter: ({ data }) => data?.lspTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'hspTradeValue',
				headerName: 'ارزش معاملات آپشن کال فروش',
				initialHide: initialHiddenColumnsBullCallSpread.hspTradeValue,
				width: 192,
				valueGetter: ({ data }) => data?.hspTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeValue',
				headerName: 'ارزش معاملات سهم پایه',
				initialHide: initialHiddenColumnsBullCallSpread.baseTradeValue,
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeCount',
				headerName: 'تعداد معاملات پایه',
				initialHide: initialHiddenColumnsBullCallSpread.baseTradeCount,
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseTradeVolume',
				headerName: 'حجم معاملات پایه',
				initialHide: initialHiddenColumnsBullCallSpread.baseTradeVolume,
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseLastTradedDate',
				headerName: 'آخرین معامله پایه',
				initialHide: initialHiddenColumnsBullCallSpread.baseLastTradedDate,
				width: 152,
				valueGetter: ({ data }) => data?.baseLastTradedDate ?? 0,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				colId: 'ytm',
				headerName: 'YTM (بازده موثر)',
				initialHide: initialHiddenColumnsBullCallSpread.ytm,
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده موثر تا سررسید',
				},
				cellClass: ({ value }) => getColorBasedOnPercent(value),
				valueGetter: ({ data }) => data?.ytm ?? 0,
				valueFormatter: ({ value }) => {
					if (+value === 10000) return 'بزرگتر از 10,000';
					else if (+value === -10000) return 'کمتر از 10,000';
					else return value;
				},
			},
			{
				colId: 'actions',
				headerName: 'عملیات',
				initialHide: initialHiddenColumnsBullCallSpread.actions,
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
		const sub = lightStreamInstance.subscribe({
			mode: 'MERGE',
			items: hashTable,
			fields: [
				'baseSymbolISIN',
				'baseSymbolTitle',
				'baseLastTradedPrice',
				'baseTradePriceVarPreviousTradePercent',
				'dueDays',
				'lspSymbolISIN',
				'lspSymbolTitle',
				'lspStrikePrice',
				'lspBestSellLimitPrice',
				'lspBestSellLimitQuantity',
				'lspBestBuyLimitPrice',
				'lspBestBuyLimitQuantity',
				'hspSymbolISIN',
				'hspSymbolTitle',
				'hspStrikePrice',
				'hspBestBuyLimitPrice',
				'hspBestBuyLimitQuantity',
				'hspBestSellLimitPrice',
				'hspBestSellLimitQuantity',
				'lspOpenPositionCount',
				'hspOpenPositionCount',
				'lspiotm',
				'hspiotm',
				'lspPremium',
				'lspPremiumPercent',
				'hspPremium',
				'hspPremiumPercent',
				'bullCallSpreadBEP',
				'bepDifference',
				'bepDifferencePercent',
				'maxProfit',
				'maxProfitPercent',
				'maxLoss',
				'inUseCapital',
				'lspTimeValue',
				'hspTimeValue',
				'lspIntrinsicValue',
				'hspIntrinsicValue',
				'lspTradeValue',
				'hspTradeValue',
				'baseTradeValue',
				'baseTradeCount',
				'baseTradeVolume',
				'baseLastTradedDate',
				'ytm',
				'baseMarketUnit',
				'marketUnit',
				'historicalVolatility',
				'lspRequiredMargin',
				'hspRequiredMargin',
				'contractEndDate',
				'contractSize',
				'withCommission',
				'priceType',
			],
			dataAdapter: 'RamandRLCDData',
			snapshot: true,
		});

		sub.addEventListener('onItemUpdate', onSymbolUpdate);
		subscribe(sub);
	}, [hashTable.join(',')]);

	return (
		<>
			<StrategyDetails
				strategy={strategy}
				steps={[t(`${type}.step_1`), t(`${type}.step_2`)]}
				condition={t(`${type}.condition`)}
				readMore={readMore}
			/>

			<div className='relative flex-1 gap-16 overflow-hidden rounded bg-white p-16 flex-column darkness:bg-gray-50'>
				<Filters
					type={type}
					title={title}
					useCommission={useCommission}
					onManageColumns={showColumnsManagementModal}
					setFieldValue={setFieldValue}
					onCommissionChanged={setUseCommission}
					priceBasis={inputs.priceBasis}
					symbolBasis={inputs.symbolBasis}
					onShowFilters={showFilters}
					filtersCount={Object.keys(filters).length}
				/>

				<Table<Strategy.BullCallSpread>
					ref={gridRef}
					rowData={data ?? []}
					columnDefs={columnDefs}
					isFetching={isFetching}
					columnsVisibility={columnsVisibility}
					dependencies={[useCommission]}
					setHashTable={setHashTable}
				/>
			</div>
		</>
	);
};

export default BullCallSpread;
