import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { type GridApi } from '@ag-grid-community/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef } from 'react';

interface TradeReportsTableProps {
	reports: Reports.ITradesReports[] | null;
	columnsVisibility: TradesReports.ITradesReportsColumnsState[];
	setColumnsVisibility: Dispatch<SetStateAction<TradesReports.ITradesReportsColumnsState[]>>;
}

const TradeReportsTable = ({ reports, columnsVisibility, setColumnsVisibility }: TradeReportsTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Reports.ITradesReports>>(null);

	const COLUMNS = useMemo<Array<IColDef<Reports.ITradesReports>>>(
		() => [
			/* ردیف */
			{
				colId: 'id',
				headerName: t('trades_reports_page.id_column'),
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
			},
			/* نماد */
			{
				colId: 'symbolTitle',
				headerName: t('trades_reports_page.symbol_column'),
				cellClass: 'text-right',
				valueGetter: (row) => row.symbolTitle,
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
			},
			/* تاریخ */
			{
				colId: 'tradeDate',
				headerName: t('trades_reports_page.date_column'),
				cellClass: 'ltr',
				valueGetter: (row) => dateFormatter(row.tradeDate, 'datetime'),
			},
			/* حجم کل */
			{
				colId: 'tradedQuantity',
				headerName: t('trades_reports_page.overall_volume_column'),
				valueGetter: (row) => sepNumbers(String(row.tradedQuantity)),
			},
			/* قیمت */
			{
				colId: 'tradePrice',
				headerName: t('trades_reports_page.price_column'),
				valueGetter: (row) => sepNumbers(String(row.tradePrice)),
			},
			/* کارمزد */
			{
				colId: 'totalQuota',
				headerName: t('trades_reports_page.commission_column'),
				valueGetter: (row) => sepNumbers(String(row.totalQuota)),
			},
			/* ارزش معامله */
			{
				colId: 'total',
				headerName: t('trades_reports_page.value_column'),
				valueGetter: (row) => sepNumbers(String(row.total)),
			},
		],
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

export default TradeReportsTable;
