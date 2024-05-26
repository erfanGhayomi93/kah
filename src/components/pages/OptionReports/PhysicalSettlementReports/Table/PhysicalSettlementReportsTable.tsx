import AgTable from '@/components/common/Tables/AgTable';
import WithdrawalCashReportsActionCell from '@/components/pages/FinancialReports/WithdrawalCashReports/Table/WithdrawalCashReportsActionCell';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';

interface PhysicalSettlementReportsTableProps {
	reports: Reports.IPhysicalSettlementReports[] | null;
	columnsVisibility: PhysicalSettlementReports.IPhysicalSettlementReportsColumnsState[];
}

const PhysicalSettlementReportsTable = ({ reports, columnsVisibility }: PhysicalSettlementReportsTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Reports.IPhysicalSettlementReports>>(null);

	const onDeleteRow = async () => {
		//
	};

	const COLUMNS = useMemo<Array<ColDef<Reports.IPhysicalSettlementReports>>>(
		() =>
			[
				/* نماد */
				{
					headerName: t('physical_settlement_reports_page.symbol_column'),
					field: 'symbolTitle',
					pinned: 'right',
					minWidth: 112,
					maxWidth: 112,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => value ?? '',
				},
				/* موقعیت */
				{
					headerName: t('physical_settlement_reports_page.side_column'),
					field: 'side',
					minWidth: 96,
					maxWidth: 96,
					flex: 1,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => t('common.' + String(value).toLowerCase()),
					cellClass: ({ data }) => {
						if (!data) return '';
						return data?.side === 'Buy' ? 'text-success-200' : 'text-error-200';
					},
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				},
				/* تعداد موقعیت باز */
				{
					headerName: t('physical_settlement_reports_page.open_position_count_column'),
					field: 'openPositionCount',
					cellClass: 'ltr',
					minWidth: 144,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => (value >= 0 ? sepNumbers(String(value)) : ''),
				},
				/* تاریخ تسویه فیزیکی */
				{
					headerName: t('physical_settlement_reports_page.cash_date_column'),
					field: 'cashSettlementDate',
					maxWidth: 144,
					minWidth: 144,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					// cellRenderer: OptionCashSettlementRemainingDate,
				},
				/* وضعیت قرارداد (سود یا زیان)  */
				{
					headerName: t('physical_settlement_reports_page.status_contract_column'),
					field: 'pandLStatus',
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					flex: 1,
					minWidth: 192,
					cellClassRules: {
						'text-success-200 dark:text-dark-success-200 ': ({ value }) => value === 'Profit',
						'text-error-200 dark:text-dark-error-200 ': ({ value }) => value === 'Loss',
					},
					valueFormatter: ({ value }) =>
						value ? t('physical_settlement_reports_page.type_contract_status_' + value) : '',
				},
				/* نوع اعمال */
				{
					headerName: t('physical_settlement_reports_page.request_type_column'),
					field: 'settlementRequestType',
					minWidth: 128,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) =>
						value ? t('physical_settlement_reports_page.type_request_settlement_' + value) : '',
				},
				/* مبلغ تسویه */
				{
					headerName: t('physical_settlement_reports_page.settlement_price_column'),
					field: 'incomeValue',
					minWidth: 128,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					// cellRenderer: CellTooltipRenderer,
					valueFormatter: ({ value }) =>
						value >= 0 ? (value > 1e7 ? numFormatter(value, false) : sepNumbers(String(value))) : '',
				},
				/* تعداد درخواست برای تسویه */
				{
					headerName: t('physical_settlement_reports_page.request_for_settlement_column'),
					field: 'requestCount',
					cellClass: 'ltr',
					minWidth: 192,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => (value >= 0 ? sepNumbers(String(value)) : ''),
				},
				/* تعداد پذیرفته شده */
				{
					headerName: t('physical_settlement_reports_page.done_count_column'),
					field: 'doneCount',
					cellClass: 'ltr',
					minWidth: 192,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => (value >= 0 ? sepNumbers(String(value)) : ''),
				},
				/* تعداد نکول */
				{
					headerName: t('physical_settlement_reports_page.pen_count_column'),
					field: 'penValue',
					cellClass: 'ltr',
					minWidth: 192,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => (value >= 0 ? sepNumbers(String(value)) : ''),
				},
				/* مبلغ نکول */
				{
					headerName: t('physical_settlement_reports_page.pen_volume_column'),
					field: 'penVolume',
					cellClass: 'ltr',
					minWidth: 192,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => (value >= 0 ? sepNumbers(String(value)) : ''),
				},
				/* درخواست کننده */
				{
					headerName: t('physical_settlement_reports_page.user_type_column'),
					field: 'userType',
					minWidth: 128,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ data }) => {
						if (data?.userType === 'System') return t('common.system');

						if (data?.userType === 'Backoffice') return t('common.broker');

						return data?.userName ?? '';
					},
				},
				/* وضعیت */
				{
					headerName: t('physical_settlement_reports_page.status_column'),
					field: 'status',
					cellClass: 'text-right',
					minWidth: 128,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) =>
						value ? t('physical_settlement_reports_page.type_status_' + value) : '',
				},
				/* عملیات */
				{
					headerName: t('physical_settlement_reports_page.action_column'),
					field: 'action',
					maxWidth: 200,
					minWidth: 200,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellRenderer: WithdrawalCashReportsActionCell,
					cellRendererParams: {
						onDeleteRow,
					},
				},
			] as Array<ColDef<Reports.IPhysicalSettlementReports>>,
		[],
	);

	const defaultColDef: ColDef<Reports.IPhysicalSettlementReports> = useMemo(
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
			<AgTable<Reports.IPhysicalSettlementReports>
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

export default PhysicalSettlementReportsTable;
