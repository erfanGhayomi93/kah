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
import { useEffect, useMemo, useRef } from 'react';
import OrderActionCell from '../common/OrderActionCell';
import SymbolTitleCell from '../common/SymbolTitleCell';
import SymbolTitleHeader from '../common/SymbolTitleHeader';

type TOrder = Order.OpenOrder[] | Order.TodayOrder[] | Order.ExecutedOrder[];

export interface OpenOrderProps {
	tab: 'open_orders';
	data: Array<Order.TDataTab<'open_orders'>>;
}

export interface ExecutedOrderProps {
	tab: 'executed_orders';
	data: Array<Order.TDataTab<'executed_orders'>>;
}

export interface TodayOrderProps {
	tab: 'today_orders';
	data: Array<Order.TDataTab<'today_orders'>>;
}

type OrderTableProps = (OpenOrderProps | ExecutedOrderProps | TodayOrderProps) & {
	setSelectedRows: (orders: TOrder) => void;
	loading: boolean;
};

const OrderTable = ({ tab, data, loading, setSelectedRows }: OrderTableProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Order.TDataTab>>(null);

	const { addBuySellModal } = useTradingFeatures();

	const onCopy = (order: Order.TDataTab) => {
		const price =
			tab === 'executed_orders'
				? (order as Order.TDataTab<'executed_orders'>).totalPrice
				: (order as Order.TDataTab<'today_orders' | 'open_orders'>).price;
		const quantity =
			tab === 'executed_orders'
				? (order as Order.TDataTab<'executed_orders'>).tradeQuantity
				: (order as Order.TDataTab<'today_orders' | 'open_orders'>).quantity;
		const validity =
			tab === 'executed_orders' ? undefined : (order as Order.TDataTab<'today_orders' | 'open_orders'>).validity;
		const validityDate =
			tab === 'executed_orders'
				? 0
				: new Date((order as Order.TDataTab<'today_orders' | 'open_orders'>).validityDate).getTime();

		addBuySellModal({
			side: order.orderSide === 'Buy' ? 'buy' : 'sell',
			mode: 'create',
			symbolISIN: order.symbolISIN,
			symbolTitle: order.symbolTitle,
			initialPrice: price,
			initialQuantity: quantity,
			initialValidity: validity,
			initialValidityDate: validityDate,
		});
	};

	const onDelete = (order: Order.TDataTab) => {
		const orderId =
			tab === 'executed_orders'
				? (order as Order.TDataTab<'executed_orders'>).id
				: tab === 'today_orders'
					? (order as Order.TDataTab<'today_orders'>).orderId
					: (order as Order.TDataTab<'open_orders'>).orderId;

		dispatch(
			setConfirmModal({
				title: t('orders.delete_order'),
				description: t('orders.delete_order_confirm', { title: order.symbolTitle }),
				onSubmit: () => deleteOrder([Number(orderId)]),
				onCancel: () => dispatch(setConfirmModal(null)),
				confirm: {
					label: t('common.delete'),
					type: 'error',
				},
			}),
		);
	};

	const onEdit = (order: Order.TDataTab) => {
		const orderId =
			tab === 'executed_orders'
				? (order as Order.TDataTab<'executed_orders'>).id
				: tab === 'today_orders'
					? (order as Order.TDataTab<'today_orders'>).orderId
					: (order as Order.TDataTab<'open_orders'>).orderId;
		const price =
			tab === 'executed_orders'
				? (order as Order.TDataTab<'executed_orders'>).totalPrice
				: (order as Order.TDataTab<'today_orders' | 'open_orders'>).price;
		const quantity =
			tab === 'executed_orders'
				? (order as Order.TDataTab<'executed_orders'>).tradeQuantity
				: (order as Order.TDataTab<'today_orders' | 'open_orders'>).quantity;
		const validity =
			tab === 'executed_orders' ? undefined : (order as Order.TDataTab<'today_orders' | 'open_orders'>).validity;
		const validityDate =
			tab === 'executed_orders'
				? 0
				: new Date((order as Order.TDataTab<'today_orders' | 'open_orders'>).validityDate).getTime();

		addBuySellModal({
			id: Number(orderId),
			side: order.orderSide === 'Buy' ? 'buy' : 'sell',
			type: 'order',
			mode: 'edit',
			switchable: false,
			symbolISIN: order.symbolISIN,
			symbolTitle: order.symbolTitle,
			initialPrice: price,
			initialQuantity: quantity,
			initialValidity: validity,
			initialValidityDate: validity === 'GoodTillDate' ? new Date(validityDate).getTime() : 0,
		});
	};

	const showDetails = (order: Order.TDataTab) => {
		dispatch(
			setOrderDetailsModal({
				type: 'order',
				data: order,
			}),
		);
	};

	const columnDefs = useMemo<Array<ColDef<Order.TDataTab>>>(
		() => [
			// نام نماد
			{
				colId: 'symbol_title',
				headerName: t('orders.symbol_title'),
				cellClass: 'ag-cell-checkbox justify-end text-right',
				pinned: 'right',
				filter: 'text',
				maxWidth: 160,
				headerComponent: SymbolTitleHeader,
				cellRenderer: SymbolTitleCell,
				checkboxSelection: ({ data }) =>
					data && 'orderStatus' in data ? editableOrdersStatus.includes(data!.orderStatus) : false,
				valueGetter: ({ data }) => data!.symbolTitle,
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},

			// سمت
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

			// وضعیت سفارش
			{
				colId: 'order_status',
				headerName: t('orders.order_status'),
				minWidth: 200,
				hide: tab === 'executed_orders',
				valueGetter: ({ data }) => (data as Order.TDataTab<'open_orders' | 'today_orders'>).orderStatus,
				valueFormatter: ({ value, data }) => {
					if (!data) return '-';

					const { lastErrorCode, customErrorMsg } = data as Order.TDataTab<'open_orders' | 'today_orders'>;
					const errorMessage = customErrorMsg || lastErrorCode;

					if (errorMessage) return t(customErrorMsg ? errorMessage : 'order_errors.' + errorMessage);
					return t('order_status.' + value);
				},
				cellClass: ({ value }) => {
					switch (value) {
						case 'OrderDone':
						case 'OnBoard':
							return 'rtl text-tiny text-success-100';
						case 'Error':
						case 'Canceled':
							return 'rtl text-tiny text-error-100';
						case 'Modified':
							return 'rtl text-tiny text-secondary-300';
						default:
							return 'rtl text-tiny text-gray-700';
					}
				},
			},

			// قیمت
			{
				colId: 'price',
				headerName: t('orders.price'),
				valueGetter: ({ data }) =>
					tab === 'executed_orders'
						? (data as Order.TDataTab<'executed_orders'>).totalPrice
						: (data as Order.TDataTab<'today_orders' | 'open_orders'>).price,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},

			// تعداد
			{
				colId: 'count',
				headerName: t('orders.count'),
				valueGetter: ({ data }) =>
					tab === 'executed_orders'
						? (data as Order.TDataTab<'executed_orders'>).tradeQuantity
						: (data as Order.TDataTab<'today_orders' | 'open_orders'>).quantity,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},

			// انجام شده
			{
				colId: 'column_executed',
				headerName: t('orders.col_executed_orders'),
				minWidth: 88,
				hide: tab === 'executed_orders',
				valueGetter: ({ data }) => (data as Order.TDataTab<'today_orders' | 'open_orders'>).sumExecuted ?? 0,
				valueFormatter: ({ value }) => sepNumbers(value ?? 0),
			},

			// باقی مانده
			{
				colId: 'column_left',
				headerName: t('orders.col_remain_orders'),
				minWidth: 88,
				hide: tab === 'executed_orders',
				valueGetter: ({ data }) =>
					Math.max(
						(data as Order.TDataTab<'today_orders' | 'open_orders'>).quantity -
							(data as Order.TDataTab<'today_orders' | 'open_orders'>).sumExecuted,
						0,
					) ?? 0,
				valueFormatter: ({ value }) => sepNumbers(value ?? 0),
			},

			// کارمزد
			{
				colId: 'commission',
				headerName: t('orders.commission'),
				hide: tab !== 'executed_orders',
				headerComponent: RialTemplate,
				valueGetter: ({ data }) => (data as Order.TDataTab<'executed_orders'>).totalCommission,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},

			// ارزش معامله / مبلغ
			{
				colId: 'amount',
				headerName: tab === 'executed_orders' ? t('orders.trade_value') : t('orders.amount'),
				headerComponent: RialTemplate,
				valueGetter: ({ data }) =>
					tab === 'executed_orders'
						? (data as Order.TDataTab<'executed_orders'>).totalPrice
						: (data as Order.TDataTab<'today_orders' | 'open_orders'>).orderVolume,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},

			// جایگاه لحظه‌ای
			{
				colId: 'column_current_place',
				headerName: t('orders.current_place'),
				hide: tab !== 'open_orders',
				minWidth: 120,
				flex: 1,
				valueGetter: ({ data }) => (data as Order.TDataTab<'open_orders'>).orderPlaceInPrice,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},

			// حجم پیش‌رو
			{
				colId: 'column_upcoming_quantity',
				headerName: t('orders.upcoming_quantity'),
				hide: tab !== 'open_orders',
				minWidth: 112,
				valueGetter: ({ data }) => (data as Order.TDataTab<'open_orders'>).orderVolumeInPrice,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},

			// تاریخ ثبت
			{
				colId: 'save_date',
				hide: tab === 'executed_orders',
				headerName: tab === 'open_orders' ? t('orders.save_date') : t('orders.save_time'),
				valueGetter: ({ data }) =>
					tab === 'executed_orders'
						? (data as Order.TDataTab<'executed_orders'>).tradeDate
						: (data as Order.TDataTab<'today_orders' | 'open_orders'>).orderDateTime,
				valueFormatter: ({ value }) => dateFormatter(value, tab === 'today_orders' ? 'time' : 'datetime'),
			},

			// اعتبار سفارش
			{
				colId: 'validity',
				headerName: t('orders.validity'),
				hide: tab === 'executed_orders',
				valueFormatter: ({ data }) => {
					if (!data) return '-';

					const { validity, validityDate } = data as Order.TDataTab<'today_orders' | 'open_orders'>;

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

			// شعبه
			{
				colId: 'branchName',
				hide: tab !== 'executed_orders',
				headerName: t('orders.branch'),
				valueGetter: ({ data }) => (data as Order.TDataTab<'executed_orders'>).branchName ?? '-',
			},

			// عملیات
			{
				colId: 'action',
				hide: tab === 'executed_orders',
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
		[JSON.stringify(data), tab],
	);

	const defaultColDef: ColDef<Order.TDataTab> = useMemo(
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

	useEffect(() => {
		const removeHandler = ipcMain.handle('deselect_orders', unselectAll);
		return () => removeHandler();
	}, []);

	useEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		gridApi.setGridOption('columnDefs', columnDefs);
	}, [tab]);

	return (
		<>
			<AgTable<Order.TDataTab>
				suppressAnimationFrame={false}
				suppressRowClickSelection
				ref={gridRef}
				rowData={data}
				rowHeight={40}
				headerHeight={48}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				onSelectionChanged={(e) => setSelectedRows((e.api.getSelectedRows() ?? []) as TOrder)}
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
