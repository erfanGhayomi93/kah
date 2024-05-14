import { useLongStraddleStrategyQuery } from '@/api/queries/strategyQuery';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import { initialColumnsLongStraddle } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import { setDescriptionModal } from '@/features/slices/modalSlice';
import { setManageColumnsPanel, setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useLocalstorage } from '@/hooks';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type ISelectItem } from '..';
import Filters from '../components/Filters';
import StrategyActionCell from '../components/StrategyActionCell';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';

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

	const [priceBasis, setPriceBasis] = useState<ISelectItem>({ id: 'BestLimit', title: t('strategy.headline') });

	const { data, isFetching } = useLongStraddleStrategyQuery({
		queryKey: ['longStraddleQuery', priceBasis.id, useCommission],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const execute = (data: Strategy.LongStraddle) => {
		//
	};

	const analyze = (data: Strategy.LongStraddle) => {
		/* const contracts: TSymbolStrategy[] = [];

		dispatch(
			setAnalyzeModal({
				symbol: {
					symbolTitle: data.baseSymbolTitle,
					symbolISIN: data.baseSymbolISIN,
				},
				contracts: [],
			}),
		); */
	};

	const readMore = () => {
		dispatch(
			setDescriptionModal({
				title: (
					<>
						{t(`strategies.strategy_title_${type}`)} <span className='text-gray-700'>({title})</span>
					</>
				),
				description: () => <LongStraddleDescription />,
				onRead: () => dispatch(setDescriptionModal(null)),
			}),
		);
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
				colId: 'baseSymbolISIN',
				headerName: 'نماد پایه',
				width: 104,
				pinned: 'right',
				cellClass: 'cursor-pointer',
				onCellClicked: (api) => onSymbolTitleClicked(api.data!.baseSymbolISIN),
				valueGetter: ({ data }) => data?.baseSymbolTitle ?? '−',
			},
			{
				colId: 'baseLastTradedPrice',
				headerName: 'قیمت پایه',
				minWidth: 108,
				valueGetter: ({ data }) =>
					`${data?.baseLastTradedPrice ?? 0}|${data?.baseTradePriceVarPreviousTradePercent ?? 0}`,
				valueFormatter: ({ data }) => sepNumbers(String(data?.baseLastTradedPrice ?? 0)),
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ data }: ICellRendererParams<Strategy.CoveredCall, number>) => ({
					percent: data?.baseTradePriceVarPreviousTradePercent ?? 0,
				}),
			},
			{
				colId: 'dueDays',
				headerName: 'مانده تا سررسید',
				width: 120,
				valueGetter: ({ data }) => data?.dueDays ?? 0,
			},
			{
				headerName: 'قیمت فروشنده کال',
			},
			{
				headerName: 'حجم فروشنده کال',
			},
			{
				headerName: 'کال',
			},
			{
				headerName: 'قیمت اعمال کال',
			},
			{
				headerName: 'پوت',
			},
			{
				headerName: 'قیمت اعمال پوت',
			},
			{
				headerName: 'قیمت فروشنده پوت',
			},
			{
				headerName: 'حجم فروشنده پوت',
			},
			{
				headerName: 'سر به سر بالا',
			},
			{
				headerName: 'سر به سر پایین',
			},
			{
				headerName: 'بیشینه سود',
			},
			{
				headerName: 'سود عدم اعمال',
			},
			{
				headerName: 'موقعیت باز کال',
			},
			{
				headerName: 'موقعیت باز پوت',
			},
			{
				headerName: 'قیمت نماد کال',
			},
			{
				headerName: 'قیمت نماد پوت',
			},
			{
				headerName: 'سرمایه درگیر',
			},
			{
				headerName: 'ارزش زمانی کال',
			},
			{
				headerName: 'ارزش زمانی پوت',
			},
			{
				headerName: 'ارزش ذاتی کال',
			},
			{
				headerName: 'ارزش ذاتی پوت',
			},
			{
				headerName: 'قیمت بهترین خریدار کال',
			},
			{
				headerName: 'حجم سر خط خرید کال',
			},
			{
				headerName: 'قیمت بهترین خریدار پوت',
			},
			{
				headerName: 'حجم سر خط خرید پوت',
			},
			{
				headerName: 'ارزش معاملات کال',
			},
			{
				headerName: 'ارزش معاملات پوت',
			},
			{
				headerName: 'ارزش معاملات سهم پایه',
			},
			{
				headerName: 'تعداد معاملات پایه',
			},
			{
				headerName: 'حجم معاملات پایه',
			},
			{
				headerName: 'آخرین معامله پایه',
			},
			{
				colId: 'actions',
				headerName: 'عملیات',
				width: 80,
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

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid) return;

		try {
			eGrid.setGridOption('rowData', data);
		} catch (e) {
			//
		}
	}, [data]);

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

	const rows = data ?? [];

	return (
		<>
			<StrategyDetails strategy={strategy} steps={[]} readMore={readMore} />

			<div className='relative flex-1 gap-16 overflow-hidden rounded bg-white p-16 flex-column'>
				<Filters
					type={type}
					title={title}
					useCommission={useCommission}
					priceBasis={priceBasis}
					onManageColumns={showColumnsPanel}
					onPriceBasisChanged={setPriceBasis}
					onCommissionChanged={setUseCommission}
				/>

				<Table<Strategy.LongStraddle>
					ref={gridRef}
					rowData={rows}
					columnDefs={columnDefs}
					isFetching={isFetching}
				/>
			</div>
		</>
	);
};

export default LongStraddle;
