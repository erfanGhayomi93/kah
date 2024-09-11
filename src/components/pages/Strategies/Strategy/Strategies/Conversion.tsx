import { useConversionStrategyQuery } from '@/api/queries/strategyQuery';
import lightStreamInstance from '@/classes/Lightstream';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { ChartDownSVG, ChartUpSVG, StraightLineSVG } from '@/components/icons';
import { initialColumnsConversion, initialHiddenColumnsConversion } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import {
	setAnalyzeModal,
	setDescriptionModal,
	setManageColumnsModal,
	setStrategyFiltersModal,
} from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useInputs, useLocalstorage, useSubscription } from '@/hooks';
import { dateFormatter, getColorBasedOnPercent, numFormatter, sepNumbers, toFixed, uuidv4 } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';
import Filters from '../components/Filters';
import StrategyActionCell from '../components/StrategyActionCell';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';

const ConversionDescription = dynamic(() => import('../Descriptions/ConversionDescription'), {
	ssr: false,
});

type THashTable = Record<string, number>;

interface ConversionProps extends Strategy.GetAll {}

const Conversion = (strategy: ConversionProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.Conversion>>(null);

	const symbolsHashTableRef = useRef<THashTable>({});

	const { subscribe } = useSubscription();

	const [useCommission, setUseCommission] = useLocalstorage('use_trade_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'conversion_strategy_columns',
		initialColumnsConversion,
	);

	const { inputs: filters, setInputs: setFilters } = useInputs<Partial<IConversionFiltersModalState>>({});

	const { inputs, setFieldValue } = useInputs<IStrategyFilter>({
		priceBasis: 'BestLimitPrice',
		symbolBasis: 'BestLimit',
		pageSize: 20,
		pageNumber: 1,
	});

	const { data = [], isFetching } = useConversionStrategyQuery({
		queryKey: [
			'conversionQuery',
			{ priceBasis: inputs.priceBasis, symbolBasis: inputs.symbolBasis, withCommission: useCommission },
			{ ...filters },
		],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const analyze = (data: Strategy.Conversion) => {
		try {
			const contracts: TSymbolStrategy[] = [
				{
					type: 'base',
					id: uuidv4(),
					marketUnit: data.baseMarketUnit,
					quantity: data.contractSize,
					price: data.baseLastTradedPrice,
					side: 'buy',
					symbol: {
						symbolTitle: data.baseSymbolTitle,
						symbolISIN: data.baseSymbolISIN,
						baseSymbolPrice: data.baseLastTradedPrice,
						contractSize: data.contractSize,
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
					side: 'sell',
					marketUnit: data.callMarketUnit,
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
				description: () => <ConversionDescription />,
				onRead: () => dispatch(setDescriptionModal(null)),
			}),
		);
	};

	const showColumnsManagementModal = () => {
		dispatch(
			setManageColumnsModal({
				initialColumns: initialColumnsConversion,
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnsChanged: (columns) =>
					setColumnsVisibility(columns as Array<IManageColumn<TConversionColumns>>),
				onReset: () => setColumnsVisibility(initialColumnsConversion),
			}),
		);
	};

	const onFiltersChanged = (newFilters: Partial<ILongPutFiltersModalState>) => {
		setFilters(newFilters);
	};

	const showFilters = () => {
		dispatch(
			setStrategyFiltersModal({
				baseSymbols: filters.baseSymbols ?? [],
				onSubmit: onFiltersChanged,
				filters: [
					{
						id: 'callIOTM',
						title: t('strategy_filters.call_IOTM'),
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
						initialValue: filters?.callIOTM ?? [],
					},
					{
						id: 'putIOTM',
						title: t('strategy_filters.put_IOTM'),
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
						initialValue: filters?.putIOTM ?? [],
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
						id: 'callLeastOpenPositions',
						title: t('strategy_filters.call_least_open_positions'),
						mode: 'single',
						type: 'integer',
						label: t('strategy_filters.from'),
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.callLeastOpenPositions ?? null,
					},
					{
						id: 'putLeastOpenPositions',
						title: t('strategy_filters.put_least_open_positions'),
						mode: 'single',
						type: 'integer',
						label: t('strategy_filters.from'),
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.putLeastOpenPositions ?? null,
					},
					{
						id: 'leastYTM',
						title: t('strategy_filters.ytm'),
						mode: 'single',
						type: 'percent',
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.leastYTM ?? null,
					},
				],
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.Conversion> & { colId: TConversionColumns }>>(
		() => [
			{
				colId: 'baseSymbolTitle',
				headerName: 'نماد پایه',
				initialHide: initialHiddenColumnsConversion.baseSymbolTitle,
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
				initialHide: initialHiddenColumnsConversion.baseTradePriceVarPreviousTradePercent,
				minWidth: 108,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.Conversion>) => ({
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
				initialHide: initialHiddenColumnsConversion.dueDays,
				width: 120,
				valueGetter: ({ data }) => data?.dueDays ?? 0,
			},
			{
				colId: 'strikePrice',
				headerName: 'قیمت اعمال',
				initialHide: initialHiddenColumnsConversion.strikePrice,
				width: 96,
				cellClass: 'gray',
				valueGetter: ({ data }) => data?.strikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callPremiumPercent',
				headerName: 'قیمت نماد کال',
				initialHide: initialHiddenColumnsConversion.callPremiumPercent,
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.Conversion>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.callPremium ?? 0, data?.callPremiumPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'putPremiumPercent',
				headerName: 'قیمت نماد پوت',
				initialHide: initialHiddenColumnsConversion.putPremiumPercent,
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.Conversion>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.putPremium ?? 0, data?.putPremiumPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'callSymbolTitle',
				headerName: 'کال',
				initialHide: initialHiddenColumnsConversion.callSymbolTitle,
				minWidth: 144,
				maxWidth: 144,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.callSymbolISIN),
				valueGetter: ({ data }) => data?.callSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.Conversion) => data!.callIOTM,
				},
			},
			{
				colId: 'callBestBuyLimitPrice',
				headerName: 'بهترین خریدار کال',
				initialHide: initialHiddenColumnsConversion.callBestBuyLimitPrice,
				width: 176,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.callBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callBestBuyLimitQuantity',
				headerName: 'حجم سرخط خرید کال',
				initialHide: initialHiddenColumnsConversion.callBestBuyLimitQuantity,
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.callBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callOpenPositionCount',
				headerName: 'موقعیت باز کال',
				initialHide: initialHiddenColumnsConversion.callOpenPositionCount,
				width: 152,
				valueGetter: ({ data }) => data?.callOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callBestSellLimitPrice',
				headerName: 'بهترین فروشنده کال',
				cellClass: 'sell',
				initialHide: initialHiddenColumnsConversion.callBestSellLimitPrice,
				width: 204,
				valueGetter: ({ data }) => data?.callBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'callBestSellLimitQuantity',
				headerName: 'حجم سرخط فروش کال',
				cellClass: 'sell',
				initialHide: initialHiddenColumnsConversion.callBestSellLimitQuantity,
				width: 192,
				valueGetter: ({ data }) => data?.callBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putSymbolTitle',
				headerName: 'پوت',
				initialHide: initialHiddenColumnsConversion.putSymbolTitle,
				minWidth: 144,
				maxWidth: 144,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.putSymbolISIN),
				valueGetter: ({ data }) => data?.putSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.Conversion) => data!.putIOTM,
				},
			},
			{
				colId: 'putBestSellLimitPrice',
				headerName: 'بهترین فروشنده پوت',
				cellClass: 'sell',
				initialHide: initialHiddenColumnsConversion.putBestSellLimitPrice,
				width: 204,
				valueGetter: ({ data }) => data?.putBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putBestSellLimitQuantity',
				headerName: 'حجم سرخط فروش پوت',
				cellClass: 'sell',
				initialHide: initialHiddenColumnsConversion.putBestSellLimitQuantity,
				width: 192,
				valueGetter: ({ data }) => data?.putBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putOpenPositionCount',
				headerName: 'موقعیت باز پوت',
				initialHide: initialHiddenColumnsConversion.putOpenPositionCount,
				width: 152,
				valueGetter: ({ data }) => data?.putOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putBestBuyLimitPrice',
				headerName: 'بهترین خریدار پوت',
				initialHide: initialHiddenColumnsConversion.putBestBuyLimitPrice,
				width: 176,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.putBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'putBestBuyLimitQuantity',
				headerName: 'حجم سرخط خرید پوت',
				initialHide: initialHiddenColumnsConversion.putBestBuyLimitQuantity,
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.putBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'profit',
				headerName: 'بازده',
				initialHide: initialHiddenColumnsConversion.profit,
				width: 192,
				initialSort: 'asc',
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.Conversion>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.profit ?? 0, data?.profitPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'inUseCapital',
				headerName: 'سرمایه درگیر',
				initialHide: initialHiddenColumnsConversion.inUseCapital,
				width: 96,
				valueGetter: ({ data }) => data?.inUseCapital ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'ytm',
				headerName: 'ytm (بازده موثر)',
				initialHide: initialHiddenColumnsConversion.ytm,
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده موثر تا سررسید',
				},
				cellClass: ({ value }) => getColorBasedOnPercent(value),
				valueGetter: ({ data }) => data?.ytm ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
			},
			{
				colId: 'callTradeValue',
				headerName: 'ارزش معاملات کال',
				initialHide: initialHiddenColumnsConversion.callTradeValue,
				width: 160,
				valueGetter: ({ data }) => data?.callTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'putTradeValue',
				headerName: 'ارزش معاملات پوت',
				initialHide: initialHiddenColumnsConversion.putTradeValue,
				width: 160,
				valueGetter: ({ data }) => data?.putTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeValue',
				headerName: 'ارزش معاملات سهم پایه',
				initialHide: initialHiddenColumnsConversion.baseTradeValue,
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeCount',
				headerName: 'تعداد معاملات پایه',
				initialHide: initialHiddenColumnsConversion.baseTradeCount,
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseTradeVolume',
				headerName: 'حجم معاملات پایه',
				initialHide: initialHiddenColumnsConversion.baseTradeVolume,
				width: 152,
				valueGetter: ({ data }) => data?.baseTradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseLastTradedDate',
				headerName: 'آخرین معامله پایه',
				initialHide: initialHiddenColumnsConversion.baseLastTradedDate,
				width: 152,
				valueGetter: ({ data }) => data?.baseLastTradeDate ?? 0,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				colId: 'actions',
				headerName: 'عملیات',
				initialHide: initialHiddenColumnsConversion.actions,
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
				'callBestBuyLimitPrice',
				'callBestBuyLimitQuantity',
				'callPremium',
				'callPremiumPercent',
				'callIOTM',
				'callOpenPositionCount',
				'putSymbolISIN',
				'putSymbolTitle',
				'putBestSellLimitPrice',
				'putBestSellLimitQuantity',
				'putBestBuyLimitPrice',
				'putBestBuyLimitQuantity',
				'putOpenPositionCount',
				'putIOTM',
				'putPremium',
				'putPremiumPercent',
				'profit',
				'profitPercent',
				'inUseCapital',
				'callTimeValue',
				'putTimeValue',
				'callIntrinsicValue',
				'putIntrinsicValue',
				'callTradeValue',
				'putTradeValue',
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
				'ytm',
				'ytmWithCommission',
				'contractSize',
				'withCommission',
				'priceType',
			],
			dataAdapter: 'RamandRLCDData',
			snapshot: true,
		});

		// sub.addEventListener('onItemUpdate', onSymbolUpdate);
		subscribe(sub);
	}, [JSON.stringify(symbolsHashTable)]);

	return (
		<>
			<StrategyDetails
				strategy={strategy}
				steps={[t(`${type}.step_1`), t(`${type}.step_2`), t(`${type}.step_3`)]}
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

				<Table<Strategy.Conversion>
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

export default Conversion;
