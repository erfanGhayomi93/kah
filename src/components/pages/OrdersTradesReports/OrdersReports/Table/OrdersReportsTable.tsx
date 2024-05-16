import AgTable from '@/components/common/Tables/AgTable';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef } from 'react';

interface OrdersReportsTableProps {
	reports: Reports.IOrdersReports[] | null;
	columnsVisibility: OrdersReports.IOrdersReportsColumnsState[];
	setColumnsVisibility: Dispatch<SetStateAction<OrdersReports.IOrdersReportsColumnsState[]>>;
}

const OrdersReportsTable = ({ reports, columnsVisibility, setColumnsVisibility }: OrdersReportsTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Reports.IOrdersReports>>(null);

	const dateFormatter = (v: string | number, format: string) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format(format);
	};

	const COLUMNS = useMemo<Array<ColDef<Reports.IOrdersReports>>>(
		() =>
			[
				/* ردیف */
				{
					headerName: t('orders_reports_page.id_column'),
					field: 'orderId',
					maxWidth: 112,
					minWidth: 112,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueGetter: ({ node }) => String((node?.childIndex ?? 0) + 1),
				},
				/* نماد */
				{
					headerName: t('orders_reports_page.symbol_column'),
					field: 'symbolTitle',
					cellClass: 'text-right',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
				},
				/* سمت */
				{
					headerName: t('orders_reports_page.side_column'),
					field: 'orderSide',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellClass: ({ data }) => {
						if (!data) return;
						return clsx({
							'text-success-200': data.orderSide.includes('Buy'),
							'text-error-200': data.orderSide.includes('Sell'),
						});
					},
					valueFormatter: ({ value }) => t('orders_reports_page.side_' + value),
				},
				/* تاریخ */
				{
					headerName: t('orders_reports_page.date_column'),
					field: 'orderDateTime',
					maxWidth: 144,
					minWidth: 144,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value, 'YYYY/MM/DD'),
				},
				/* ساعت */
				{
					headerName: t('orders_reports_page.time_column'),
					field: 'orderDateTime',
					maxWidth: 144,
					minWidth: 144,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value, 'HH:mm'),
				},
				/* حجم کل */
				{
					headerName: t('orders_reports_page.overall_volume_column'),
					field: 'quantity',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: (p) => sepNumbers(p.value),
				},
				/* قیمت */
				{
					headerName: t('orders_reports_page.price_column'),
					field: 'price',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: (p) => sepNumbers(p.value),
				},
				/* حجم انجام شده */
				{
					headerName: t('orders_reports_page.done_volume_column'),
					field: 'sumExecuted',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => sepNumbers(value || 0),
				},
				/* وضعیت سفارش */
				{
					headerName: t('orders_reports_page.status_column'),
					field: 'lastErrorCode',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellClass: 'text-right rtl',
					valueGetter: ({ data }) => {
						if (!data) return '-';
						const { orderStatus, lastErrorCode, customErrorMsg } = data;
						const errorMessage = lastErrorCode || customErrorMsg;
						return (
							t('order_status.' + orderStatus) +
							(errorMessage ? ': ' + t('order_errors.' + errorMessage) : '')
						);
					},
				},
				/* اعتبار */
				{
					headerName: t('orders_reports_page.validity_column'),
					field: 'validity',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ data }) => {
						if (!data) return '-';
						const { validity, validityDate } = data;

						if (validity === 'GoodTillDate') return dateFormatter(validityDate, 'YYYY/MM/DD');
						return t('validity_date.' + validity.toLowerCase());
					},
				},
			] as Array<ColDef<Reports.IOrdersReports>>,
		[],
	);

	const defaultColDef: ColDef<Reports.IOrdersReports> = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			minWidth: 114,
			flex: 1,
		}),
		[],
	);

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid || !Array.isArray(columnsVisibility)) return;

		try {
			for (let i = 0; i < columnsVisibility.length; i++) {
				const { hidden, id } = columnsVisibility[i];
				eGrid.setColumnsVisible([id], !hidden);
			}
		} catch (e) {
			//
		}
	}, [columnsVisibility]);

	return (
		<>
			<AgTable<Reports.IOrdersReports>
				ref={gridRef}
				rowData={reports}
				rowHeight={40}
				headerHeight={48}
				columnDefs={COLUMNS}
				defaultColDef={defaultColDef}
				suppressRowClickSelection={false}
				className='h-full border-0'
			/>
		</>
	);
};

export default OrdersReportsTable;
