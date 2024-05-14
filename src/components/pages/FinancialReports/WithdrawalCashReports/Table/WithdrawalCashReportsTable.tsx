import AgTable from '@/components/common/Tables/AgTable';
import dayjs from '@/libs/dayjs';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef } from 'react';
import WithdrawalCashReportsActionCell from './WithdrawalCashReportsActionCell';

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

	const onDeleteRow = async () => {
		//
	};

	const onEditRow = async () => {
		//
	};

	const COLUMNS = useMemo<Array<ColDef<Reports.IWithdrawal>>>(
		() =>
			[
				{
					headerName: t('withdrawal_cash_reports_page.id_column'),
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
					headerName: t('withdrawal_cash_reports_page.date_column'),
					field: 'saveDate',
					maxWidth: 144,
					minWidth: 144,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value ?? ''),
				},
				{
					headerName: t('withdrawal_cash_reports_page.time_column'),
					field: 'requestDate',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dayjs(value).calendar('jalali').format('HH:mm:ss'),
				},
				{
					headerName: t('withdrawal_cash_reports_page.bank_column'),
					field: 'customerBank',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => t('bank_accounts.' + value),
				},
				{
					headerName: t('withdrawal_cash_reports_page.amount_column'),
					field: 'requestAmount',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
				},
				{
					headerName: t('withdrawal_cash_reports_page.gateway_column'),
					field: 'channel',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => t('states.state_' + value),
				},
				{
					headerName: t('withdrawal_cash_reports_page.state_column'),
					field: 'state',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					maxWidth: 220,
					minWidth: 220,
					valueFormatter: ({ value }) => t('states.state_' + value),
				},
				{
					headerName: t('withdrawal_cash_reports_page.action_column'),
					field: 'action',
					maxWidth: 112,
					minWidth: 112,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellRenderer: WithdrawalCashReportsActionCell,
					cellRendererParams: {
						onDeleteRow,
						onEditRow
					}
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
