import AgTable from '@/components/common/Tables/AgTable';
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

const TradeReportsTable = ({
	reports,
	columnsVisibility,
	setColumnsVisibility,
}: TradeReportsTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Reports.ITradesReports>>(null);

	const dateFormatter = (v: string | number, format: string) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format(format);
	};

	const COLUMNS = useMemo<Array<ColDef<Reports.ITradesReports>>>(
		() =>
			[
				/* ردیف */
				{
					headerName: t('trades_reports_page.id_column'),
					field: 'orderId',
					maxWidth: 112,
					minWidth: 112,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueGetter: ({ node }) => String((node?.childIndex ?? 0) + 1)
				},
				/* نماد */
				{
					headerName: t('trades_reports_page.symbol_column'),
					field: 'symbolTitle',
					cellClass: 'text-right',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
				},
				/* سمت */
				{
					headerName: t('trades_reports_page.side_column'),
					field: 'orderSide',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellClass: ({ data }) => {
						if (!data) return;
						return clsx({
							'text-success-200': data.orderSide.includes('Buy'),
							'text-error-200': data.orderSide.includes('Sell')
						});
					},
					valueFormatter: ({ value }) => t('trades_reports_page.side_' + value),
				},
				/* تاریخ */
				{
					headerName: t('trades_reports_page.date_column'),
					field: 'tradeDate',
					maxWidth: 144,
					minWidth: 144,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value, 'YYYY/MM/DD')
				},
				/* ساعت */
				{
					headerName: t('trades_reports_page.time_column'),
					field: 'tradeDate',
					maxWidth: 144,
					minWidth: 144,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value, 'HH:mm')
				},
				/* حجم کل */
				{
					headerName: t('trades_reports_page.overall_volume_column'),
					field: 'tradedQuantity',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
				},
				/* قیمت */
				{
					headerName: t('trades_reports_page.price_column'),
					field: 'tradePrice',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
				},
				/* کارمزد */
				{
					headerName: t('trades_reports_page.commission_column'),
					field: 'totalQuota',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
				},
				/* ارزش معامله */
				{
					headerName: t('trades_reports_page.value_column'),
					field: 'total',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
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
			] as Array<ColDef<Reports.ITradesReports>>,
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
		if (!eGrid) return;

		try {
			eGrid.setGridOption('rowData', reports);
		} catch (e) {
			//
		}
	}, [reports]);

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
			<AgTable<Reports.ITradesReports>
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

export default TradeReportsTable;
