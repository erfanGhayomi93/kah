import { useCoveredCallStrategyQuery } from '@/api/queries/strategyQuery';
import lightStreamInstance from '@/classes/Lightstream';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { ChartDownSVG, ChartUpSVG, StraightLineSVG } from '@/components/icons';
import { initialColumnsCoveredCall, initialHiddenColumnsCoveredCall } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import {
	setAnalyzeModal,
	setDescriptionModal,
	setExecuteCoveredCallStrategyModal,
	setManageColumnsModal,
	setStrategyFiltersModal,
} from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useInputs, useLocalstorage, useSubscription } from '@/hooks';
import { dateFormatter, getColorBasedOnPercent, numFormatter, sepNumbers, toFixed, uuidv4 } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';
import Filters from '../components/Filters';
import StrategyActionCell from '../components/StrategyActionCell';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';

const CoveredCallDescription = dynamic(() => import('../Descriptions/CoveredCallDescription'), {
	ssr: false,
});

type THashTable = Record<string, number>;

interface CoveredCallProps extends Strategy.GetAll {}

const CoveredCall = (strategy: CoveredCallProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.CoveredCall>>(null);

	const symbolsHashTableRef = useRef<THashTable>({});

	const { subscribe } = useSubscription();

	const [useCommission, setUseCommission] = useLocalstorage('use_trade_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'covered_call_strategy_columns',
		initialColumnsCoveredCall,
	);

	const { inputs, setFieldValue } = useInputs<IStrategyFilter>({
		priceBasis: 'BestLimitPrice',
		symbolBasis: 'BestLimit',
		pageSize: 20,
		pageNumber: 1,
	});

	const { inputs: filters, setInputs: setFilters } = useInputs<Partial<ICoveredCallFiltersModalStates>>({});

	const { data = [], isFetching } = useCoveredCallStrategyQuery({
		queryKey: [
			'coveredCallQuery',
			{ priceBasis: inputs.priceBasis, symbolBasis: inputs.symbolBasis, withCommission: useCommission },
			{ ...filters },
		],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const onFiltersChanged = (newFilters: Partial<ICoveredCallFiltersModalStates>) => {
		setFilters(newFilters);
	};

	const execute = (data: Strategy.CoveredCall) => {
		try {
			// ? baseSymbolEstimatedBudget = (contractSize * (baseBestSellLimitPrice - optionBestBuyLimitPrice)) * orderQuantity
			dispatch(
				setExecuteCoveredCallStrategyModal({
					contractSize: data.contractSize ?? 0,
					inUseCapital: data.inUseCapital ?? 0,
					strategy: 'CoveredCall',
					baseSymbol: {
						symbolISIN: data.baseSymbolISIN,
						symbolTitle: data.baseSymbolTitle,
						bestLimitPrice: data.baseBestSellLimitPrice,
						marketUnit: data.baseMarketUnit,
					},
					option: {
						requiredMargin: data.requiredMargin,
						symbolISIN: data.symbolISIN,
						symbolTitle: data.symbolTitle,
						bestLimitPrice: data.optionBestBuyLimitPrice,
						marketUnit: data.marketUnit,
						settlementDay: data.contractEndDate,
						strikePrice: data.strikePrice,
						historicalVolatility: data.historicalVolatility,
					},
				}),
			);
		} catch (e) {
			//
		}
	};

	const analyze = (data: Strategy.CoveredCall) => {
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
						symbolTitle: data.symbolTitle,
						symbolISIN: data.symbolISIN,
						optionType: 'call',
						baseSymbolPrice: data.baseLastTradedPrice,
						historicalVolatility: data.historicalVolatility,
						contractSize: data.contractSize,
						settlementDay: new Date(data.contractEndDate),
						strikePrice: data.strikePrice,
						requiredMargin: data.requiredMargin,
					},
					price: data.premium || 1,
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

	const showColumnsManagementModal = () => {
		dispatch(
			setManageColumnsModal({
				initialColumns: initialColumnsCoveredCall,
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnsChanged: (columns) =>
					setColumnsVisibility(columns as Array<IManageColumn<TCoveredCallColumns>>),
				onReset: () => setColumnsVisibility(initialColumnsCoveredCall),
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
				description: () => <CoveredCallDescription />,
				onRead: () => dispatch(setDescriptionModal(null)),
			}),
		);
	};

	const showFilters = () => {
		dispatch(
			setStrategyFiltersModal({
				baseSymbols: filters?.baseSymbols ?? [],
				onSubmit: onFiltersChanged,
				filters: [
					{
						id: 'iotm',
						title: t('strategy_filters.iotm'),
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
						initialValue: filters?.iotm ?? [],
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
						id: 'openPosition',
						title: t('strategy_filters.open_positions'),
						mode: 'single',
						type: 'integer',
						initialValue: filters?.openPosition ?? null,
						label: t('strategy_filters.from'),
					},
					{
						id: 'maxProfit',
						title: t('strategy_filters.max_profit'),
						titleHint: t('strategy_filters.max_profit_tooltip'),
						mode: 'single',
						type: 'percent',
						label: t('strategy_filters.from'),
						initialValue: filters?.maxProfit ?? null,
					},
					/* {
						id: 'nonExpiredProfit',
						title: t('strategy_filters.non_expired_profit'),
						titleHint: t('strategy_filters.non_expired_profit_tooltip'),
						mode: 'single',
						type: 'percent',
						label: t('strategy_filters.from'),
						initialValue: filters?.nonExpiredProfit ?? null,
					}, */
					{
						id: 'bepDifference',
						title: t('strategy_filters.bep_difference'),
						mode: 'range',
						type: 'percent',
						label: [t('strategy_filters.from'), t('strategy_filters.to')],
						placeholder: [t('strategy_filters.first_value'), t('strategy_filters.second_value')],
						initialValue: [filters.bepDifference?.[0] ?? null, filters.bepDifference?.[1] ?? null],
					},
					{
						id: 'ytm',
						title: t('strategy_filters.ytm'),
						mode: 'single',
						type: 'percent',
						initialValue: filters?.ytm ?? null,
						label: t('strategy_filters.from'),
					},
				],
			}),
		);
	};

	const onSymbolUpdate = (updateInfo: ItemUpdate) => {
		try {
			const key: string = updateInfo.getItemName();
			const rowNode = gridRef.current!.getRowNode(key);

			if (!rowNode) return;

			const symbolData = { ...rowNode.data! };
			console.log(rowNode, key, symbolData);

			/* updateInfo.forEachChangedField((fieldName, _b, value) => {
				console.log(fieldName, value);
			}); */

			// rowNode.setData(symbolData);
		} catch (e) {
			//
		}
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.CoveredCall> & { colId: TCoveredCallColumns }>>(
		() => [
			{
				colId: 'baseSymbolTitle',
				headerName: t('CoveredCall.baseSymbolTitle'),
				initialHide: initialHiddenColumnsCoveredCall.baseSymbolTitle,
				width: 104,
				maxWidth: 104,
				pinned: 'right',
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.baseSymbolISIN),
				valueGetter: ({ data }) => data?.baseSymbolTitle ?? '−',
			},
			{
				colId: 'baseLastTradedPrice',
				headerName: t('CoveredCall.baseLastTradedPrice'),
				initialHide: initialHiddenColumnsCoveredCall.baseLastTradedPrice,
				minWidth: 108,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.CoveredCall>) => ({
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
				headerName: t('CoveredCall.dueDays'),
				initialHide: initialHiddenColumnsCoveredCall.dueDays,
				width: 120,
				valueGetter: ({ data }) => data?.dueDays ?? 0,
			},
			{
				colId: 'symbolTitle',
				headerName: t('CoveredCall.symbolTitle'),
				initialHide: initialHiddenColumnsCoveredCall.symbolTitle,
				minWidth: 144,
				maxWidth: 144,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.symbolISIN),
				valueGetter: ({ data }) => data?.symbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.CoveredCall) => data!.iotm,
				},
			},
			{
				colId: 'strikePrice',
				headerName: t('CoveredCall.strikePrice'),
				initialHide: initialHiddenColumnsCoveredCall.strikePrice,
				width: 96,
				cellClass: 'gray',
				valueGetter: ({ data }) => data?.strikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'openPositionCount',
				headerName: t('CoveredCall.openPositionCount'),
				initialHide: initialHiddenColumnsCoveredCall.openPositionCount,
				width: 112,
				valueGetter: ({ data }) => data?.openPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'tradePriceVarPreviousTradePercent',
				headerName: t('CoveredCall.tradePriceVarPreviousTradePercent'),
				initialHide: initialHiddenColumnsCoveredCall.tradePriceVarPreviousTradePercent,
				width: 152,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.CoveredCall>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.premium ?? 0, data?.tradePriceVarPreviousTradePercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'optionBestBuyLimitPrice',
				headerName: t('CoveredCall.optionBestBuyLimitPrice'),
				initialHide: initialHiddenColumnsCoveredCall.optionBestBuyLimitPrice,
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestBuyLimitQuantity',
				headerName: t('CoveredCall.optionBestBuyLimitQuantity'),
				initialHide: initialHiddenColumnsCoveredCall.optionBestBuyLimitQuantity,
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestSellLimitPrice',
				headerName: t('CoveredCall.optionBestSellLimitPrice'),
				initialHide: initialHiddenColumnsCoveredCall.optionBestSellLimitPrice,
				width: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.optionBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestSellLimitQuantity',
				headerName: t('CoveredCall.optionBestSellLimitQuantity'),
				initialHide: initialHiddenColumnsCoveredCall.optionBestSellLimitQuantity,
				width: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.optionBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'coveredCallBEP',
				headerName: t('CoveredCall.coveredCallBEP'),
				initialHide: initialHiddenColumnsCoveredCall.coveredCallBEP,
				width: 136,
				cellClass: ({ data }) =>
					getColorBasedOnPercent((data?.baseLastTradedPrice ?? 0) - (data?.coveredCallBEP ?? 0)),
				valueGetter: ({ data }) => data?.coveredCallBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'maxProfitPercent',
				headerName: t('CoveredCall.maxProfitPercent'),
				initialHide: initialHiddenColumnsCoveredCall.maxProfitPercent,
				width: 184,
				initialSort: 'asc',
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'سود در صورت اعمال به ازای یک قرارداد آپشن',
				},
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.CoveredCall>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.maxProfit ?? 0, data?.maxProfitPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			/* {
				colId: 'nonExpiredProfitPercent',
				headerName: t('CoveredCall.nonExpiredProfitPercent'),
				initialHide: initialHiddenColumnsCoveredCall.nonExpiredProfitPercent,
				width: 184,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده تا سررسید در صورت عدم اعمال توسط خریدار آپشن به ازای یک قرارداد آپشن',
				},
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.CoveredCall>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.nonExpiredProfit ?? 0, data?.nonExpiredProfitPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			}, */
			{
				colId: 'inUseCapital',
				headerName: t('CoveredCall.inUseCapital'),
				initialHide: initialHiddenColumnsCoveredCall.inUseCapital,
				width: 96,
				valueGetter: ({ data }) => data?.inUseCapital ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'ytm',
				headerName: t('CoveredCall.ytm'),
				initialHide: initialHiddenColumnsCoveredCall.ytm,
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده موثر تا سررسید',
				},
				cellClass: ({ value }) => getColorBasedOnPercent(value),
				valueGetter: ({ data }) => data?.ytm ?? 0,
				valueFormatter: ({ value }) => `${toFixed(value, 4)}%`,
			},
			/* {
				colId: 'nonExpiredYTM',
				headerName: t('CoveredCall.nonExpiredYTM'),
				initialHide: initialHiddenColumnsCoveredCall.nonExpiredYTM,
				minWidth: 200,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'بازده موثر تا سررسید در صورت عدم اعمال توسط خریدار اختیار',
				},
				cellClass: ({ value }) => getColorBasedOnPercent(value),
				valueGetter: ({ data }) => data?.nonExpiredYTM ?? 0,
				valueFormatter: ({ value }) => `${toFixed(value, 4)}%`,
			}, */
			{
				colId: 'bepDifference',
				headerName: t('CoveredCall.bepDifference'),
				initialHide: initialHiddenColumnsCoveredCall.bepDifference,
				width: 136,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.CoveredCall>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.bepDifference ?? 0, data?.bepDifferencePercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'riskCoverage',
				headerName: t('CoveredCall.riskCoverage'),
				initialHide: initialHiddenColumnsCoveredCall.riskCoverage,
				minWidth: 152,
				flex: 1,
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
				colId: 'tradeValue',
				headerName: t('CoveredCall.tradeValue'),
				initialHide: initialHiddenColumnsCoveredCall.tradeValue,
				width: 136,
				valueGetter: ({ data }) => data?.tradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeValue',
				headerName: t('CoveredCall.baseTradeValue'),
				initialHide: initialHiddenColumnsCoveredCall.baseTradeValue,
				width: 176,
				valueGetter: ({ data }) => data?.baseTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeCount',
				headerName: t('CoveredCall.baseTradeCount'),
				initialHide: initialHiddenColumnsCoveredCall.baseTradeCount,
				width: 128,
				valueGetter: ({ data }) => data?.baseTradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseTradeVolume',
				headerName: t('CoveredCall.baseTradeVolume'),
				initialHide: initialHiddenColumnsCoveredCall.baseTradeVolume,
				width: 136,
				valueGetter: ({ data }) => data?.baseTradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseLastTradedDate',
				headerName: t('CoveredCall.baseLastTradedDate'),
				initialHide: initialHiddenColumnsCoveredCall.baseLastTradedDate,
				width: 120,
				valueGetter: ({ data }) => data?.baseLastTradedDate ?? 0,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				colId: 'action',
				headerName: t('CoveredCall.action'),
				initialHide: initialHiddenColumnsCoveredCall.action,
				width: 80,
				sortable: false,
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
				'symbolISIN',
				'symbolTitle',
				'strikePrice',
				'openPositionCount',
				'iotm',
				'premium',
				'tradePriceVarPreviousTradePercent',
				'optionBestBuyLimitQuantity',
				'optionBestBuyLimitPrice',
				'contractSize',
				'baseBestSellLimitPrice',
				'baseBestBuyLimitPrice',
				'optionBestSellLimitPrice',
				'optionBestSellLimitQuantity',
				'baseClosingPrice',
				'tradeValue',
				'baseTradeValue',
				'baseTradeCount',
				'baseTradeVolume',
				'baseLastTradedDate',
				'coveredCallBEP',
				'maxProfit',
				'maxProfitPercent',
				'inUseCapital',
				'nonExpiredProfit',
				'nonExpiredProfitPercent',
				'ytm',
				'nonExpiredYTM',
				'bepDifference',
				'bepDifferencePercent',
				'riskCoverage',
				'baseMarketUnit',
				'marketUnit',
				'historicalVolatility',
				'requiredMargin',
				'contractEndDate',
				'withCommission',
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
					priceBasis={inputs.priceBasis}
					symbolBasis={inputs.symbolBasis}
					onShowFilters={showFilters}
				/>

				<Table<Strategy.CoveredCall>
					ref={gridRef}
					rowData={data}
					columnDefs={columnDefs}
					isFetching={isFetching}
					columnsVisibility={columnsVisibility}
					dependencies={[useCommission]}
					getRowId={({ data }) => data.key}
				/>
			</div>
		</>
	);
};

export default CoveredCall;
