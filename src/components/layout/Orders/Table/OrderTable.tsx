import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import AgTable from '@/components/common/Tables/AgTable';
import RialTemplate from '@/components/common/Tables/Headers/RialTemplate';
import { editableOrdersStatus } from '@/constants';
import { dateFormatter, days, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import NoData from '../NoData';
import SymbolTitleCell from '../common/SymbolTitleCell';
import SymbolTitleHeader from '../common/SymbolTitleHeader';

type TOrders = Order.OpenOrder | Order.ExecutedOrder | Order.TodayOrder;

interface OrderTableProps {
	setSelectedRows: (orders: Order.TOrder[]) => void;
	tab: TOrdersTab;
	data: TOrders[];
	loading: boolean;
}

const OrderTable = ({ setSelectedRows, loading, data }: OrderTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<TOrders>>(null);

	const columnDefs = useMemo<Array<ColDef<TOrders>>>(
		() => [
			{
				colId: 'symbol_title',
				headerName: t('orders.symbol_title'),
				cellClass: 'justify-end text-right',
				pinned: 'right',
				headerComponent: SymbolTitleHeader,
				cellRenderer: SymbolTitleCell,
				checkboxSelection: ({ data }) => editableOrdersStatus.includes(data!.orderStatus),
				valueGetter: ({ data }) => data!.symbolTitle,
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},
			{
				colId: 'order_side',
				headerName: t('orders.order_side'),
				valueGetter: ({ data }) => data!.orderSide,
				valueFormatter: ({ value }) => (value === 'Buy' ? t('side.buy') : t('side.sell')),
				cellClass: ({ data }) => {
					switch (data!.orderSide) {
						case 'Buy':
							return 'text-success-100';
						case 'Sell':
							return 'text-error-100';
						default:
							return '';
					}
				},
			},
			{
				colId: 'order_status',
				headerName: t('orders.order_status'),
				minWidth: 200,
				valueGetter: ({ data }) => data!.orderStatus,
				valueFormatter: ({ data }) => {
					const { orderStatus, lastErrorCode, customErrorMsg } = data!;
					const errorMessage = customErrorMsg || lastErrorCode;

					if (errorMessage) return t(customErrorMsg ? errorMessage : 'order_errors.' + errorMessage);
					return t('order_status.' + orderStatus);
				},
				cellClass: ({ data }) => {
					switch (data!.orderStatus) {
						case 'OrderDone':
						case 'OnBoard':
							return 'rtl text-tiny text-success-100';
						case 'Error':
						case 'Canceled':
							return 'rtl text-tiny text-error-100';
						case 'Modified':
							return 'rtl text-tiny text-secondary-300';
						default:
							return 'rtl text-tiny text-gray-900';
					}
				},
			},
			{
				colId: 'count',
				headerName: t('orders.count'),
				valueGetter: ({ data }) => data!.quantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'price',
				headerName: t('orders.price'),
				valueGetter: ({ data }) => data!.price ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'executed',
				headerName: t('orders.executed'),
				valueGetter: ({ data }) => data!.sumExecuted ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'remain',
				headerName: t('orders.remain'),
				valueGetter: ({ data }) => Math.max(0, data!.quantity - data!.sumExecuted) ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'amount',
				headerName: t('orders.amount'),
				headerComponent: RialTemplate,
				valueGetter: ({ data }) => data!.orderVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'save_date',
				headerName: t('orders.save_date'),
				valueGetter: ({ data }) => data!.orderDateTime,
				valueFormatter: ({ value }) => dateFormatter(value, 'datetime'),
			},
			{
				colId: 'commission',
				headerName: t('orders.commission'),
				valueGetter: () => '−',
			},
			{
				colId: 'validity',
				headerName: t('orders.validity'),
				valueFormatter: ({ data }) => {
					const { validity, validityDate } = data!;

					if (validity === 'GoodTillDate') {
						const tt = new Date(validityDate).getTime();
						const d = days(Date.now(), tt);

						if (d === 0) return t('validity_date.today');
						if (d === 1) return t('validity_date.tomorrow');

						return dateFormatter(tt, 'date');
					}

					return t('validity_date.' + validity.toLowerCase());
				},
			},
		],
		[JSON.stringify(data)],
	);

	const defaultColDef: ColDef<TOrders> = useMemo(
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
		ipcMain.handle('deselect_orders', unselectAll);

		return () => {
			ipcMain.removeHandler('deselect_orders', unselectAll);
		};
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
			<AgTable<TOrders>
				suppressRowClickSelection
				ref={gridRef}
				rowData={data}
				rowHeight={40}
				headerHeight={48}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				onSelectionChanged={(e) => setSelectedRows(e.api.getSelectedRows() ?? [])}
				rowClass='cursor-pointer'
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

export default OrderTable;
