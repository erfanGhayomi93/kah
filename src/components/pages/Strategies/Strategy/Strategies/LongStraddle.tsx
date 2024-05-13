import { useLongStraddleStrategyQuery } from '@/api/queries/strategyQuery';
import { initialColumnsLongStraddle } from '@/constants/strategies';
import { useAppDispatch } from '@/features/hooks';
import { setDescriptionModal } from '@/features/slices/modalSlice';
import { setManageColumnsPanel, setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useLocalstorage } from '@/hooks';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type ISelectItem } from '..';
import Filters from '../components/Filters';
import StrategyActionCell from '../components/StrategyActionCell';
import StrategyDetails from '../components/StrategyDetails';
import Table from '../components/Table';

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
				description: title,
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
