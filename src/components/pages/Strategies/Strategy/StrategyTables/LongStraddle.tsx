import { useLongStraddleStrategyQuery } from '@/api/queries/strategyQuery';
import Loading from '@/components/common/Loading';
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

interface LongStraddleProps {
	title: string;
	type: Strategy.Type;
}

const LongStraddle = ({ title, type }: LongStraddleProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Strategy.LongStraddle>>(null);

	const [useCommission, setUseCommission] = useLocalstorage('use_commission', true);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'Long_straddle_strategy_columns',
		initialColumnsBullCallSpread,
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
		/* const contracts: ISymbolStrategyContract[] = [];

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

	const showColumnsPanel = () => {
		dispatch(
			setManageColumnsPanel({
				columns: columnsVisibility,
				title: t('strategies.manage_columns'),
				onColumnChanged: (_, columns) => setColumnsVisibility(columns),
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Strategy.LongStraddle>>>(
		() => [
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

	const defaultColDef: ColDef<Strategy.LongStraddle> = useMemo(
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

			<AgTable<Strategy.LongStraddle>
				suppressColumnVirtualisation={false}
				ref={gridRef}
				rowData={rows}
				rowHeight={40}
				headerHeight={48}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				className='h-full border-0'
			/>

			{isFetching && <Loading />}

			{rows.length === 0 && !isFetching && <NoTableData />}
		</>
	);
};

export default LongStraddle;
