import { useBearPutSpreadStrategyQuery } from '@/api/queries/strategyQuery';
import lightStreamInstance from '@/classes/Lightstream';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { ChartDownSVG, ChartUpSVG, StraightLineSVG } from '@/components/icons';
import { initialColumnsBearPutSpread } from '@/constants/strategies';
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
import { useEffect, useMemo, useRef } from 'react';
import Filters from '../components/Filters';
import StrategyActionCell from '../components/StrategyActionCell';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';

const BearPutSpreadDescription = dynamic(() => import('../Descriptions/BearPutSpreadDescription'), {
	ssr: false,
});

type THashTable = Record<string, number>;

interface BearPutSpreadProps extends Strategy.GetAll {}

const BearPutSpread = (strategy: BearPutSpreadProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.BearPutSpread>>(null);

	const symbolsHashTableRef = useRef<THashTable>({});

	const { subscribe } = useSubscription();

	const [useCommission, setUseCommission] = useLocalstorage('use_trade_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'bear_put_spread_columns',
		initialColumnsBearPutSpread,
	);

	const { inputs: filters, setInputs: setFilters } = useInputs<Partial<IBearPutSpreadSpreadFiltersModalState>>({});

	const { inputs, setFieldValue } = useInputs<IStrategyFilter>({
		priceBasis: 'BestLimitPrice',
		symbolBasis: 'BestLimit',
		pageSize: 20,
		pageNumber: 1,
	});

	const { data = [], isFetching } = useBearPutSpreadStrategyQuery({
		queryKey: [
			'bearPutSpreadQuery',
			{ priceBasis: inputs.priceBasis, symbolBasis: inputs.symbolBasis, withCommission: useCommission },
			{ ...filters },
		],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const analyze = (data: Strategy.BearPutSpread) => {
		try {
			const contracts: TSymbolStrategy[] = [
				{
					type: 'option',
					id: uuidv4(),
					symbol: {
						symbolTitle: data.hspSymbolTitle,
						symbolISIN: data.hspSymbolISIN,
						optionType: 'put',
						baseSymbolPrice: data.baseLastTradedPrice,
						historicalVolatility: data.historicalVolatility,
						contractSize: data.contractSize,
						settlementDay: new Date(data.contractEndDate),
						strikePrice: data.hspStrikePrice,
						requiredMargin: data.hspRequiredMargin,
					},
					price: data.hspPremium || 1,
					quantity: 1,
					side: 'buy',
					marketUnit: data.marketUnit,
				},
				{
					type: 'option',
					id: uuidv4(),
					symbol: {
						symbolTitle: data.lspSymbolTitle,
						symbolISIN: data.lspSymbolISIN,
						optionType: 'put',
						baseSymbolPrice: data.baseLastTradedPrice,
						historicalVolatility: data.historicalVolatility,
						contractSize: data.contractSize,
						settlementDay: new Date(data.contractEndDate),
						strikePrice: data.lspStrikePrice,
						requiredMargin: data.lspRequiredMargin,
					},
					price: data.lspPremium || 1,
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
				description: () => <BearPutSpreadDescription />,
				onRead: () => dispatch(setDescriptionModal(null)),
			}),
		);
	};

	const showColumnsManagementModal = () => {
		dispatch(
			setManageColumnsModal({
				initialColumns: initialColumnsBearPutSpread,
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnsChanged: (columns) =>
					setColumnsVisibility(columns as Array<IManageColumn<TBearPutSpreadColumns>>),
				onReset: () => setColumnsVisibility(initialColumnsBearPutSpread),
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
						id: 'HSPLeastOpenPositions',
						title: t('strategy_filters.HSP_least_open_positions_put'),
						mode: 'single',
						type: 'integer',
						label: t('strategy_filters.from'),
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.HSPLeastOpenPositions ?? null,
					},
					{
						id: 'LSPLeastOpenPositions',
						title: t('strategy_filters.LSP_least_open_positions_put'),
						mode: 'single',
						type: 'integer',
						label: t('strategy_filters.from'),
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.LSPLeastOpenPositions ?? null,
					},
					{
						id: 'leastMaxProfitPercent',
						title: t('strategy_filters.max_profit'),
						mode: 'single',
						type: 'percent',
						label: t('strategy_filters.from'),
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.leastMaxProfitPercent ?? null,
						titleHint: t('strategy_filters.max_profit_tooltip'),
					},
					{
						id: 'leastYTM',
						title: t('strategy_filters.ytm'),
						mode: 'single',
						type: 'percent',
						label: t('strategy_filters.from'),
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.leastYTM ?? null,
					},
				],
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.BearPutSpread> & { colId: TBearPutSpreadColumns }>>(
		() => [
			{
				colId: 'baseSymbolTitle',
				headerName: 'نماد پایه',
				width: 104,
				maxWidth: 104,
				pinned: 'right',
				cellClass: 'cursor-pointer',
				onCellClicked: ({ data }) => onSymbolTitleClicked(data!.baseSymbolISIN),
				valueGetter: ({ data }) => data?.baseSymbolTitle ?? '−',
			},
			{
				colId: 'baseTradePriceVarPreviousTradePercent',
				headerName: 'قیمت پایه',
				minWidth: 108,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.BearPutSpread>) => ({
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
				width: 120,
				valueGetter: ({ data }) => data?.dueDays ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspSymbolTitle',
				headerName: 'پوت خرید',
				minWidth: 144,
				maxWidth: 144,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.hspSymbolISIN),
				valueGetter: ({ data }) => data?.hspSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.BearPutSpread) => data?.hspiotm ?? 0,
				},
			},
			{
				colId: 'hspStrikePrice',
				headerName: 'قیمت اعمال پوت خرید',
				width: 176,
				valueGetter: ({ data }) => data?.hspStrikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestSellLimitPrice',
				headerName: 'قیمت فروشنده پوت خرید',
				width: 176,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.hspBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestSellLimitQuantity',
				headerName: 'حجم فروشنده پوت خرید',
				width: 176,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.hspBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestBuyLimitPrice',
				headerName: 'قیمت خریدار پوت خرید',
				width: 176,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.hspBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestBuyLimitQuantity',
				headerName: 'حجم خریدار پوت خرید',
				width: 176,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.hspBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspSymbolTitle',
				headerName: 'پوت فروش',
				minWidth: 144,
				maxWidth: 144,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.lspSymbolISIN),
				valueGetter: ({ data }) => data?.lspSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.BearPutSpread) => data?.lspiotm ?? 0,
				},
			},
			{
				colId: 'lspStrikePrice',
				headerName: 'قیمت اعمال پوت فروش',
				width: 176,
				valueGetter: ({ data }) => data?.lspStrikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestBuyLimitPrice',
				headerName: 'قیمت خریدار پوت فروش',
				cellClass: 'buy',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestBuyLimitQuantity',
				headerName: 'حجم خریدار پوت فروش',
				cellClass: 'buy',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestSellLimitPrice',
				headerName: 'بهترین فروشنده پوت فروش',
				cellClass: 'sell',
				width: 204,
				valueGetter: ({ data }) => data?.lspBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestSellLimitQuantity',
				headerName: 'حجم فروشنده پوت فروش',
				cellClass: 'sell',
				width: 192,
				valueGetter: ({ data }) => data?.lspBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspOpenPositionCount',
				headerName: 'موقعیت باز پوت خرید',
				width: 152,
				valueGetter: ({ data }) => data?.hspOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspOpenPositionCount',
				headerName: 'موقعیت باز پوت فروش',
				width: 152,
				valueGetter: ({ data }) => data?.lspOpenPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspPremiumPercent',
				headerName: 'قیمت نماد پوت خرید',
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.BearPutSpread>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.hspPremium ?? 0, data?.hspPremiumPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'lspPremiumPercent',
				headerName: 'قیمت نماد پوت فروش',
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.BearPutSpread>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.lspPremium ?? 0, data?.lspPremiumPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'bullCallSpreadBEP',
				headerName: 'سر به سر',
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'درصد گرانی یا همان درصد اختلاف سر به سر و قیمت فعلی',
				},
				valueGetter: ({ data }) => data?.bearPutSpreadBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'maxProfitPercent',
				headerName: 'حداکثر بازده',
				width: 184,
				initialSort: 'asc',
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'سود در صورت اعمال به ازای یک قرارداد آپشن',
				},
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.BearPutSpread>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.maxProfit ?? 0, data?.maxProfitPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
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
				headerName: 'ارزش زمانی پوت خرید',
				width: 152,
				valueGetter: ({ data }) => data?.lspTimeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspTimeValue',
				headerName: 'ارزش زمانی پوت فروش',
				width: 152,
				valueGetter: ({ data }) => data?.hspTimeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspIntrinsicValue',
				headerName: 'ارزش ذاتی پوت خرید',
				width: 152,
				valueGetter: ({ data }) => data?.hspIntrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspIntrinsicValue',
				headerName: 'ارزش ذاتی پوت فروش',
				width: 152,
				valueGetter: ({ data }) => data?.lspIntrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspTradeValue',
				headerName: 'ارزش معاملات آپشن پوت خرید',
				width: 208,
				valueGetter: ({ data }) => data?.hspTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'lspTradeValue',
				headerName: 'ارزش معاملات آپشن پوت فروش',
				width: 208,
				valueGetter: ({ data }) => data?.lspTradeValue ?? 0,
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
				valueFormatter: ({ value }) => {
					if (value === 10000) return 'بزرگتر از 10,000';
					else if (value === -10000) return 'کمتر از 10,000';
					else return value;
				},
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
				'bearPutSpreadBEP',
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
					useCommission={useCommission}
					onManageColumns={showColumnsManagementModal}
					setFieldValue={setFieldValue}
					onCommissionChanged={setUseCommission}
					priceBasis={inputs.priceBasis}
					symbolBasis={inputs.symbolBasis}
					onShowFilters={showFilters}
					filtersCount={Object.keys(filters).length}
				/>

				<Table<Strategy.BearPutSpread>
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

export default BearPutSpread;
