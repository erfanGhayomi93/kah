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
				colId: 'id',
				headerName: t('orders_reports_page.id_column'),
				valueGetter: (row) => row.orderId,
			},
			/* نماد */
			{
				colId: 'symbolTitle',
				headerName: t('orders_reports_page.symbol_column'),
				cellClass: 'text-right',
				valueGetter: (row) => row.symbolTitle,
			},
			/* سمت */
			{
				colId: 'orderSide',
				headerName: t('orders_reports_page.side_column'),
				cellClass: (row) => {
					if (!row) return;
					return clsx({
						'text-success-200': row.orderSide.includes('Buy'),
						'text-error-200': row.orderSide.includes('Sell'),
					});
				},
				valueGetter: (row) => t('orders_reports_page.side_' + row.orderSide),
			},
			/* تاریخ */
			{
				colId: 'orderDateTime',
				headerName: t('orders_reports_page.date_column'),
				cellClass: 'ltr',
				valueGetter: (row) => dateFormatter(row.orderDateTime, 'YYYY/MM/DD HH:mm'),
			},
			/* حجم کل */
			{
				colId: 'quantity',
				headerName: t('orders_reports_page.overall_volume_column'),
				valueGetter: (row) => sepNumbers(String(row.quantity)),
			},
			/* قیمت */
			{
				colId: 'price',
				headerName: t('orders_reports_page.price_column'),
				valueGetter: (row) => sepNumbers(String(row.price)),
			},
			/* حجم انجام شده */
			{
				colId: 'sumExecuted',
				headerName: t('orders_reports_page.done_volume_column'),
				valueGetter: (row) => sepNumbers(String(row.sumExecuted)),
			},
			/* وضعیت سفارش */
			{
				colId: 'lastErrorCode',
				headerName: t('orders_reports_page.status_column'),
				cellClass: 'text-right rtl truncate',
				valueGetter: (row) => {
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
				colId: 'validity',
				headerName: t('orders_reports_page.validity_column'),
				valueGetter: (row) => {
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
