import AgTable from '@/components/common/Tables/AgTable';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef } from 'react';

interface WithdrawalCashReportsTableProps {
	reports: Reports.IWithdrawal[] | null;
	columnsVisibility: TWithdrawalCashReportsColumnsState[];
	setColumnsVisibility: Dispatch<SetStateAction<TWithdrawalCashReportsColumnsState[]>>;
}

const WithdrawalCashReportsTable = ({
	reports,
	columnsVisibility,
	setColumnsVisibility,
}: WithdrawalCashReportsTableProps) => {
	const gridRef = useRef<GridApi<Reports.IWithdrawal>>(null);

	const t = useTranslations();

	const dateFormatter = (v: string | number) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD');
	};

	const COLUMNS = useMemo<Array<ColDef<Reports.IWithdrawal>>>(
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
					maxWidth: 144,
					minWidth: 144,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value ?? ''),
				},
				{
					headerName: t('instant_deposit_reports_page.time_column'),
					field: 'requestDate',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dayjs(value).calendar('jalali').format('HH:mm:ss'),
				},
				{
					headerName: t('instant_deposit_reports_page.getway_column'),
					field: 'customerBank',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => t('bank_accounts.' + value),
				},
				{
					headerName: t('instant_deposit_reports_page.reservation_number_column'),
					field: 'requestAmount',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
				},
				{
					headerName: t('instant_deposit_reports_page.price_column'),
					field: 'state',
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
					maxWidth: 112,
					minWidth: 112,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => t('states.state_' + value),
				},
			] as Array<ColDef<Reports.IWithdrawal>>,
		[],
	);

	const defaultColDef: ColDef<Reports.IWithdrawal> = useMemo(
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
			<AgTable<Reports.IWithdrawal>
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

export default WithdrawalCashReportsTable;
