import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import Tooltip from '@/components/common/Tooltip';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface OrdersReportsTableProps {
	reports: Reports.IOrdersReports[] | null;
	columnsVisibility: OrdersReports.IOrdersReportsColumnsState[];
}

const OrdersReportsTable = ({ reports, columnsVisibility }: OrdersReportsTableProps) => {
	const t = useTranslations();

	const COLUMNS = useMemo<Array<IColDef<Reports.IOrdersReports>>>(
		() => [
			/* ردیف */
			{
				colId: 'orderId',
				headerName: t('orders_reports_page.id_column'),
				width: 32,
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'orderId')]?.hidden,
			},
			/* نماد */
			{
				colId: 'symbolTitle',
				headerName: t('orders_reports_page.symbol_column'),
				cellClass: 'text-right',
				valueGetter: (row) => row.symbolTitle,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'symbolTitle')]?.hidden,
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
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'orderSide')]?.hidden,
			},
			/* زمان */
			{
				colId: 'orderDateTime',
				headerName: t('orders_reports_page.date_column'),
				cellClass: 'ltr',
				valueGetter: (row) => dateFormatter(row.orderDateTime ?? '-', 'datetime'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'orderDateTime')]
					?.hidden,
			},
			/* حجم کل */
			{
				colId: 'quantity',
				headerName: t('orders_reports_page.overall_volume_column'),
				valueGetter: (row) => sepNumbers(String(row.quantity)),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'quantity')]?.hidden,
			},
			/* قیمت */
			{
				colId: 'price',
				headerName: t('orders_reports_page.price_column'),
				valueGetter: (row) => sepNumbers(String(row.price)),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'price')]?.hidden,
			},
			/* حجم انجام شده */
			{
				colId: 'sumExecuted',
				headerName: t('orders_reports_page.done_volume_column'),
				valueGetter: (row) => sepNumbers(String(row.sumExecuted)),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'sumExecuted')]?.hidden,
			},
			/* وضعیت سفارش */
			{
				colId: 'lastErrorCode',
				headerName: t('orders_reports_page.status_column'),
				width: 180,
				cellClass: 'text-right rtl truncate flex-1',
				valueGetter: (row) => row.lastErrorCode ?? '',
				valueFormatter: ({ row }) => {
					if (!row) return '-';
					const { orderStatus, lastErrorCode, customErrorMsg } = row;
					const errorMessage = lastErrorCode || customErrorMsg;
					return (
						<Tooltip
							content={
								t('order_status.' + orderStatus) +
								(errorMessage ? ': ' + t('order_errors.' + errorMessage) : '')
							}
						>
							<span>
								{t('order_status.' + orderStatus) +
									(errorMessage ? ': ' + t('order_errors.' + errorMessage) : '')}
							</span>
						</Tooltip>
					);
				},
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'lastErrorCode')]
					?.hidden,
			},
			/* اعتبار */
			{
				colId: 'validity',
				headerName: t('orders_reports_page.validity_column'),
				valueGetter: (row) => {
					if (!row) return '-';
					const { validity, validityDate } = row;

					if (validity === 'GoodTillDate') return dateFormatter(validityDate ?? '', 'date');
					return t('validity_date.' + validity);
				},
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'validity')]?.hidden,
			},
		],
		[columnsVisibility],
	);

	return (
		<>
			<LightweightTable rowData={reports ?? []} columnDefs={COLUMNS} />
		</>
	);
};

export default OrdersReportsTable;
