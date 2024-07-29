import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import AgTable from '@/components/common/Tables/AgTable';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import dayjs from '@/libs/dayjs';
import { getColorBasedOnPercent, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useMemo, useRef } from 'react';
import PutActionCell from './PutActionCell';

interface PutTableProps {
	isLoading: boolean;
	data: GLOptionOrder.SellPosition[];
}

const PutTable = ({ data, isLoading }: PutTableProps) => {
	const t = useTranslations('my_assets');

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<GLOptionOrder.SellPosition>>(null);

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const columnDefs = useMemo<Array<ColDef<GLOptionOrder.SellPosition>>>(
		() => [
			{
				colId: 'index',
				headerName: t('col_index'),
				pinned: 'right',
				minWidth: 72,
				maxWidth: 72,
				valueGetter: ({ node }) => (node?.rowIndex ?? 0) + 1,
			},
			{
				colId: 'symbol',
				headerName: t('col_symbol'),
				pinned: 'right',
				cellClass: 'font-medium cursor-pointer',
				onCellClicked: ({ data }) => onSymbolTitleClicked(data!.symbolISIN),
				valueGetter: ({ data }) => data!.symbolTitle,
			},
			{
				colId: 'quantity',
				headerName: t('col_quantity'),
				valueGetter: ({ data }) => data!.positionCount,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'received_value',
				headerName: t('col_received_value'),
				minWidth: 112,
				valueGetter: ({ data }) => data!.paidValue,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'avg_buy_price',
				headerName: t('col_avg_buy_price'),
				minWidth: 144,
				valueGetter: ({ data }) => data!.avgSellPrice,
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
				colId: 'net_buy_value',
				headerName: t('col_net_buy_value'),
				valueGetter: ({ data }) => data!.buyNetValue,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'bep_buy',
				headerName: t('col_bep_buy'),
				minWidth: 144,
				valueGetter: ({ data }) => data!.buyBEP,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'today_profit_and_loss',
				headerName: t('col_today_profit_and_loss'),
				minWidth: 160,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<GLOptionOrder.SellPosition>) => ({
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
				cellRendererParams: ({ value }: ICellRendererParams<GLOptionOrder.SellPosition>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data?.remainingPNL ?? 0, data?.remainingPNLPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
				comparator: (valueA, valueB) => valueA[1] - valueB[1],
			},
			{
				colId: 'total_efficiency',
				headerName: t('col_total_efficiency'),
				minWidth: 160,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<GLOptionOrder.SellPosition>) => ({
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
				colId: 'blocked_value',
				headerName: t('col_blocked_value'),
				valueGetter: ({ data }) => 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'blocked_assets',
				headerName: t('col_blocked_assets'),
				valueGetter: ({ data }) => 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'due_days',
				headerName: t('col_due_days'),
				valueGetter: ({ data }) => data!.dueDays,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'contract_size',
				headerName: t('col_contract_size'),
				valueGetter: ({ data }) => data!.contractSize,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'strike_pnl',
				headerName: t('col_strike_pnl'),
				minWidth: 160,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<GLOptionOrder.SellPosition>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [0, 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
				comparator: (valueA, valueB) => valueA[1] - valueB[1],
			},
			{
				colId: 'physical_settlement_date',
				headerName: t('col_physical_settlement_date'),
				minWidth: 144,
				valueGetter: ({ data }) => data!.physicalSettlementDate,
				valueFormatter: ({ value }) => dayjs(value).calendar('jalali').format('YYYY/MM/DD'),
			},
			{
				colId: 'base_symbol',
				headerName: t('col_base_symbol'),
				valueGetter: ({ data }) => data!.baseSymbolTitle,
			},
			{
				colId: 'base_symbol_price',
				headerName: t('col_base_symbol_price'),
				valueGetter: ({ data }) => data!.baseSymbolPrice,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'block_type',
				headerName: t('col_block_type'),
				valueGetter: ({ data }) => '−',
			},
			{
				colId: 'action',
				headerName: t('col_action'),
				pinned: 'left',
				minWidth: 208,
				maxWidth: 208,
				cellRenderer: PutActionCell,
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
		<div className='flex-1 gap-16 flex-column'>
			<h2 className='text-gray-700 text-base font-medium'>
				{t('positions_title')} <span className='text-error-100'>{t('put')}</span>
			</h2>

			<div className='relative w-full flex-328'>
				<AgTable<GLOptionOrder.SellPosition>
					ref={gridRef}
					rowData={data}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					className='border-put h-full border-0'
				/>

				{isLoading && (
					<div className='absolute center'>
						<Loading />
					</div>
				)}

				{!isLoading && data.length === 0 && (
					<div className='absolute center'>
						<NoData />
					</div>
				)}
			</div>
		</div>
	);
};

export default PutTable;
