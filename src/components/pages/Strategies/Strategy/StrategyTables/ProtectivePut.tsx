import { useLongPutStrategyQuery } from '@/api/queries/strategyQuery';
import AgTable from '@/components/common/Tables/AgTable';
import { initialColumnsBullCallSpread } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import { setManageColumnsPanel, setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useLocalstorage } from '@/hooks';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type ISelectItem } from '..';
import Filters from '../components/Filters';
import NoTableData from '../components/NoTableData';
import StrategyActionCell from '../components/StrategyActionCell';

interface ProtectivePutProps {
	title: string;
	type: Strategy.Type;
}

const ProtectivePut = ({ title, type }: ProtectivePutProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.ProtectivePut>>(null);

	const [useCommission, setUseCommission] = useLocalstorage('use_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'protective_put_strategy_columns',
		initialColumnsBullCallSpread,
	);

	const [priceBasis, setPriceBasis] = useState<ISelectItem>({ id: 'BestLimit', title: t('strategy.headline') });

	const { data, isFetching } = useLongPutStrategyQuery({
		queryKey: ['longPutQuery', priceBasis.id, useCommission],
	});

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const goToTechnicalChart = (data: Strategy.ProtectivePut) => {
		//
	};

	const execute = (data: Strategy.ProtectivePut) => {
		//
	};

	const showColumnsPanel = () => {
		dispatch(
			setManageColumnsPanel({
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnChanged: (_, columns) => setColumnsVisibility(columns),
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.ProtectivePut>>>(
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
					goToTechnicalChart,
					execute,
				},
			},
		],
		[],
	);

	const defaultColDef: ColDef<Strategy.ProtectivePut> = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			minWidth: 96,
		}),
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
			<Filters
				type={type}
				title={title}
				useCommission={useCommission}
				priceBasis={priceBasis}
				onManageColumns={showColumnsPanel}
				onPriceBasisChanged={setPriceBasis}
				onCommissionChanged={setUseCommission}
			/>

			<AgTable<Strategy.ProtectivePut>
				suppressColumnVirtualisation={false}
				ref={gridRef}
				rowData={rows}
				rowHeight={40}
				headerHeight={48}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				className='h-full border-0'
			/>

			{rows.length === 0 && !isFetching && <NoTableData />}
		</>
	);
};

export default ProtectivePut;
