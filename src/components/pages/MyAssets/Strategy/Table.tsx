import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useMemo, useRef } from 'react';

import NoData from '@/components/common/NoData';
import AgTable from '@/components/common/Tables/AgTable';
import { useTranslations } from 'next-intl';

const Table = () => {
	const t = useTranslations('my_assets');

	const gridRef = useRef<GridApi<unknown>>(null);

	const indexColumn = useMemo<ColDef<unknown>>(
		() => ({
			colId: 'index',
			headerName: t('col_index'),
			pinned: 'right',
			minWidth: 72,
			maxWidth: 72,
			sortable: false,
			valueGetter: ({ node }) => (node?.rowIndex ?? 0) + 1,
		}),
		[],
	);

	const columnDefs = useMemo<Array<ColDef<unknown>>>(
		() => [
			indexColumn,
			{
				colId: 'strategy_name',
				headerName: t('col_strategy_name'),
				minWidth: 120,
			},
			{
				colId: 'base_symbol',
				headerName: t('col_base_symbol'),
				minWidth: 120,
			},
			{
				colId: 'buy_side',
				headerName: t('col_buy_side'),
				minWidth: 120,
			},
			{
				colId: 'sell_side',
				headerName: t('col_sell_side'),
				minWidth: 120,
			},
			{
				colId: 'strategy_profit_and_loss',
				headerName: t('col_strategy_profit_and_loss'),
				minWidth: 120,
			},
			{
				colId: 'bep',
				headerName: t('col_bep'),
				minWidth: 120,
			},
			{
				colId: 'max_possible_loss',
				headerName: t('col_max_possible_loss'),
				minWidth: 120,
			},
			{
				colId: 'max_possible_profit',
				headerName: t('col_max_possible_profit'),
				minWidth: 120,
			},
			{
				colId: 'action',
				headerName: t('col_action'),
				pinned: 'left',
				minWidth: 144,
				maxWidth: 144,
			},
		],
		[],
	);

	const defaultColDef: ColDef = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			flex: 1,
			minWidth: 128,
		}),
		[],
	);

	return (
		<div className='relative w-full flex-1'>
			<AgTable
				ref={gridRef}
				rowData={[]}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				className='h-full border-0'
				onSortChanged={({ api }) => {
					const column = api.getColumn('index');
					if (!column) return;

					column.setColDef(indexColumn, indexColumn, 'api');
				}}
			/>

			<div className='absolute center'>
				<NoData />
			</div>
		</div>
	);
};

export default Table;
