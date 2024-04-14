import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import AgTable from '@/components/common/Tables/AgTable';
import { useAppDispatch } from '@/features/hooks';
import { setChoiceCollateralModal } from '@/features/slices/modalSlice';
import { useTradingFeatures } from '@/hooks';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import NoData from '../NoData';
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
			side: order.side === 'Call' ? 'sell' : 'buy',
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
				colId: 'order_side',
				headerName: t('orders.order_side'),
				valueGetter: ({ data }) => data!.side,
				valueFormatter: ({ value }) => (value === 'Call' ? t('side.buy') : t('side.sell')),
				cellClass: ({ data }) => {
					switch (data!.side) {
						case 'Call':
							return 'text-success-100';
						case 'Put':
							return 'text-error-100';
						default:
							return '';
					}
				},
			},
			{
				colId: 'position_count',
				headerName: t('orders.position_count'),
				valueGetter: ({ data }) => Math.max(0, data!.positionCount),
				valueFormatter: ({ value }) => sepNumbers(String(value ?? 0)),
			},
			{
				colId: 'variation_margin',
				headerName: t('orders.variation_margin'),
				minWidth: 144,
				flex: 1,
				valueGetter: ({ data }) => data!.variationMargin,
				valueFormatter: ({ value }) => sepNumbers(String(value ?? 0)),
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
				colId: 'strike_price',
				headerName: t('orders.strike_price'),
				minWidth: 144,
				flex: 1,
				valueGetter: ({ data }) => data!.strikePrice,
				valueFormatter: ({ value }) => sepNumbers(String(value ?? 0)),
			},
			{
				colId: 'remain_days',
				headerName: t('orders.remain_days'),
				minWidth: 160,
				flex: 1,
				valueGetter: ({ data }) => Math.max(0, data!.remainDays),
			},
			{
				colId: 'action',
				headerName: t('orders.action'),
				minWidth: 140,
				maxWidth: 140,
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

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid) return;

		try {
			eGrid.setGridOption('rowData', data);
		} catch (e) {
			//
		}
	}, [data]);

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
