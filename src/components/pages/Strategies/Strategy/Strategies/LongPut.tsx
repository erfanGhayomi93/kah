import { useLongPutStrategyQuery } from '@/api/queries/strategyQuery';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import { ChartDownSVG, ChartUpSVG, StraightLineSVG } from '@/components/icons';
import { initialColumnsLongPut, initialHiddenColumnsLongPut } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import {
	setAnalyzeModal,
	setDescriptionModal,
	setManageColumnsModal,
	setStrategyFiltersModal,
} from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
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

const LongPutDescription = dynamic(() => import('../Descriptions/LongPutDescription'), {
	ssr: false,
});

interface LongPutProps extends Strategy.GetAll {}

const LongPut = (strategy: LongPutProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.LongPut>>(null);

	const [useCommission, setUseCommission] = useLocalstorage('use_trade_commission', true);

	const { inputs: filters, setInputs: setFilters } = useInputs<Partial<ILongPutFiltersModalState>>({});

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'long_put_strategy_columns',
		initialColumnsLongPut,
	);

	const { inputs, setFieldValue } = useInputs<IStrategyFilter>({
		priceBasis: 'BestLimitPrice',
		symbolBasis: 'BestLimit',
		pageSize: 20,
		pageNumber: 1,
	});

	const { data, isFetching } = useLongPutStrategyQuery({
		queryKey: [
			'longPutQuery',
			{ priceBasis: inputs.priceBasis, symbolBasis: inputs.symbolBasis, withCommission: useCommission },
			{ ...filters },
		],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const analyze = (data: Strategy.LongPut) => {
		try {
			const contracts: TSymbolStrategy[] = [
				{
					type: 'option',
					id: uuidv4(),
					symbol: {
						symbolTitle: data.symbolTitle,
						symbolISIN: data.symbolISIN,
						optionType: 'put',
						baseSymbolPrice: data.baseLastTradedPrice,
						historicalVolatility: data.historicalVolatility,
						contractSize: data.contractSize,
						settlementDay: new Date(data.contractEndDate),
						strikePrice: data.strikePrice,
						requiredMargin: data.requiredMargin,
					},
					price: data.premium || 1,
					quantity: 1,
					side: 'buy',
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
				description: () => <LongPutDescription />,
				onRead: () => dispatch(setDescriptionModal(null)),
			}),
		);
	};

	const showColumnsManagementModal = () => {
		dispatch(
			setManageColumnsModal({
				initialColumns: initialColumnsLongPut,
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnsChanged: (columns) => setColumnsVisibility(columns as Array<IManageColumn<TLongPutColumns>>),
				onReset: () => setColumnsVisibility(initialColumnsLongPut),
			}),
		);
	};

	const onFiltersChanged = (newFilters: Partial<ILongPutFiltersModalState>) => {
		setFilters(newFilters);
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
						label: t('strategy_filters.from'),
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.openPosition ?? null,
					},
					{
						id: 'bepDifference',
						title: t('strategy_filters.bep_difference'),
						mode: 'range',
						type: 'integer',
						label: [t('strategy_filters.from'), t('strategy_filters.to')],
						placeholder: [t('strategy_filters.first_value'), t('strategy_filters.second_value')],
						initialValue: [filters.bepDifference?.[0] ?? null, filters.bepDifference?.[1] ?? null],
					},
				],
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.LongPut> & { colId: TLongPutColumns }>>(
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
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.LongPut>) => ({
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
				minWidth: 120,
				valueGetter: ({ data }) => data?.dueDays ?? 0,
			},
			{
				colId: 'symbolTitle',
				headerName: 'کال',
				minWidth: 144,
				maxWidth: 144,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.symbolISIN),
				valueGetter: ({ data }) => data?.symbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.LongPut) => data!.iotm,
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
				colId: 'tradePriceVarPreviousTradePercent',
				headerName: 'قیمت نماد آپشن',
				minWidth: 152,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.LongPut>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.premium ?? 0, data?.tradePriceVarPreviousTradePercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'optionBestSellLimitPrice',
				headerName: 'بهترین فروشنده',
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
				colId: 'optionBestLimitPrice',
				headerName: 'بهترین خریدار',
				minWidth: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestLimitVolume',
				headerName: 'حجم سرخط خرید',
				minWidth: 120,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'longPutBEP',
				headerName: 'سر به سر',
				minWidth: 128,
				cellClass: ({ data }) =>
					getColorBasedOnPercent((data?.baseLastTradedPrice ?? 0) - (data?.longPutBEP ?? 0)),
				valueGetter: ({ data }) => data?.longPutBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			/* {
				colId: 'profitPercent',
				headerName: 'حداکثر بازده',
				minWidth: 160,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'سود در صورت اعمال به ازای یک قرارداد آپشن',
				},
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.LongPut>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.profitAmount ?? 0, data?.profitPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			}, */
			/* {
				colId: 'profit',
				headerName: 'بازده',
				profit: initialHiddenColumnsLongPut.profit,
				minWidth: 104,
				valueFormatter: () => t('common.infinity'),
			}, */
			{
				colId: 'blackScholes',
				headerName: 'قیمت منصفانه',
				blackScholes: initialHiddenColumnsLongPut.blackScholes,
				minWidth: 96,
				valueGetter: ({ data }) => data?.blackScholes ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
			},
			{
				colId: 'timeValue',
				headerName: 'ارزش زمانی',
				timeValue: initialHiddenColumnsLongPut.timeValue,
				minWidth: 96,
				valueGetter: ({ data }) => data?.timeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'intrinsicValue',
				headerName: 'ارزش ذاتی',
				intrinsicValue: initialHiddenColumnsLongPut.intrinsicValue,
				minWidth: 96,
				valueGetter: ({ data }) => data?.intrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'bepDifference',
				headerName: 'اختلاف تا سر به سر',
				initialHide: initialHiddenColumnsLongPut.bepDifference,
				width: 136,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.CoveredCall>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.bepDifference ?? 0, data?.bepDifferencePercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'tradeValue',
				headerName: 'ارزش معاملات آپشن',
				tradeValue: initialHiddenColumnsLongPut.tradeValue,
				minWidth: 136,
				valueGetter: ({ data }) => data?.tradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeValue',
				headerName: 'ارزش معاملات سهم پایه',
				baseTradeValue: initialHiddenColumnsLongPut.baseTradeValue,
				minWidth: 152,
				valueGetter: ({ data }) => data?.baseTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeCount',
				headerName: 'تعداد معاملات پایه',
				baseTradeCount: initialHiddenColumnsLongPut.baseTradeCount,
				minWidth: 128,
				valueGetter: ({ data }) => data?.baseTradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseTradeVolume',
				headerName: 'حجم معاملات پایه',
				baseTradeVolume: initialHiddenColumnsLongPut.baseTradeVolume,
				minWidth: 136,
				valueGetter: ({ data }) => data?.baseTradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseLastTradedDate',
				headerName: 'آخرین معامله پایه',
				baseLastTradedDate: initialHiddenColumnsLongPut.baseLastTradedDate,
				minWidth: 120,
				valueGetter: ({ data }) => data?.baseLastTradedDate ?? 0,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				colId: 'actions',
				headerName: 'عملیات',
				actions: initialHiddenColumnsLongPut.actions,
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

				<Table<Strategy.LongPut>
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

export default LongPut;
