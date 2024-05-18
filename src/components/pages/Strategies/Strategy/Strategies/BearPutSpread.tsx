import { useBearPutSpreadStrategyQuery } from '@/api/queries/strategyQuery';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import CellSymbolTitleRendererRenderer from '@/components/common/Tables/Cells/CellSymbolStatesRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { initialColumnsBearPutSpread } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import { setAnalyzeModal, setDescriptionModal } from '@/features/slices/modalSlice';
import { setManageColumnsPanel, setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useInputs, useLocalstorage } from '@/hooks';
import { dateFormatter, getColorBasedOnPercent, numFormatter, sepNumbers, toFixed, uuidv4 } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';
import Filters from '../components/Filters';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';
import StrategyActionCell from '../TableComponents/StrategyActionCell';

const BearPutSpreadDescription = dynamic(() => import('../Descriptions/BearPutSpreadDescription'), {
	ssr: false,
});

interface BearPutSpreadProps extends Strategy.GetAll {}

const BearPutSpread = (strategy: BearPutSpreadProps) => {
	const { title, type } = strategy;

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.BearPutSpread>>(null);

	const [useCommission, setUseCommission] = useLocalstorage('use_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'bear_put_spread_columns',
		initialColumnsBearPutSpread,
	);

	const { inputs, setFieldValue, setFieldsValue } = useInputs<IStrategyFilter>({
		priceBasis: 'BestLimit',
		symbolBasis: 'BestLimit',
		pageSize: 20,
		pageNumber: 1,
	});

	const { data, isFetching } = useBearPutSpreadStrategyQuery({
		queryKey: ['bearPutSpreadQuery', { ...inputs, withCommission: useCommission }],
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
						symbolTitle: data.lspSymbolTitle,
						symbolISIN: data.lspSymbolISIN,
						optionType: 'put',
						baseSymbolPrice: data.baseLastTradedPrice,
						historicalVolatility: data.historicalVolatility,
					},
					contractSize: data.contractSize,
					price: data.lspPremium || 1,
					quantity: 1,
					settlementDay: data.contractEndDate,
					strikePrice: data.lspStrikePrice,
					side: 'buy',
					marketUnit: data.marketUnit,
					requiredMargin: {
						value: data.lspRequiredMargin,
					},
				},
				{
					type: 'option',
					id: uuidv4(),
					symbol: {
						symbolTitle: data.hspSymbolTitle,
						symbolISIN: data.hspSymbolISIN,
						optionType: 'put',
						baseSymbolPrice: data.baseLastTradedPrice,
						historicalVolatility: data.historicalVolatility,
					},
					contractSize: data.contractSize,
					price: data.hspPremium || 1,
					quantity: 1,
					settlementDay: data.contractEndDate,
					strikePrice: data.hspStrikePrice,
					side: 'sell',
					marketUnit: data.marketUnit,
					requiredMargin: {
						value: data.hspRequiredMargin,
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
				description: () => <BearPutSpreadDescription />,
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
				initialColumns: initialColumnsBearPutSpread,
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnChanged: (_, columns) => setColumnsVisibility(columns),
				onReset: () => setColumnsVisibility(initialColumnsBearPutSpread),
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.BearPutSpread>>>(
		() => [
			{
				colId: 'baseSymbolTitle',
				headerName: 'نماد پایه',
				width: 104,
				pinned: 'right',
				cellClass: 'cursor-pointer justify-end',
				onCellClicked: ({ data }) => onSymbolTitleClicked(data!.baseSymbolISIN),
				valueGetter: ({ data }) => data?.baseSymbolTitle ?? '−',
			},
			{
				colId: 'baseTradePriceVarPreviousTradePercent',
				headerName: 'قیمت پایه',
				minWidth: 108,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.ProtectivePut, number>) => ({
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
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspSymbolISIN',
				headerName: 'پوت خرید',
				width: 128,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.hspSymbolISIN),
				valueGetter: ({ data }) => data?.hspSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRendererRenderer,
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
				valueGetter: ({ data }) => data?.hspBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestSellLimitQuantity',
				headerName: 'حجم فروشنده پوت خرید',
				width: 176,
				valueGetter: ({ data }) => data?.hspBestSellLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestBuyLimitPrice',
				headerName: 'قیمت خریدار پوت خرید',
				width: 176,
				valueGetter: ({ data }) => data?.hspBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'hspBestBuyLimitQuantity',
				headerName: 'حجم خریدار پوت خرید',
				width: 176,
				valueGetter: ({ data }) => data?.hspBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspSymbolISIN',
				headerName: 'پوت فروش',
				width: 128,
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.lspSymbolISIN),
				valueGetter: ({ data }) => data?.lspSymbolTitle ?? '−',
				cellRenderer: CellSymbolTitleRendererRenderer,
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
				width: 176,
				valueGetter: ({ data }) => data?.lspBestBuyLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestBuyLimitQuantity',
				headerName: 'حجم خریدار پوت فروش',
				width: 176,
				valueGetter: ({ data }) => data?.lspBestBuyLimitQuantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestSellLimitPrice',
				headerName: 'بهترین فروشنده پوت فروش',
				width: 204,
				valueGetter: ({ data }) => data?.lspBestSellLimitPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'lspBestSellLimitQuantity',
				headerName: 'حجم سر خط فروش پوت فروش',
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
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.BearPutSpread, number>) => ({
					percent: data?.lspPremiumPercent ?? 0,
				}),
				valueGetter: ({ data }) => [data?.hspPremium ?? 0, data?.hspPremiumPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
			},
			{
				colId: 'lspPremiumPercent',
				headerName: 'قیمت نماد پوت فروش',
				width: 192,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.BearPutSpread, number>) => ({
					percent: data?.hspPremiumPercent ?? 0,
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
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: 'سود در صورت اعمال به ازای یک قرارداد آپشن',
				},
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.BearPutSpread, number>) => ({
					percent: data?.maxProfitPercent ?? 0,
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
				width: 192,
				valueGetter: ({ data }) => data?.hspTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
			},
			{
				colId: 'lspTradeValue',
				headerName: 'ارزش معاملات آپشن پوت فروش',
				width: 192,
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
				valueFormatter: ({ value }) => toFixed(value, 6),
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

				<Table<Strategy.BearPutSpread>
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

export default BearPutSpread;
