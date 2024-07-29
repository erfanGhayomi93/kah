import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import AgTable from '@/components/common/Tables/AgTable';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import { useAppDispatch } from '@/features/hooks';
import { setChoiceCollateralModal } from '@/features/slices/modalSlice';
import { useTradingFeatures } from '@/hooks';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo, useRef } from 'react';
import OptionActionCell from '../common/OptionActionCell';
import SymbolTitleCell from '../common/SymbolTitleCell';
import SymbolTitleHeader from '../common/SymbolTitleHeader';

interface OptionTableProps {
	data: Order.OptionOrder[];
	loading: boolean;
}

const OptionTable = ({ loading, data }: OptionTableProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Order.OptionOrder>>(null);

	const { addBuySellModal } = useTradingFeatures();

	const onClosePosition = (order: Order.OptionOrder) => {
		addBuySellModal({
			side: order.side === 'Buy' ? 'sell' : 'buy',
			symbolType: 'option',
			type: 'order',
			mode: 'create',
			symbolISIN: order.symbolISIN,
			symbolTitle: order.symbolTitle,
			initialQuantity: order.availableClosePosition,
			switchable: false,
			initialValidity: 'Day',
		});
	};

	const onChangeCollateral = (order: Order.OptionOrder) => {
		dispatch(
			setChoiceCollateralModal({
				order,
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Order.OptionOrder>>>(
		() => [
			{
				colId: 'symbol_title',
				headerName: t('orders.symbol_title'),
				cellClass: 'justify-end text-right',
				headerComponent: SymbolTitleHeader,
				cellRenderer: SymbolTitleCell,
				pinned: 'right',
				checkboxSelection: false,
				valueGetter: ({ data }) => data!.symbolTitle,
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},
			{
				colId: 'position',
				headerName: t('orders.position'),
				minWidth: 96,
				valueGetter: ({ data }) => data!.side,
				valueFormatter: ({ value }) => (value === 'Buy' ? t('side.buy') : t('side.sell')),
				cellClass: ({ value }) =>
					clsx({
						'text-success-100': value === 'Buy',
						'text-error-100': value === 'Sell',
					}),
			},
			{
				colId: 'position_count',
				headerName: t('orders.position_count'),
				valueGetter: ({ data }) => Math.max(0, data!.positionCount),
				valueFormatter: ({ value }) => sepNumbers(String(value ?? 0)),
				cellClass: ({ value }) =>
					clsx({
						'text-success-100': value === 'Buy',
						'text-error-100': value === 'Sell',
					}),
			},
			{
				colId: 'blockType',
				headerName: t('orders.block_type'),
				valueGetter: ({ data }) => data!.blockType,
				valueFormatter: ({ value }) => {
					if (value === 'Buy') return '-';
					if (value) return t('option_block_type.' + value);
					return '-';
				},
			},
			{
				colId: 'physical_settlement_date',
				headerName: t('orders.physical_settlement_date'),
				minWidth: 144,
				flex: 1,
				valueGetter: ({ data }) => data!.physicalSettlementDate,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				colId: 'remain_days',
				headerName: t('orders.remain_days'),
				minWidth: 184,
				flex: 1,
				valueGetter: ({ data }) => Math.max(0, data!.remainDays),
			},
			{
				colId: 'strike_price',
				headerName: t('orders.strike_price'),
				minWidth: 144,
				flex: 1,
				valueGetter: ({ data }) => data!.strikePrice,
				valueFormatter: ({ value }) => sepNumbers(String(value ?? 0)),
			},
			{
				colId: 'bs_avg',
				headerName: t('orders.buy_sell_average'),
				valueGetter: ({ data }) => (data!.side === 'Buy' ? data!.avgBuyPrice : data!.avgSellPrice) ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(Math.round(value ?? 0))),
			},
			{
				colId: 'lastTradedPrice',
				headerName: t('orders.last_traded_price'),
				minWidth: 128,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Option.Root>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data!.lastTradedPrice ?? 0, data!.lastTradedPriceVarPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
				comparator: (valueA, valueB) => valueA[1] - valueB[1],
			},
			{
				colId: 'closingPrice',
				headerName: t('orders.closing_price'),
				minWidth: 128,
				cellRenderer: CellPercentRenderer,
				cellRendererParams: ({ value }: ICellRendererParams<Option.Root>) => ({
					percent: value[1] ?? 0,
				}),
				valueGetter: ({ data }) => [data!.closingPrice ?? 0, data!.closingPriceVarPercent ?? 0],
				valueFormatter: ({ value }) => sepNumbers(String(value[0])),
				comparator: (valueA, valueB) => valueA[1] - valueB[1],
			},
			{
				colId: 'action',
				headerName: t('orders.action'),
				minWidth: 140,
				maxWidth: 140,
				sortable: false,
				cellRenderer: OptionActionCell,
				cellRendererParams: {
					onClosePosition,
					onChangeCollateral,
				},
			},
		],
		[JSON.stringify(data)],
	);

	const defaultColDef: ColDef<Order.OptionOrder> = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			flex: 1,
		}),
		[],
	);

	const unselectAll = () => {
		const eGrid = gridRef.current;
		if (!eGrid) return;

		eGrid.deselectAll();
	};

	useLayoutEffect(() => {
		const removeHandler = ipcMain.handle('deselect_orders', unselectAll);
		return () => removeHandler();
	}, []);

	return (
		<>
			<AgTable<Order.OptionOrder>
				ref={gridRef}
				rowData={data}
				rowHeight={40}
				headerHeight={48}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				suppressRowClickSelection={false}
				className='h-full border-0'
				rowSelection='multiple'
			/>

			{(loading || data.length === 0) && (
				<div
					className='absolute left-0 size-full flex-justify-center'
					style={{ backdropFilter: 'blur(2px)', top: '48px', height: 'calc(100% - 48px)', zIndex: 9 }}
				>
					{loading ? <Loading /> : data.length === 0 ? <NoData /> : null}
				</div>
			)}
		</>
	);
};

export default OptionTable;
