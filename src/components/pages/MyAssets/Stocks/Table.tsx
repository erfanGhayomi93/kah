import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import AgTable from '@/components/common/Tables/AgTable';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { getColorBasedOnPercent, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useMemo, useRef } from 'react';
import SymbolTitleHeader from '../SymbolTitleHeader';
import ActionCell from './ActionCell';

interface TableProps {
	loading: boolean;
	data: Portfolio.GlPortfolio[];
}

const Table = ({ data, loading }: TableProps) => {
	const t = useTranslations('my_assets');

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Portfolio.GlPortfolio>>(null);

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const indexColumn = useMemo<ColDef<Portfolio.GlPortfolio>>(
		() => ({
			colId: 'index',
			headerName: t('col_index'),
			pinned: 'right',
			minWidth: 72,
			maxWidth: 72,
			sortable: false,
			resizable: false,
			valueGetter: ({ node }) => (node?.rowIndex ?? 0) + 1,
		}),
		[],
	);

	const columnDefs = useMemo<Array<ColDef<Portfolio.GlPortfolio>>>(
		() => [
			indexColumn,
			{
				colId: 'symbol',
				headerName: t('col_symbol'),
				pinned: 'right',
				cellClass: 'font-medium cursor-pointer',
				maxWidth: 120,
				filter: 'text',
				headerComponent: SymbolTitleHeader,
				onCellClicked: ({ data }) => onSymbolTitleClicked(data!.symbolISIN),
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				colId: 'remains_quantity',
				headerName: t('col_remains_quantity'),
				headerComponent: HeaderHint,
				headerComponentParams: {
					tooltip: t('col_remains_quantity_tooltip'),
				},
				valueGetter: ({ data }) => data!.asset,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'paid_value',
				headerName: t('col_paid_value'),
				minWidth: 112,
				valueGetter: ({ data }) => data!.paidValue,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'avg_buy_price',
				headerName: t('col_avg_buy_price'),
				minWidth: 144,
				valueGetter: ({ data }) => data!.avgBuyPrice,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'symbol_price',
				headerName: t('col_symbol_price'),
				minWidth: 144,
				valueGetter: ({ data }) => data!.price,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'price_change_percent',
				headerName: t('col_price_change_percent'),
				cellClass: ({ data }) => getColorBasedOnPercent(data?.priceChangePercent ?? 0),
				valueGetter: ({ data }) => data!.priceChangePercent,
				valueFormatter: ({ value }) => `${value}%`,
			},
			{
				colId: 'net_sell_value',
				headerName: t('col_net_sell_value'),
				valueGetter: ({ data }) => data!.sellNetValue,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'bep',
				headerName: t('col_bep'),
				valueGetter: ({ data }) => data!.buyPriceBEP,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'today_profit_and_loss',
				headerName: t('col_today_profit_and_loss'),
				minWidth: 160,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Portfolio.GlPortfolio>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.todayPNL ?? 0, data?.todayPNLPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
				comparator: (valueA, valueB) => valueA[1] - valueB[1],
			},
			{
				colId: 'past_profit_and_loss',
				headerName: t('col_past_profit_and_loss'),
				minWidth: 160,
				valueGetter: ({ data }) => data!.previousPNL,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'remain_profit_and_loss',
				headerName: t('col_remain_profit_and_loss'),
				minWidth: 160,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Portfolio.GlPortfolio>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.remainingPNL ?? 0, data?.remainingPNLPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
				comparator: (valueA, valueB) => valueA[1] - valueB[1],
			},
			{
				colId: 'total_profit_and_loss',
				headerName: t('col_total_profit_and_loss'),
				minWidth: 160,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Portfolio.GlPortfolio>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.totalPNL ?? 0, data?.totalPNLPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
				comparator: (valueA, valueB) => valueA[1] - valueB[1],
			},
			{
				colId: 'portfolio_percent',
				headerName: t('col_portfolio_percent'),
				cellClass: ({ data }) => getColorBasedOnPercent(data?.percentageOfTotalPortfo ?? 0),
				valueGetter: ({ data }) => data!.percentageOfTotalPortfo,
				valueFormatter: ({ value }) => `${value}%`,
			},
			{
				colId: 'buy_quantity',
				headerName: t('col_buy_quantity'),
				valueGetter: ({ data }) => data!.buyQuantity,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'sell_quantity',
				headerName: t('col_sell_quantity'),
				valueGetter: ({ data }) => data!.sellQuantity,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'total_buy_value',
				headerName: t('col_total_buy_value'),
				valueGetter: ({ data }) => data!.buyValue,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'total_sell_value',
				headerName: t('col_total_sell_value'),
				valueGetter: ({ data }) => data!.sellValue,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'meeting_profit',
				headerName: t('col_meeting_profit'),
				valueGetter: ({ data }) => data!.dps,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'last_meeting_profit',
				headerName: t('col_last_meeting_profit'),
				minWidth: 136,
				valueGetter: ({ data }) => data!.lastDPS,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'action',
				headerName: t('col_action'),
				pinned: 'left',
				minWidth: 192,
				maxWidth: 192,
				cellRenderer: ActionCell,
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
				rowData={data}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				className='h-full border-0'
				quickFilterMatcher={(value, rawText) => {
					try {
						const symbolTitle = rawText.split('\n')[1];
						return symbolTitle.includes(value[0]);
					} catch (e) {
						return true;
					}
				}}
				onSortChanged={({ api }) => {
					const column = api.getColumn('index');
					if (!column) return;

					column.setColDef(indexColumn, indexColumn, 'api');
				}}
			/>

			{loading && <Loading />}

			{!loading && data.length === 0 && (
				<div className='absolute center'>
					<NoData />
				</div>
			)}
		</div>
	);
};

export default Table;
