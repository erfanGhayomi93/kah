import { useLongStraddleStrategyQuery } from '@/api/queries/strategyQuery';
import lightStreamInstance from '@/classes/Lightstream';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import { ChartDownSVG, ChartUpSVG, StraightLineSVG } from '@/components/icons';
import { initialColumnsLongStraddle, initialHiddenColumnsLongStraddle } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import {
	setAnalyzeModal,
	setDescriptionModal,
	setManageColumnsModal,
	setStrategyFiltersModal,
} from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useInputs, useLocalstorage, useSubscription } from '@/hooks';
import { dateFormatter, numFormatter, sepNumbers, uuidv4 } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';
import Filters from '../components/Filters';
import StrategyActionCell from '../components/StrategyActionCell';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';

const LongStraddleDescription = dynamic(() => import('../Descriptions/LongStraddleDescription'), {
	ssr: false,
});

type THashTable = Record<string, number>;

interface LongStraddleProps extends Strategy.GetAll {}

const LongStraddle = (strategy: LongStraddleProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.LongStraddle>>(null);

	const symbolsHashTableRef = useRef<THashTable>({});

	const { subscribe } = useSubscription();

	const [useCommission, setUseCommission] = useLocalstorage('use_trade_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'Long_straddle_strategy_columns',
		initialColumnsLongStraddle,
	);

	const { inputs, setFieldValue } = useInputs<IStrategyFilter>({
		priceBasis: 'BestLimitPrice',
		symbolBasis: 'BestLimit',
		pageSize: 20,
		pageNumber: 1,
	});

	const { inputs: filters, setInputs: setFilters } = useInputs<Partial<ILongStraddleFiltersModalStates>>({});

	const { data = [], isFetching } = useLongStraddleStrategyQuery({
		queryKey: [
			'longStraddleQuery',
			{ priceBasis: inputs.priceBasis, symbolBasis: inputs.symbolBasis, withCommission: useCommission },
			{ ...filters },
		],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const onFiltersChanged = (newFilters: Partial<ILongStraddleFiltersModalStates>) => {
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
					contractSize: data.contractSize,
					settlementDay: new Date(data.contractEndDate),
					strikePrice: data.strikePrice,
					requiredMargin: data.callRequiredMargin,
				},
				price: data.callPremium || 1,
				quantity: 1,
				side: 'buy',
				marketUnit: data.callMarketUnit,
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
					contractSize: data.contractSize,
					settlementDay: new Date(data.contractEndDate),
					strikePrice: data.strikePrice,
					requiredMargin: data.putRequiredMargin,
				},
				price: data.putPremium || 1,
				quantity: 1,
				side: 'buy',
				marketUnit: data.putMarketUnit,
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
						{t(`${type}.title`)} <span className='text-gray-500'>({title})</span>
					</>
				),
				description: () => <LongStraddleDescription />,
				onRead: () => dispatch(setDescriptionModal(null)),
			}),
		);
	};

	const showColumnsManagementModal = () => {
		dispatch(
			setManageColumnsModal({
				initialColumns: initialColumnsLongStraddle,
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnsChanged: (columns) =>
					setColumnsVisibility(columns as Array<IManageColumn<TLongStraddleColumns>>),
				onReset: () => setColumnsVisibility(initialColumnsLongStraddle),
			}),
		);
	};

	const iotm = [
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
	];

	const showFilters = () => {
		try {
			dispatch(
				setStrategyFiltersModal({
					baseSymbols: filters?.baseSymbols ?? [],
					onSubmit: onFiltersChanged,
					filters: [
						{
							id: 'callIOTM',
							title: t('strategy_filters.call_IOTM'),
							mode: 'array',
							type: 'string',
							data: iotm,
							initialValue: filters.callIOTM ?? [],
						},
						{
							id: 'putIOTM',
							title: t('strategy_filters.put_IOTM'),
							mode: 'array',
							type: 'string',
							data: iotm,
							initialValue: filters.putIOTM ?? [],
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
							id: 'callOpenPositions',
							title: t('strategy_filters.call_open_positions'),
							mode: 'single',
							type: 'integer',
							label: t('strategy_filters.from'),
							initialValue: filters.callOpenPosition ?? null,
						},
						{
							id: 'putOpenPositions',
							title: t('strategy_filters.put_open_positions'),
							mode: 'single',
							type: 'integer',
							label: t('strategy_filters.from'),
							initialValue: filters.putOpenPosition ?? null,
						},
					],
				}),
			);
		} catch (e) {
			//
		}
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.LongStraddle> & { colId: TLongStraddleColumns }>>(
		() => [
			{
				colId: 'baseSymbolTitle',
				headerName: 'نماد پایه',
				initialHide: initialHiddenColumnsLongStraddle.baseSymbolTitle,
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
				initialHide: initialHiddenColumnsLongStraddle.baseTradePriceVarPreviousTradePercent,
				minWidth: 108,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.LongStraddle>) => ({
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
				initialHide: initialHiddenColumnsLongStraddle.dueDays,
				width: 120,
				valueGetter: ({ data }) => data?.dueDays ?? 0,
			},
			{
				colId: 'strikePrice',
				headerName: 'قیمت اعمال',
				initialHide: initialHiddenColumnsLongStraddle.strikePrice,
				width: 96,
				cellClass: 'gray',
				valueGetter: ({ data }) => data?.strikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callSymbolTitle',
				headerName: 'کال',
				initialHide: initialHiddenColumnsLongStraddle.callSymbolTitle,
				minWidth: 144,
				maxWidth: 144,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.callSymbolISIN),
				valueGetter: ({ data }) => data?.callSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.LongStraddle) => data!.callIOTM,
				},
			},
			{
				colId: 'callBestSellLimitPrice',
				headerName: 'قیمت فروشنده کال',
				cellClass: 'sell',
				initialHide: initialHiddenColumnsLongStraddle.callBestSellLimitPrice,
				width: 176,
				valueGetter: ({ data }) => data?.callBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callBestSellLimitQuantity',
				headerName: 'حجم فروشنده کال',
				cellClass: 'sell',
				initialHide: initialHiddenColumnsLongStraddle.callBestSellLimitQuantity,
				width: 176,
				valueGetter: ({ data }) => data?.callBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putSymbolTitle',
				headerName: 'پوت',
				initialHide: initialHiddenColumnsLongStraddle.putSymbolTitle,
				minWidth: 144,
				maxWidth: 144,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.putSymbolISIN),
				valueGetter: ({ data }) => data?.putSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.LongStraddle) => data!.putIOTM,
				},
			},
			{
				colId: 'putBestSellLimitPrice',
				headerName: 'قیمت فروشنده پوت',
				cellClass: 'sell',
				initialHide: initialHiddenColumnsLongStraddle.putBestSellLimitPrice,
				width: 176,
				valueGetter: ({ data }) => data?.putBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putBestSellLimitQuantity',
				headerName: 'حجم فروشنده پوت',
				cellClass: 'sell',
				initialHide: initialHiddenColumnsLongStraddle.putBestSellLimitQuantity,
				width: 176,
				valueGetter: ({ data }) => data?.putBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callOpenPositionCount',
				headerName: 'موقعیت باز کال',
				initialHide: initialHiddenColumnsLongStraddle.callOpenPositionCount,
				width: 152,
				valueGetter: ({ data }) => data?.callOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putOpenPositionCount',
				headerName: 'موقعیت باز پوت',
				initialHide: initialHiddenColumnsLongStraddle.putOpenPositionCount,
				width: 152,
				valueGetter: ({ data }) => data?.putOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callPremiumPercent',
				headerName: 'قیمت نماد کال',
				initialHide: initialHiddenColumnsLongStraddle.callPremiumPercent,
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.LongStraddle>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.callPremium ?? 0, data?.callPremiumPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'putPremiumPercent',
				headerName: 'قیمت نماد پوت',
				initialHide: initialHiddenColumnsLongStraddle.putPremiumPercent,
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.LongStraddle>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.putPremium ?? 0, data?.putPremiumPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'highBEP',
				headerName: 'سر به سر بالا',
				initialHide: initialHiddenColumnsLongStraddle.highBEP,
				width: 152,
				valueGetter: ({ data }) => data?.highBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lowBEP',
				headerName: 'سر به سر پایین',
				initialHide: initialHiddenColumnsLongStraddle.lowBEP,
				width: 152,
				valueGetter: ({ data }) => data?.lowBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'maxLoss',
				headerName: 'حداکثر زیان زیان',
				initialHide: initialHiddenColumnsLongStraddle.maxLoss,
				width: 152,
				valueGetter: ({ data }) => data?.maxLoss ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'inUseCapital',
				headerName: 'سرمایه درگیر',
				initialHide: initialHiddenColumnsLongStraddle.inUseCapital,
				width: 96,
				valueGetter: ({ data }) => data?.inUseCapital ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callTimeValue',
				headerName: 'ارزش زمانی کال',
				initialHide: initialHiddenColumnsLongStraddle.callTimeValue,
				width: 152,
				valueGetter: ({ data }) => data?.callTimeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putTimeValue',
				headerName: 'ارزش زمانی پوت',
				initialHide: initialHiddenColumnsLongStraddle.putTimeValue,
				width: 152,
				valueGetter: ({ data }) => data?.putTimeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callIntrinsicValue',
				headerName: 'ارزش ذاتی کال',
				initialHide: initialHiddenColumnsLongStraddle.callIntrinsicValue,
				width: 152,
				valueGetter: ({ data }) => data?.callIntrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putIntrinsicValue',
				headerName: 'ارزش ذاتی پوت',
				initialHide: initialHiddenColumnsLongStraddle.putIntrinsicValue,
				width: 152,
				valueGetter: ({ data }) => data?.putIntrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callBestBuyLimitPrice',
				headerName: 'بهترین خریدار کال',
				initialHide: initialHiddenColumnsLongStraddle.callBestBuyLimitPrice,
				width: 176,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.callBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			/* {
				colId: 'callBestBuyLimitQuantity',
				headerName: 'حجم سرخط خرید کال',
				initialHide: initialHiddenColumnsLongStraddle.callBestBuyLimitQuantity,
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.callBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			}, */
			{
				colId: 'putBestBuyLimitPrice',
				headerName: 'بهترین خریدار پوت',
				initialHide: initialHiddenColumnsLongStraddle.putBestBuyLimitPrice,
				width: 176,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.putBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			/* {
				colId: 'putBestBuyLimitQuantity',
				headerName: 'حجم سرخط خرید پوت',
				initialHide: initialHiddenColumnsLongStraddle.putBestBuyLimitQuantity,
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.putBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			}, */
			{
				colId: 'callTradeValue',
				headerName: 'ارزش معاملات کال',
				initialHide: initialHiddenColumnsLongStraddle.callTradeValue,
				width: 160,
				initialSort: 'asc',
				valueGetter: ({ data }) => data?.callTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'putTradeValue',
				headerName: 'ارزش معاملات پوت',
				initialHide: initialHiddenColumnsLongStraddle.putTradeValue,
				width: 160,
				valueGetter: ({ data }) => data?.putTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeValue',
				headerName: 'ارزش معاملات سهم پایه',
				initialHide: initialHiddenColumnsLongStraddle.baseTradeValue,
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeCount',
				headerName: 'تعداد معاملات پایه',
				initialHide: initialHiddenColumnsLongStraddle.baseTradeCount,
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseTradeVolume',
				headerName: 'حجم معاملات پایه',
				initialHide: initialHiddenColumnsLongStraddle.baseTradeVolume,
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseLastTradedDate',
				headerName: 'آخرین معامله پایه',
				initialHide: initialHiddenColumnsLongStraddle.baseLastTradedDate,
				width: 152,
				valueGetter: ({ data }) => data?.baseLastTradeDate ?? 0,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				colId: 'actions',
				headerName: 'عملیات',
				initialHide: initialHiddenColumnsLongStraddle.actions,
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

	const symbolsHashTable = useMemo(() => {
		const hashTable: THashTable = {};

		try {
			const l = data.length;
			for (let i = 0; i < l; i++) {
				hashTable[data[i].key] = i;
			}
		} catch (e) {
			//
		}

		symbolsHashTableRef.current = hashTable;
		return hashTable;
	}, [data]);

	useEffect(() => {
		const sub = lightStreamInstance.subscribe({
			mode: 'MERGE',
			items: Object.keys(symbolsHashTable),
			fields: [
				'baseSymbolISIN',
				'baseSymbolTitle',
				'baseLastTradedPrice',
				'baseTradePriceVarPreviousTradePercent',
				'dueDays',
				'strikePrice',
				'callSymbolISIN',
				'callSymbolTitle',
				'callBestSellLimitPrice',
				'callBestSellLimitQuantity',
				'putSymbolISIN',
				'putSymbolTitle',
				'putBestSellLimitPrice',
				'putBestSellLimitQuantity',
				'callOpenPositionCount',
				'putOpenPositionCount',
				'callIOTM',
				'putIOTM',
				'callPremium',
				'callPremiumPercent',
				'putPremium',
				'putPremiumPercent',
				'lowBEP',
				'highBEP',
				'maxLoss',
				'inUseCapital',
				'callTimeValue',
				'putTimeValue',
				'callIntrinsicValue',
				'putIntrinsicValue',
				'callTradeValue',
				'putTradeValue',
				'callBestBuyLimitPrice',
				'callBestBuyLimitQuantity',
				'putBestBuyLimitPrice',
				'putBestBuyLimitQuantity',
				'baseTradeValue',
				'baseTradeCount',
				'baseTradeVolume',
				'baseLastTradeDate',
				'baseMarketUnit',
				'callMarketUnit',
				'putMarketUnit',
				'historicalVolatility',
				'callRequiredMargin',
				'putRequiredMargin',
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
	}, [JSON.stringify(symbolsHashTable)]);

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
					filtersCount={Object.keys(filters).length}
					useCommission={useCommission}
					onManageColumns={showColumnsManagementModal}
					setFieldValue={setFieldValue}
					onCommissionChanged={setUseCommission}
					onShowFilters={showFilters}
					priceBasis={inputs.priceBasis}
					symbolBasis={inputs.symbolBasis}
				/>

				<Table<Strategy.LongStraddle>
					ref={gridRef}
					rowData={data ?? []}
					columnDefs={columnDefs}
					isFetching={isFetching}
					columnsVisibility={columnsVisibility}
					dependencies={[useCommission]}
				/>
			</div>
		</>
	);
};

export default LongStraddle;
