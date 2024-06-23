'use client';

import AgTable from '@/components/common/Tables/AgTable';
import { getColorBasedOnPercent, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useMemo, useRef } from 'react';

interface PriceCardProps {
	percent?: number;
	value: number;
	title: string;
}

const Stocks = () => {
	const t = useTranslations('my_assets');

	const gridRef = useRef<GridApi<unknown>>(null);

	const columnDefs = useMemo<Array<ColDef<unknown>>>(
		() => [
			{
				colId: 'index',
				headerName: t('col_index'),
			},
			{
				colId: 'symbol',
				headerName: t('col_symbol'),
			},
			{
				colId: 'remains_quantity',
				headerName: t('col_remains_quantity'),
			},
			{
				colId: 'paid_value',
				headerName: t('col_paid_value'),
			},
			{
				colId: 'avg_buy_price',
				headerName: t('col_avg_buy_price'),
			},
			{
				colId: 'symbol_price',
				headerName: t('col_symbol_price'),
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
			},
			{
				colId: 'action',
				headerName: t('col_action'),
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
		}),
		[],
	);

	return (
		<div className='flex-1 rounded bg-white p-16'>
			<div className='flex gap-8'>
				<PriceCard title={t('portfolio_total_value')} value={263e3} />
				<PriceCard title={t('total_profit_and_loss')} percent={22} value={263e3} />
				<PriceCard title={t('today_profit_and_los')} percent={22} value={263e3} />
				<PriceCard title={t('assembly_profit')} percent={22} value={263e3} />
			</div>

			<AgTable
				ref={gridRef}
				rowData={[]}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				className='h-full border-0'
			/>
		</div>
	);
};

const PriceCard = ({ value, title, percent }: PriceCardProps) => {
	const t = useTranslations('common');

	return (
		<div className='h-64 w-1/4 rounded px-8 shadow-card flex-justify-between'>
			<span className='text-base text-light-gray-700'>{title}:</span>
			<div className='flex gap-8 text-base'>
				{percent !== undefined && (
					<span className={getColorBasedOnPercent(percent)}>({percent.toFixed(2)}%)</span>
				)}
				<span className='text-light-gray-700'>
					<span className='font-medium text-light-gray-800'>{sepNumbers(String(value))} </span>
					{t('rial')}
				</span>
			</div>
		</div>
	);
};

export default Stocks;
