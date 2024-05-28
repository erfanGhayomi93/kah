import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';

interface InstantDepositReportsTableProps {
	reports: Reports.IInstantDeposit[] | null;
	columnsVisibility: InstantDepositReports.TInstantDepositReportsColumnsState[];
}

const InstantDepositReportsTable = ({ reports, columnsVisibility }: InstantDepositReportsTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Reports.IInstantDeposit>>(null);

	const dateFormatter = (v: string | number, format: string) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format(format);
	};

	const COLUMNS = useMemo<Array<IColDef<Reports.IInstantDeposit>>>(
		() => [
			/* ردیف */
			{
				colId: 'id',
				headerName: t('instant_deposit_reports_page.id_column'),
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
			},
			/* تاریخ */
			{
				colId: 'saveDate',
				headerName: t('instant_deposit_reports_page.date_column'),
				cellClass: 'ltr',
				valueGetter: (row) => dateFormatter(row.saveDate ?? '', 'YYYY/MM/DD HH:mm'),
			},
			/* درگاه */
			{
				colId: 'providerType',
				headerName: t('instant_deposit_reports_page.getway_column'),
				valueGetter: (row) => t('bank_accounts.' + row.providerType),
			},
			/* شماره پیگیری */
			{
				colId: 'reservationNumber',
				headerName: t('instant_deposit_reports_page.reservation_number_column'),
				valueGetter: (row) => row.reservationNumber,
			},
			/* مبلغ */
			{
				colId: 'amount',
				headerName: t('instant_deposit_reports_page.price_column'),
				// width: 220,
				valueGetter: (row) => sepNumbers(String(row.amount)),
			},
			/* وضعیت */
			{
				colId: 'state',
				headerName: t('instant_deposit_reports_page.status_column'),
				valueGetter: (row) => t('states.state_' + row.state),
			},
		],
		[],
	);

	const defaultColDef: ColDef<Reports.IInstantDeposit> = useMemo(
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

export default InstantDepositReportsTable;
