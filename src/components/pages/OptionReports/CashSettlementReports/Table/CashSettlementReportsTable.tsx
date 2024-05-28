import brokerAxios from '@/api/brokerAxios';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setOptionSettlementModal } from '@/features/slices/modalSlice';
import { useBrokerQueryClient } from '@/hooks';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
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

	const queryClient = useBrokerQueryClient();

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

	const COLUMNS = useMemo<Array<IColDef<Reports.ICashSettlementReports>>>(
		() => [
			/* نماد */
			{
				colId: 'symbolTitle',
				headerName: t('cash_settlement_reports_page.symbol_column'),
				valueGetter: (row) => row.symbolTitle ?? '',
			},
			/* سمت */
			{
				colId: 'side',
				headerName: t('physical_settlement_reports_page.side_column'),
				valueGetter: (row) => t(`common.${row.side.toLowerCase()}`),
				cellClass: (row) =>
					clsx({
						'text-success-200': row.side === 'Buy',
						'text-error-200': row.side === 'Sell',
					}),
			},
			/* تعداد موقعیت باز */
			{
				colId: 'openPositionCount',
				headerName: t('cash_settlement_reports_page.open_position_count_column'),
				cellClass: 'ltr',
				valueGetter: (row) => (row.openPositionCount >= 0 ? sepNumbers(String(row.openPositionCount)) : ''),
			},
			/* تاریخ تسویه نقدی */
			{
				colId: 'cashSettlementDate',
				headerName: t('cash_settlement_reports_page.cash_date_column'),
				valueGetter: (row) => (row.cashSettlementDate ? dateFormatter(row.cashSettlementDate, 'date') : '-'),
			},
			/* وضعیت قرارداد (سود یا زیان)  */
			{
				colId: 'pandLStatus',
				headerName: t('cash_settlement_reports_page.status_contract_column'),
				cellClass: (row) =>
					clsx({
						'dark:text-dark-success-200 text-success-200 ': row.pandLStatus === 'Profit',
						'dark:text-dark-error-200 text-error-200 ': row.pandLStatus === 'Loss',
					}),
				valueGetter: (row) =>
					row.pandLStatus ? t('cash_settlement_reports_page.type_contract_status_' + row.pandLStatus) : '',
			},
			/* نوع اعمال */
			{
				colId: 'settlementRequestType',
				headerName: t('cash_settlement_reports_page.request_type_column'),
				valueGetter: (row) =>
					row.settlementRequestType
						? t('cash_settlement_reports_page.type_request_settlement_' + row.settlementRequestType)
						: '-',
			},
			/* مبلغ تسویه */
			{
				colId: 'incomeValue',
				headerName: t('cash_settlement_reports_page.settlement_price_column'),
				valueGetter: (row) =>
					row.incomeValue >= 0
						? row.incomeValue > 1e7
							? numFormatter(row.incomeValue, false)
							: sepNumbers(String(row.incomeValue))
						: '',
			},
			/* تعداد درخواست برای تسویه */
			{
				colId: 'requestCount',
				headerName: t('cash_settlement_reports_page.request_for_settlement_column'),
				cellClass: 'ltr',
				valueGetter: (row) => (row.requestCount >= 0 ? sepNumbers(String(row.requestCount)) : ''),
			},
			/* تعداد پذیرفته شده */
			{
				colId: 'doneCount',
				headerName: t('cash_settlement_reports_page.done_count_column'),
				cellClass: 'ltr',
				valueGetter: (value) => (value.doneCount >= 0 ? sepNumbers(String(value.doneCount)) : ''),
			},
			/* درخواست کننده */
			{
				colId: 'userType',
				headerName: t('cash_settlement_reports_page.user_type_column'),
				valueGetter: (row) => {
					if (row.userType === 'System') return t('common.system');
					if (row.userType === 'Backoffice') return t('common.broker');
					return row?.userName ?? '-';
				},
			},
			/* وضعیت */
			{
				colId: 'status',
				headerName: t('cash_settlement_reports_page.status_column'),
				cellClass: 'text-right',
				valueGetter: (row) => (row.status ? t('cash_settlement_reports_page.type_status_' + row.status) : ''),
			},
			/* عملیات */
			{
				colId: 'action',
				headerName: t('cash_settlement_reports_page.action_column'),
				valueGetter: (row) => row.id,
				valueFormatter: ({ row }) => (
					<CashSettlementReportsTableActionCell data={row} onDeleteRow={onDeleteRow} onRequest={onRequest} />
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
