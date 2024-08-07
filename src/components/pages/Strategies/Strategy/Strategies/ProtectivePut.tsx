import { useProtectivePutStrategyQuery } from '@/api/queries/strategyQuery';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRendererRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { ChartDownSVG, ChartUpSVG, StraightLineSVG } from '@/components/icons';
import { initialColumnsProtectivePut, initialHiddenColumnsProtectivePut } from '@/constants/strategies';
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

const ProtectivePutDescription = dynamic(() => import('../Descriptions/ProtectivePutDescription'), {
	ssr: false,
});

interface ProtectivePutProps extends Strategy.GetAll {}

const ProtectivePut = (strategy: ProtectivePutProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.ProtectivePut>>(null);

	const { inputs: filters, setInputs: setFilters } = useInputs<Partial<IProtectivePutFiltersModalState>>({});

	const [useCommission, setUseCommission] = useLocalstorage('use_trade_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'protective_put_strategy_columns',
		initialColumnsProtectivePut,
	);

	const { inputs, setFieldValue, setFieldsValue } = useInputs<IStrategyFilter>({
		priceBasis: 'BestLimitPrice',
		symbolBasis: 'BestLimit',
		pageSize: 20,
		pageNumber: 1,
	});

	const { data, isFetching } = useProtectivePutStrategyQuery({
		queryKey: [
			'protectivePutQuery',
			{ priceBasis: inputs.priceBasis, symbolBasis: inputs.symbolBasis, withCommission: useCommission },
			{ ...filters },
		],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const analyze = (data: Strategy.ProtectivePut) => {
		try {
			const contracts: TSymbolStrategy[] = [
				{
					type: 'base',
					id: uuidv4(),
					marketUnit: data.baseMarketUnit,
					quantity: 1,
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
				description: () => <ProtectivePutDescription />,
				onRead: () => dispatch(setDescriptionModal(null)),
			}),
		);
	};

	const goToTheNextPage = () => {
		setFieldsValue((prev) => ({
			pageNumber: prev.pageNumber + 1,
		}));
	};

	const showColumnsManagementModal = () => {
		dispatch(
			setManageColumnsModal({
				initialColumns: initialColumnsProtectivePut,
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnsChanged: (columns) =>
					setColumnsVisibility(columns as Array<IManageColumn<TProtectivePutColumns>>),
				onReset: () => setColumnsVisibility(initialColumnsProtectivePut),
			}),
		);
	};

	const onFiltersChanged = (newFilters: Partial<IProtectivePutFiltersModalState>) => {
		setFilters(newFilters);
	};

	const showFilters = () => {
		dispatch(
			setStrategyFiltersModal({
				baseSymbols: filters.baseSymbols ?? [],
				onSubmit: onFiltersChanged,
				filters: [
					{
						id: 'iotm',
						type: 'string',
						mode: 'array',
						title: t('strategy_filters.iotm'),
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
						id: 'maxLoss',
						title: t('strategy_filters.max_loss'),
						mode: 'single',
						type: 'percent',
						label: t('strategy_filters.to'),
						placeholder: t('strategy_filters.value'),
						initialValue: filters?.maxLoss ?? null,
					},
					{
						id: 'bepDifference',
						title: t('strategy_filters.bep_difference'),
						mode: 'range',
						type: 'percent',
						placeholder: [t('strategy_filters.first_value'), t('strategy_filters.second_value')],
						initialValue: filters?.bepDifference ?? [null, null],
					},
				],
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.ProtectivePut> & { colId: TProtectivePutColumns }>>(
		() => [
			{
				colId: 'baseSymbolTitle',
				headerName: 'نماد پایه',
				initialHide: initialHiddenColumnsProtectivePut.baseSymbolTitle,
				width: 104,
				maxWidth: 104,
				pinned: 'right',
				cellClass: 'cursor-pointer justify-end',
				onCellClicked: ({ data }) => onSymbolTitleClicked(data!.baseSymbolISIN),
				valueGetter: ({ data }) => data?.baseSymbolTitle ?? '−',
			},
			{
				colId: 'baseTradePriceVarPreviousTradePercent',
				headerName: 'قیمت پایه',
				initialHide: initialHiddenColumnsProtectivePut.baseTradePriceVarPreviousTradePercent,
				minWidth: 108,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.ProtectivePut>) => ({
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
				initialHide: initialHiddenColumnsProtectivePut.dueDays,
				width: 120,
				valueGetter: ({ data }) => data?.dueDays ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'symbolTitle',
				headerName: 'پوت خرید',
				initialHide: initialHiddenColumnsProtectivePut.symbolTitle,
				width: 128,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.symbolISIN),
				valueGetter: ({ data }) => data?.symbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRendererRenderer,
				cellRendererParams: {
					getIOTM: (data: Strategy.ProtectivePut) => data?.iotm ?? 0,
				},
			},
			{
				colId: 'strikePrice',
				headerName: 'قیمت اعمال',
				initialHide: initialHiddenColumnsProtectivePut.strikePrice,
				width: 96,
				cellClass: 'gray',
				valueGetter: ({ data }) => data?.strikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'openPositionCount',
				headerName: 'موقعیت باز',
				initialHide: initialHiddenColumnsProtectivePut.openPositionCount,
				width: 112,
				valueGetter: ({ data }) => data?.openPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'tradePriceVarPreviousTradePercent',
				headerName: 'قیمت نماد آپشن',
				initialHide: initialHiddenColumnsProtectivePut.tradePriceVarPreviousTradePercent,
				minWidth: 152,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.ProtectivePut>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.premium ?? 0, data?.tradePriceVarPreviousTradePercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'optionBestSellLimitPrice',
				headerName: 'بهترین فروشنده',
				initialHide: initialHiddenColumnsProtectivePut.optionBestSellLimitPrice,
				minWidth: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.optionBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestSellLimitQuantity',
				headerName: 'حجم سرخط فروش',
				initialHide: initialHiddenColumnsProtectivePut.optionBestSellLimitQuantity,
				minWidth: 152,
				cellClass: 'sell',
				valueGetter: ({ data }) => data?.optionBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestBuyLimitPrice',
				headerName: 'بهترین خریدار',
				initialHide: initialHiddenColumnsProtectivePut.optionBestBuyLimitPrice,
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'optionBestBuyLimitQuantity',
				headerName: 'حجم سرخط خرید',
				initialHide: initialHiddenColumnsProtectivePut.optionBestBuyLimitQuantity,
				width: 152,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'protectivePutBEP',
				headerName: 'سر به سر',
				initialHide: initialHiddenColumnsProtectivePut.protectivePutBEP,
				width: 152,
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'درصد گرانی یا همان درصد اختلاف سر به سر و قیمت فعلی',
				},
				valueGetter: ({ data }) => data?.protectivePutBEP ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'maxLossPercent',
				headerName: 'حداکثر زیان',
				initialHide: initialHiddenColumnsProtectivePut.maxLossPercent,
				width: 152,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Strategy.ProtectivePut>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.maxLoss ?? 0, data?.maxLossPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'profit',
				headerName: 'بازده',
				initialHide: initialHiddenColumnsProtectivePut.profit,
				minWidth: 104,
				valueFormatter: () => t('common.infinity'),
			},
			{
				colId: 'profitPercent',
				headerName: 'درصد بازده تا سررسید',
				initialHide: initialHiddenColumnsProtectivePut.profitPercent,
				cellClass: ({ value }) => getColorBasedOnPercent(value),
				valueGetter: ({ data }) => data?.profitPercent ?? 0,
				valueFormatter: ({ value }) => `${toFixed(value, 6)}%`,
			},
			{
				colId: 'inUseCapital',
				headerName: 'سرمایه درگیر',
				initialHide: initialHiddenColumnsProtectivePut.inUseCapital,
				width: 96,
				valueGetter: ({ data }) => data?.inUseCapital ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'blackScholes',
				headerName: 'بلک شولز',
				initialHide: initialHiddenColumnsProtectivePut.blackScholes,
				minWidth: 96,
				valueGetter: ({ data }) => data?.blackScholes ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
			},
			{
				colId: 'timeValue',
				headerName: 'ارزش زمانی',
				initialHide: initialHiddenColumnsProtectivePut.timeValue,
				minWidth: 96,
				valueGetter: ({ data }) => data?.timeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'intrinsicValue',
				headerName: 'ارزش ذاتی',
				initialHide: initialHiddenColumnsProtectivePut.intrinsicValue,
				minWidth: 96,
				valueGetter: ({ data }) => data?.intrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'bepDifference',
				headerName: 'اختلاف تا سر به سر',
				initialHide: initialHiddenColumnsProtectivePut.bepDifference,
				minWidth: 136,
				cellClass: ({ value }) => getColorBasedOnPercent(value),
				valueGetter: ({ data }) => data?.bepDifference ?? 0,
				valueFormatter: ({ value }) =>
					value < 0 ? `(%${sepNumbers(String(Math.abs(value)))})` : `%${sepNumbers(String(value))}`,
			},
			{
				colId: 'tradeValue',
				headerName: 'ارزش معاملات آپشن',
				initialHide: initialHiddenColumnsProtectivePut.tradeValue,
				minWidth: 136,
				valueGetter: ({ data }) => data?.tradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeValue',
				headerName: 'ارزش معاملات سهم پایه',
				initialHide: initialHiddenColumnsProtectivePut.baseTradeValue,
				minWidth: 152,
				valueGetter: ({ data }) => data?.baseTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'baseTradeCount',
				headerName: 'تعداد معاملات پایه',
				initialHide: initialHiddenColumnsProtectivePut.baseTradeCount,
				minWidth: 128,
				valueGetter: ({ data }) => data?.baseTradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseTradeVolume',
				headerName: 'حجم معاملات پایه',
				initialHide: initialHiddenColumnsProtectivePut.baseTradeVolume,
				minWidth: 136,
				valueGetter: ({ data }) => data?.baseTradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'baseLastTradedDate',
				headerName: 'آخرین معامله پایه',
				initialHide: initialHiddenColumnsProtectivePut.baseLastTradedDate,
				minWidth: 120,
				valueGetter: ({ data }) => data?.baseLastTradedDate ?? 0,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				colId: 'actions',
				headerName: 'عملیات',
				initialHide: initialHiddenColumnsProtectivePut.actions,
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
			<StrategyDetails
				strategy={strategy}
				steps={[t(`${type}.step_1`), t(`${type}.step_2`)]}
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

				<Table<Strategy.ProtectivePut>
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

export default ProtectivePut;
