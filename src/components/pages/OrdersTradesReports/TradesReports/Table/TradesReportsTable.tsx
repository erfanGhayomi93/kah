import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { type GridApi } from '@ag-grid-community/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';

interface TradeReportsTableProps {
	reports: Reports.ITradesReports[] | null;
	columnsVisibility: TradesReports.ITradesReportsColumnsState[];
}

const TradeReportsTable = ({ reports, columnsVisibility }: TradeReportsTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Reports.ITradesReports>>(null);

	const COLUMNS = useMemo<Array<IColDef<Reports.ITradesReports>>>(
		() => [
			/* ردیف */
			{
				colId: 'id',
				headerName: t('trades_reports_page.id_column'),
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'id')]?.hidden,
			},
			/* نماد */
			{
				colId: 'symbolTitle',
				headerName: t('trades_reports_page.symbol_column'),
				width: 100,
				cellClass: 'text-right',
				valueGetter: (row) => row.symbolTitle,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'symbolTitle')]?.hidden,
			},
			/* سمت */
			{
				colId: 'orderSide',
				headerName: t('trades_reports_page.side_column'),
				cellClass: (row) => {
					if (!row) return;
					return clsx({
						'text-success-200': row.orderSide.includes('Buy'),
						'text-error-200': row.orderSide.includes('Sell'),
					});
				},
				valueGetter: (row) => t('trades_reports_page.side_' + row.orderSide),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'orderSide')]?.hidden,
			},
			/* تاریخ */
			{
				colId: 'tradeDate',
				headerName: t('trades_reports_page.date_column'),
				cellClass: 'ltr',
				valueGetter: (row) => dateFormatter(row.tradeDate, 'date'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'tradeDate')]?.hidden,
			},
			/* ساعت */
			{
				colId: 'tradeTime',
				headerName: t('trades_reports_page.time_column'),
				cellClass: 'ltr',
				valueGetter: (row) => dateFormatter(row.tradeDate, 'time'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'tradeTime')]?.hidden,
			},
			/* حجم کل */
			{
				colId: 'tradedQuantity',
				headerName: t('trades_reports_page.overall_volume_column'),
				valueGetter: (row) => sepNumbers(String(row.tradedQuantity)),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'tradedQuantity')]
					?.hidden,
			},
			/* قیمت */
			{
				colId: 'tradePrice',
				headerName: t('trades_reports_page.price_column'),
				valueGetter: (row) => sepNumbers(String(row.tradePrice)),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'tradePrice')]?.hidden,
			},
			/* کارمزد */
			{
				colId: 'totalQuota',
				headerName: t('trades_reports_page.commission_column'),
				valueGetter: (row) => sepNumbers(String(row.totalQuota)),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'totalQuota')]?.hidden,
			},
			/* ارزش معامله */
			{
				colId: 'total',
				headerName: t('trades_reports_page.value_column'),
				valueGetter: (row) => sepNumbers(String(row.total)),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'total')]?.hidden,
			},
		],
		[columnsVisibility],
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

export default TradeReportsTable;
