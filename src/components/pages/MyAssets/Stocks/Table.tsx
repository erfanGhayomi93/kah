import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useMemo, useRef } from 'react';

import NoData from '@/components/common/NoData';
import AgTable from '@/components/common/Tables/AgTable';
import { useTranslations } from 'next-intl';

const Table = () => {
	const t = useTranslations('my_assets');

	const gridRef = useRef<GridApi<unknown>>(null);

	const columnDefs = useMemo<Array<ColDef<unknown>>>(
		() => [
			{
				colId: 'index',
				headerName: t('col_index'),
				pinned: 'right',
				minWidth: 72,
				maxWidth: 72,
			},
			{
				colId: 'symbol',
				headerName: t('col_symbol'),
				pinned: 'right',
				minWidth: 120,
			},
			{
				colId: 'remains_quantity',
				headerName: t('col_remains_quantity'),
				minWidth: 104,
			},
			{
				colId: 'paid_value',
				headerName: t('col_paid_value'),
				minWidth: 112,
			},
			{
				colId: 'avg_buy_price',
				headerName: t('col_avg_buy_price'),
				minWidth: 144,
			},
			{
				colId: 'symbol_price',
				headerName: t('col_symbol_price'),
				minWidth: 144,
			},
			{
				colId: 'price_change_percent',
				headerName: t('col_price_change_percent'),
			},
			{
				colId: 'net_sell_value',
				headerName: t('col_net_sell_value'),
			},
			{
				colId: 'bep',
				headerName: t('col_bep'),
			},
			{
				colId: 'today_profit_and_loss',
				headerName: t('col_today_profit_and_loss'),
			},
			{
				colId: 'past_profit_and_loss',
				headerName: t('col_past_profit_and_loss'),
			},
			{
				colId: 'remain_profit_and_loss',
				headerName: t('col_remain_profit_and_loss'),
			},
			{
				colId: 'total_profit_and_loss',
				headerName: t('col_total_profit_and_loss'),
			},
			{
				colId: 'portfolio_percent',
				headerName: t('col_portfolio_percent'),
			},
			{
				colId: 'buy_quantity',
				headerName: t('col_buy_quantity'),
			},
			{
				colId: 'sell_quantity',
				headerName: t('col_sell_quantity'),
			},
			{
				colId: 'total_buy_value',
				headerName: t('col_total_buy_value'),
			},
			{
				colId: 'total_sell_value',
				headerName: t('col_total_sell_value'),
			},
			{
				colId: 'meeting_profit',
				headerName: t('col_meeting_profit'),
			},
			{
				colId: 'last_meeting_profit',
				headerName: t('col_last_meeting_profit'),
				minWidth: 136,
			},
			{
				colId: 'action',
				headerName: t('col_action'),
				pinned: 'left',
				minWidth: 192,
				maxWidth: 192,
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
			/>

			<div className='absolute center'>
				<NoData />
			</div>
		</div>
	);
};

export default Table;
