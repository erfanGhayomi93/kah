import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import AgTable from '@/components/common/Tables/AgTable';
import { useAppDispatch } from '@/features/hooks';
import { setConfirmModal } from '@/features/slices/modalSlice';
import { useTradingFeatures } from '@/hooks';
import { dateConverter, dateFormatter, days, sepNumbers } from '@/utils/helpers';
import { createOrder, deleteDraft } from '@/utils/orders';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import DraftActionCell from '../common/DraftActionCell';
import SymbolTitleCell from '../common/SymbolTitleCell';
import SymbolTitleHeader from '../common/SymbolTitleHeader';

interface DraftTableProps {
	setSelectedRows: (orders: Order.TOrder[]) => void;
	data: Order.DraftOrder[];
	loading: boolean;
}

const DraftTable = ({ setSelectedRows, loading, data }: DraftTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Order.DraftOrder>>(null);

	const dispatch = useAppDispatch();

	const { addBuySellModal } = useTradingFeatures();

	const onSend = async (order: Order.DraftOrder) => {
		try {
			const { id, price, quantity, validityDate, validity, symbolISIN, side } = order;
			const params: IpcMainChannels['send_order'] = {
				symbolISIN,
				quantity,
				price,
				orderSide: side === 'Buy' ? 'buy' : 'sell',
				validity,
				validityDate: 0,
			};

			if (params.validity === 'GoodTillDate') params.validityDate = new Date(validityDate).getTime();
			else if (params.validity === 'Month' || params.validity === 'Week')
				params.validityDate = dateConverter(params.validity);

			await createOrder(params);
			deleteDraft([id]);

			toast.success(t('alerts.order_successfully_created'), {
				toastId: 'order_successfully_created',
			});
		} catch (e) {
			//
		}
	};

	const onDelete = (order: Order.DraftOrder) => {
		dispatch(
			setConfirmModal({
				title: t('orders.delete_draft'),
				description: t('orders.delete_draft_confirm', { title: order.symbolTitle }),
				onSubmit: () => deleteDraft([order.id]),
				onCancel: () => dispatch(setConfirmModal(null)),
				confirm: {
					label: t('common.delete'),
					type: 'error',
				},
			}),
		);
	};

	const onEdit = (order: Order.DraftOrder) => {
		addBuySellModal({
			id: order.id,
			side: order.side === 'Buy' ? 'buy' : 'sell',
			symbolType: 'base',
			type: 'draft',
			mode: 'edit',
			symbolISIN: order.symbolISIN,
			symbolTitle: order.symbolTitle,
			initialPrice: order.price,
			initialQuantity: order.quantity,
			initialValidity: order.validity,
			initialValidityDate: order.validity === 'GoodTillDate' ? new Date(order.validityDate).getTime() : 0,
		});
	};

	const onCopy = (order: Order.DraftOrder) => {
		addBuySellModal({
			side: order.side === 'Buy' ? 'buy' : 'sell',
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

	const columnDefs = useMemo<Array<ColDef<Order.DraftOrder>>>(
		() => [
			{
				colId: 'symbol_title',
				headerName: t('orders.symbol_title'),
				cellClass: 'justify-end text-right',
				headerComponent: SymbolTitleHeader,
				cellRenderer: SymbolTitleCell,
				checkboxSelection: true,
				headerCheckboxSelection: true,
				valueGetter: ({ data }) => data!.symbolTitle,
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},
			{
				colId: 'order_side',
				headerName: t('orders.order_side'),
				valueGetter: ({ data }) => data!.side,
				valueFormatter: ({ value }) => (value === 'Buy' ? t('side.buy') : t('side.sell')),
				cellClass: ({ data }) => {
					switch (data!.side) {
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
				colId: 'price',
				headerName: t('orders.price'),
				valueGetter: ({ data }) => data!.price ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'count',
				headerName: t('orders.count'),
				valueGetter: ({ data }) => data!.quantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'save_date',
				headerName: t('orders.save_date'),
				valueGetter: ({ data }) => data!.date,
				valueFormatter: ({ value }) => dateFormatter(value, 'datetime'),
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
				cellRenderer: DraftActionCell,
				cellRendererParams: {
					onSend,
					onDelete,
					onEdit,
					onCopy,
				},
			},
		],
		[JSON.stringify(data)],
	);

	const defaultColDef: ColDef<Order.DraftOrder> = useMemo(
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

	return (
		<>
			<AgTable<Order.DraftOrder>
				ref={gridRef}
				rowData={data}
				rowHeight={40}
				headerHeight={48}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				suppressRowClickSelection={false}
				onSelectionChanged={(e) => setSelectedRows(e.api.getSelectedRows() ?? [])}
				className='h-full border-0'
				rowSelection='multiple'
			/>

			{(loading || data.length === 0) && (
				<div
					className='absolute left-0 w-full flex-justify-center'
					style={{ backdropFilter: 'blur(2px)', top: '48px', height: 'calc(100% - 48px)', zIndex: 9 }}
				>
					{loading ? <Loading /> : data.length === 0 ? <NoData /> : null}
				</div>
			)}
		</>
	);
};

export default DraftTable;
