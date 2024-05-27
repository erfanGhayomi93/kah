import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
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

	const COLUMNS = useMemo<Array<IColDef<Reports.IOrdersReports>>>(
		() => [
			/* ردیف */
			{
				headerName: t('orders_reports_page.id_column'),
				// field: 'orderId',
				// maxWidth: 112,
				// minWidth: 112,
				valueFormatter: (row) => row.orderId,
			},
			/* نماد */
			{
				headerName: t('orders_reports_page.symbol_column'),
				// field: 'symbolTitle',
				cellClass: 'text-right',
				valueFormatter: (row) => row.symbolTitle,
			},
			/* سمت */
			{
				headerName: t('orders_reports_page.side_column'),
				// field: 'orderSide',
				cellClass: (row) => {
					if (!row) return;
					return clsx({
						'text-success-200': row.orderSide.includes('Buy'),
						'text-error-200': row.orderSide.includes('Sell'),
					});
				},
				valueFormatter: (row) => t('orders_reports_page.side_' + row.orderSide),
			},
			/* تاریخ */
			{
				headerName: t('orders_reports_page.date_column'),
				// field: 'orderDateTime',
				// maxWidth: 144,
				// minWidth: 144,
				cellClass: 'ltr',
				valueFormatter: (row) => dateFormatter(row.orderDateTime, 'YYYY/MM/DD HH:mm'),
			},
			/* حجم کل */
			{
				headerName: t('orders_reports_page.overall_volume_column'),
				// field: 'quantity',
				valueFormatter: (row) => sepNumbers(String(row.quantity)),
			},
			/* قیمت */
			{
				headerName: t('orders_reports_page.price_column'),
				// field: 'price',
				valueFormatter: (row) => sepNumbers(String(row.price)),
			},
			/* حجم انجام شده */
			{
				headerName: t('orders_reports_page.done_volume_column'),
				// field: 'sumExecuted',
				valueFormatter: (row) => sepNumbers(String(row.sumExecuted)),
			},
			/* وضعیت سفارش */
			{
				headerName: t('orders_reports_page.status_column'),
				// field: 'lastErrorCode',
				// maxWidth: 250,
				// minWidth: 250,
				cellClass: 'text-right rtl truncate',
				valueFormatter: (row) => {
					if (!row) return '-';
					const { orderStatus, lastErrorCode, customErrorMsg } = row;
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
				// field: 'validity',
				valueFormatter: (row) => {
					if (!row) return '-';
					const { validity, validityDate } = row;

					if (validity === 'GoodTillDate') return dateFormatter(validityDate, 'YYYY/MM/DD');
					return t('validity_date.' + validity);
				},
			},
		],
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
			<LightweightTable rowData={reports ?? []} columnDefs={COLUMNS} />
		</>
	);
};

export default OrdersReportsTable;
