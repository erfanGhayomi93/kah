import AgTable from '@/components/common/Tables/AgTable';
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

	const COLUMNS = useMemo<Array<ColDef<Reports.IInstantDeposit>>>(
		() =>
			[
				{
					headerName: t('instant_deposit_reports_page.id_column'),
					field: 'id',
					maxWidth: 112,
					minWidth: 112,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueGetter: ({ node }) => String((node?.childIndex ?? 0) + 1),
				},
				{
					headerName: t('instant_deposit_reports_page.date_column'),
					field: 'saveDate',
					maxWidth: 220,
					minWidth: 220,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value ?? '', 'YYYY/MM/DD HH:mm'),
				},
				{
					headerName: t('instant_deposit_reports_page.getway_column'),
					field: 'providerType',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					maxWidth: 220,
					minWidth: 220,
					valueFormatter: ({ value }) => t('bank_accounts.' + value),
				},
				{
					headerName: t('instant_deposit_reports_page.reservation_number_column'),
					field: 'reservationNumber',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
				},
				{
					headerName: t('instant_deposit_reports_page.price_column'),
					field: 'amount',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					maxWidth: 220,
					minWidth: 220,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
				},
				{
					headerName: t('instant_deposit_reports_page.status_column'),
					field: 'state',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => t('states.state_' + value),
				},
			] as Array<ColDef<Reports.IInstantDeposit>>,
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
			<AgTable<Reports.IInstantDeposit>
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

export default InstantDepositReportsTable;
