import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import AgTable from '@/components/common/Tables/AgTable';
import RialTemplate from '@/components/common/Tables/Headers/RialTemplate';
import { editableOrdersStatus } from '@/constants';
import { useAppDispatch } from '@/features/hooks';
import { setConfirmModal, setOrderDetailsModal } from '@/features/slices/modalSlice';
import { useTradingFeatures } from '@/hooks';
import { dateFormatter, days, sepNumbers } from '@/utils/helpers';
import { deleteOrder } from '@/utils/orders';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo, useRef } from 'react';
import OrderActionCell from '../common/OrderActionCell';
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

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<TOrders>>(null);

	const { addBuySellModal } = useTradingFeatures();

	const onCopy = (order: TOrders) => {
		addBuySellModal({
			side: order.orderSide === 'Buy' ? 'buy' : 'sell',
			symbolType: 'base',
			mode: 'create',
			symbolISIN: order.symbolISIN,
			symbolTitle: order.symbolTitle,
			initialPrice: order.price,
			initialQuantity: order.quantity,
			initialValidity: order.validity,
			initialValidityDate: order.validity === 'GoodTillDate' ? new Date(order.validityDate).getTime() : 0,
		});
	};

	const onDelete = (order: TOrders) => {
		dispatch(
			setConfirmModal({
				title: t('orders.delete_draft'),
				description: t('orders.delete_draft_confirm', { title: order.symbolTitle }),
				onSubmit: () => deleteOrder([order.orderId]),
				onCancel: () => dispatch(setConfirmModal(null)),
				confirm: {
					label: t('common.delete'),
					type: 'error',
				},
			}),
		);
	};

	const onEdit = (order: TOrders) => {
		addBuySellModal({
			id: order.orderId,
			side: order.orderSide === 'Buy' ? 'buy' : 'sell',
			symbolType: 'base',
			type: 'order',
			mode: 'edit',
			symbolISIN: order.symbolISIN,
			symbolTitle: order.symbolTitle,
			initialPrice: order.price,
			initialQuantity: order.quantity,
			initialValidity: order.validity,
			initialValidityDate: order.validity === 'GoodTillDate' ? new Date(order.validityDate).getTime() : 0,
		});
	};

	const showDetails = (order: TOrders) => {
		dispatch(
			setOrderDetailsModal({
				type: 'order',
				data: order,
			}),
		);
	};

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
							return 'text-light-success-100';
						case 'Sell':
							return 'text-light-error-100';
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
							return 'rtl text-tiny text-light-success-100';
						case 'Error':
						case 'Canceled':
							return 'rtl text-tiny text-light-error-100';
						case 'Modified':
							return 'rtl text-tiny text-light-secondary-300';
						default:
							return 'rtl text-tiny text-light-gray-700';
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
				headerName: t('orders.executed_and_remain_orders'),
				valueGetter: ({ data }) => data!.sumExecuted ?? 0,
				minWidth: 160,
				valueFormatter: ({ data }) => {
					const executed = data!.sumExecuted;
					const remain = Math.max(0, data!.quantity - executed) ?? 0;

					return `(${sepNumbers(String(remain))}) ${sepNumbers(String(executed))}`;
				},
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
				headerComponent: RialTemplate,
				valueGetter: ({ data }) => Math.abs(data!.price * data!.quantity - data!.orderVolume),
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'validity',
				headerName: t('orders.validity'),
				valueFormatter: ({ data }) => {
					const { validity, validityDate } = data!;

					if (validity === 'GoodTillDate') {
						const tt = new Date(validityDate).getTime();
						const d = days(Date.now(), tt);

						if (d === 0) return t('validity_date.Today');
						if (d === 1) return t('validity_date.Tomorrow');

						return dateFormatter(tt, 'date');
					}

					return t(`validity_date.${validity}`);
				},
			},
			{
				colId: 'action',
				headerName: t('orders.action'),
				minWidth: 160,
				maxWidth: 160,
				sortable: false,
				cellRenderer: OrderActionCell,
				cellRendererParams: {
					onCopy,
					onDelete,
					onEdit,
					showDetails,
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
		const removeHandler = ipcMain.handle('deselect_orders', unselectAll);
		return () => removeHandler();
	}, []);

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
