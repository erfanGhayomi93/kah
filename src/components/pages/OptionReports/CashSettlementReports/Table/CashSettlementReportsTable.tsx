import brokerAxios from '@/api/brokerAxios';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setOptionSettlementModal } from '@/features/slices/modalSlice';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import CashSettlementReportsTableActionCell from './CashSettlementReportsTableActionCell';

interface CashSettlementReportsTableProps {
	reports: Reports.ICashSettlementReports[] | null;
	columnsVisibility: CashSettlementReports.ICashSettlementReportsColumnsState[];
}

const CashSettlementReportsTable = ({ reports, columnsVisibility }: CashSettlementReportsTableProps) => {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Reports.ICashSettlementReports>>(null);

	const url = useAppSelector(getBrokerURLs);

	const onDeleteRow = (data: Reports.ICashSettlementReports | undefined) =>
		new Promise<void>(async (resolve, reject) => {
			if (!url || !data) return null;

			try {
				const response = await brokerAxios.post<ServerResponse<boolean>>(url.settlementdeleteCash, {
					symbolISIN: data?.symbolISIN,
				});

				if (response.status !== 200 || !response.data) {
					toast.error('خطای ناشناخته رخ داده است.');
					throw new Error('Error');
				}

				toast.success(t('alerts.option_delete_request_settlement_cash_success'));

				queryClient.invalidateQueries({ queryKey: ['cashSettlementReports'] });

				resolve();
			} catch (error) {
				toast.error(t('alerts.option_delete_request_settlement_cash_failed'));

				reject();
			}
		});

	const onRequest = async (data: Reports.ICashSettlementReports | undefined) => {
		if (!data || !data?.enabled || data?.status !== 'Draft') return;

		dispatch(setOptionSettlementModal({ data, activeTab: 'optionSettlementCashTab' }));
	};

	const onHistory = async (data: Reports.ICashSettlementReports | undefined) => {
		//
	};

	const COLUMNS = useMemo<Array<IColDef<Reports.ICashSettlementReports>>>(
		() => [
			/* نماد */
			{
				headerName: t('cash_settlement_reports_page.symbol_column'),
				// field: 'symbolTitle',
				// pinned: 'right',
				// minWidth: 112,
				// maxWidth: 112,
				valueFormatter: (row) => row.symbolTitle ?? '',
			},
			/* تعداد موقعیت باز */
			{
				headerName: t('cash_settlement_reports_page.open_position_count_column'),
				// field: 'openPositionCount',
				// minWidth: 144,
				cellClass: 'ltr',
				valueFormatter: (row) => (row.openPositionCount >= 0 ? sepNumbers(String(row.openPositionCount)) : ''),
			},
			/* تاریخ تسویه نقدی */
			{
				headerName: t('cash_settlement_reports_page.cash_date_column'),
				// field: 'cashSettlementDate',
				// maxWidth: 144,
				// minWidth: 144,
				valueFormatter: (row) => (row.cashSettlementDate ? dateFormatter(row.cashSettlementDate, 'date') : '-'),
			},
			/* وضعیت قرارداد (سود یا زیان)  */
			{
				headerName: t('cash_settlement_reports_page.status_contract_column'),
				// field: 'pandLStatus',
				// flex: 1,
				// minWidth: 192,
				cellClass: (row) =>
					clsx({
						'dark:text-dark-success-200 text-success-200 ': row.pandLStatus === 'Profit',
						'dark:text-dark-error-200 text-error-200 ': row.pandLStatus === 'Loss',
					}),
				valueFormatter: (row) =>
					row.pandLStatus ? t('cash_settlement_reports_page.type_contract_status_' + row.pandLStatus) : '',
			},
			/* نوع اعمال */
			{
				headerName: t('cash_settlement_reports_page.request_type_column'),
				// field: 'settlementRequestType',
				// minWidth: 128,
				// lockPosition: true,
				// initialHide: false,
				// suppressMovable: true,
				// sortable: false,
				valueFormatter: (row) =>
					row.settlementRequestType
						? t('cash_settlement_reports_page.type_request_settlement_' + row.settlementRequestType)
						: '-',
			},
			/* مبلغ تسویه */
			{
				headerName: t('cash_settlement_reports_page.settlement_price_column'),
				// field: 'incomeValue',
				// minWidth: 128,
				valueFormatter: (row) =>
					row.incomeValue >= 0
						? row.incomeValue > 1e7
							? numFormatter(row.incomeValue, false)
							: sepNumbers(String(row.incomeValue))
						: '',
			},
			/* تعداد درخواست برای تسویه */
			{
				headerName: t('cash_settlement_reports_page.request_for_settlement_column'),
				// field: 'requestCount',
				// minWidth: 192,
				cellClass: 'ltr',
				valueFormatter: (row) => (row.requestCount >= 0 ? sepNumbers(String(row.requestCount)) : ''),
			},
			/* تعداد پذیرفته شده */
			{
				headerName: t('cash_settlement_reports_page.done_count_column'),
				// field: 'doneCount',
				// minWidth: 192,
				cellClass: 'ltr',
				valueFormatter: (value) => (value.doneCount >= 0 ? sepNumbers(String(value.doneCount)) : ''),
			},
			/* درخواست کننده */
			{
				headerName: t('cash_settlement_reports_page.user_type_column'),
				// field: 'userType',
				// minWidth: 128,
				valueFormatter: (row) => {
					if (row.userType === 'System') return t('common.system');

					if (row.userType === 'Backoffice') return t('common.broker');

					return row?.userName ?? '-';
				},
			},
			/* وضعیت */
			{
				headerName: t('cash_settlement_reports_page.status_column'),
				// field: 'status',
				// minWidth: 128,
				cellClass: 'text-right',
				valueFormatter: (row) =>
					row.status ? t('cash_settlement_reports_page.type_status_' + row.status) : '',
			},
			/* عملیات */
			{
				headerName: t('cash_settlement_reports_page.action_column'),
				// field: 'action',
				// maxWidth: 200,
				// minWidth: 200,
				cellClass: 'flex-justify-center',
				valueFormatter: (row) => (
					<CashSettlementReportsTableActionCell
						data={row}
						onDeleteRow={onDeleteRow}
						onHistory={onHistory}
						onRequest={onRequest}
					/>
				),
			},
		],
		[],
	);

	const defaultColDef: ColDef<Reports.ICashSettlementReports> = useMemo(
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

export default CashSettlementReportsTable;
