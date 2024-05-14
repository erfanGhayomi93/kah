import { useBearPutSpreadStrategyQuery } from '@/api/queries/strategyQuery';
import { initialColumnsProtectivePut } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import { setDescriptionModal } from '@/features/slices/modalSlice';
import { setManageColumnsPanel, setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useLocalstorage } from '@/hooks';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type ISelectItem } from '..';
import Filters from '../components/Filters';
import StrategyActionCell from '../components/StrategyActionCell';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';

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
		'protective_put_strategy_columns',
		initialColumnsProtectivePut,
	);

	const [priceBasis, setPriceBasis] = useState<ISelectItem>({ id: 'BestLimit', title: t('strategy.headline') });

	const { data, isFetching } = useBearPutSpreadStrategyQuery({
		queryKey: ['bearPutSpreadQuery', priceBasis.id, useCommission],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const execute = (data: Strategy.BearPutSpread) => {
		//
	};

	const analyze = (data: Strategy.BearPutSpread) => {
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
				description: () => <BearPutSpreadDescription />,
				onRead: () => dispatch(setDescriptionModal(null)),
			}),
		);
	};

	const showColumnsPanel = () => {
		dispatch(
			setManageColumnsPanel({
				initialColumns: initialColumnsProtectivePut,
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnChanged: (_, columns) => setColumnsVisibility(columns),
				onReset: () => setColumnsVisibility(initialColumnsProtectivePut),
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.BearPutSpread>>>(
		() => [
			{
				colId: 'symbolISIN',
				headerName: 'نماد پایه',
				width: 104,
				pinned: 'right',
				cellClass: 'cursor-pointer',
				onCellClicked: ({ data }) => onSymbolTitleClicked(data!.symbolISIN),
				valueGetter: ({ data }) => data?.symbolTitle ?? '−',
			},
			{
				headerName: 'قیمت پایه',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'مانده تا سررسید',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'قرارداد پوت',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'قیمت اعمال',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'موقعیت باز',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'آخرین قیمت نماد آپشن',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'قیمت بهترین فروشنده کال',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'حجم سرخط فروش',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'سر به سر استراتژی',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'بیشینه سود',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'سود عدم اعمال',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'بلک شولز',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'سرمایه درگیر',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'ارزش زمانی',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'ارزش ذاتی',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'مقدار سود',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'اختلاف تا سر به سر',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'قیمت بهترین خریدار پوت',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'حجم سر خط خرید',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'ارزش معاملات آپشن',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'ارزش معاملات سهم پایه',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'تعداد معاملات پایه',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'حجم معاملات پایه',
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				headerName: 'آخرین معامله پایه',
				valueGetter: ({ data }) => data!.symbolTitle,
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
			<StrategyDetails
				strategy={strategy}
				steps={[t(`${type}.step_1`), t(`${type}.step_2`)]}
				readMore={readMore}
			/>

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

				<Table<Strategy.BearPutSpread>
					ref={gridRef}
					rowData={rows}
					columnDefs={columnDefs}
					isFetching={isFetching}
				/>
			</div>
		</>
	);
};

export default BearPutSpread;
