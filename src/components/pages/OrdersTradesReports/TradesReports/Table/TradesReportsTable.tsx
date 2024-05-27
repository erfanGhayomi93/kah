import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
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

	const dateFormatter = (v: string | number, format: string) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format(format);
	};

	const COLUMNS = useMemo<Array<IColDef<Reports.ITradesReports>>>(
		() => [
			/* ردیف */
			{
				headerName: t('trades_reports_page.id_column'),
				// maxWidth: 112,
				// minWidth: 112,
				valueFormatter: (row) => 1,
			},
			/* نماد */
			{
				headerName: t('trades_reports_page.symbol_column'),
				// field: 'symbolTitle',
				cellClass: 'text-right',
				valueFormatter: (row) => row.symbolTitle,
			},
			/* سمت */
			{
				headerName: t('trades_reports_page.side_column'),
				// field: 'orderSide',
				cellClass: (row) => {
					if (!row) return;
					return clsx({
						'text-success-200': row.orderSide.includes('Buy'),
						'text-error-200': row.orderSide.includes('Sell'),
					});
				},
				valueFormatter: (row) => t('trades_reports_page.side_' + row.orderSide),
			},
			/* تاریخ */
			{
				headerName: t('trades_reports_page.date_column'),
				// field: 'tradeDate',
				// maxWidth: 144,
				// minWidth: 144,
				cellClass: 'ltr',
				valueFormatter: (row) => dateFormatter(row.tradeDate, 'YYYY/MM/DD HH:mm'),
			},
			/* حجم کل */
			{
				headerName: t('trades_reports_page.overall_volume_column'),
				// field: 'tradedQuantity',
				valueFormatter: (row) => sepNumbers(String(row.tradedQuantity)),
			},
			/* قیمت */
			{
				headerName: t('trades_reports_page.price_column'),
				field: 'tradePrice',
				valueFormatter: (row) => sepNumbers(String(row.tradePrice)),
			},
			/* کارمزد */
			{
				headerName: t('trades_reports_page.commission_column'),
				// field: 'totalQuota',
				valueFormatter: (row) => sepNumbers(String(row.totalQuota)),
			},
			/* ارزش معامله */
			{
				headerName: t('trades_reports_page.value_column'),
				// field: 'total',
				valueFormatter: (row) => sepNumbers(String(row.total)),
			},
			// /* اعتبار */
			// {
			// 	headerName: t('trades_reports_page.validity_column'),
			// 	field: 'validity',
			// 	lockPosition: true,
			// 	initialHide: false,
			// 	suppressMovable: true,
			// 	sortable: false,
			// 	valueFormatter: ({ data }) => {
			// 		if (!data) return '-';
			// 		const { validity, validityDate } = data;

			// 		if (validity === 'GoodTillDate') return dateFormatter(validityDate, 'YYYY/MM/DD');
			// 		return t('validity_date.' + validity);
			// 	}
			// }
		],
		[],
	);

	const defaultColDef: ColDef<Reports.ITradesReports> = useMemo(
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

export default TradeReportsTable;
