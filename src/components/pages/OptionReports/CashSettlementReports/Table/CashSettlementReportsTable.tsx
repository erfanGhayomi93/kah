import brokerAxios from '@/api/brokerAxios';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setOptionSettlementModal } from '@/features/slices/modalSlice';
import { useBrokerQueryClient } from '@/hooks';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
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

	const url = useAppSelector(getBrokerURLs);

	const onDeleteRow = (data: Reports.ICashSettlementReports | undefined) =>
		new Promise<void>(async (resolve, reject) => {
			if (!url || !data) return null;

			try {
				const response = await brokerAxios.post<ServerResponse<boolean>>(
					url.OptionDeleteRequestCashSettlement,
					{
						symbolISIN: data?.symbolISIN,
					},
				);

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
			/* ردیف */
			{
				colId: 'id',
				headerName: t('cash_settlement_reports_page.id_column'),
				width: 32,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'id')]?.hidden,
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
			},
			/* نماد */
			{
				colId: 'symbolTitle',
				headerName: t('cash_settlement_reports_page.symbol_column'),
				valueGetter: (row) => row.symbolTitle ?? '',
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'symbolTitle')]?.hidden,
			},
			/* سمت */
			{
				colId: 'side',
				headerName: t('physical_settlement_reports_page.side_column'),
				valueGetter: (row) => t(`common.${row.side.toLowerCase()}`),
				cellClass: (row) =>
					clsx({
						'text-success-100': row.side === 'Buy',
						'text-error-100': row.side === 'Sell',
					}),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'side')]?.hidden,
			},
			/* تعداد موقعیت باز */
			{
				colId: 'openPositionCount',
				headerName: t('cash_settlement_reports_page.open_position_count_column'),
				cellClass: 'ltr',
				valueGetter: (row) => (row.openPositionCount >= 0 ? sepNumbers(String(row.openPositionCount)) : ''),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'openPositionCount')]
					?.hidden,
			},
			/* تاریخ تسویه نقدی */
			{
				colId: 'cashSettlementDate',
				headerName: t('cash_settlement_reports_page.cash_date_column'),
				valueGetter: (row) => (row.cashSettlementDate ? dateFormatter(row.cashSettlementDate, 'date') : '-'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'cashSettlementDate')]
					?.hidden,
			},
			/* وضعیت قرارداد */
			{
				colId: 'pandLStatus',
				headerName: t('cash_settlement_reports_page.status_contract_column'),
				cellClass: (row) =>
					clsx({
						'dark:text-dark-success-100 text-success-100 ': row.pandLStatus === 'Profit',
						'dark:text-dark-error-100 text-error-100 ': row.pandLStatus === 'Loss',
					}),
				valueGetter: (row) =>
					row.pandLStatus ? t('cash_settlement_reports_page.type_contract_status_' + row.pandLStatus) : '',
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'pandLStatus')]?.hidden,
			},
			/* نوع اعمال */
			{
				colId: 'settlementRequestType',
				headerName: t('cash_settlement_reports_page.request_type_column'),
				valueGetter: (row) =>
					row.settlementRequestType
						? t('cash_settlement_reports_page.type_request_settlement_' + row.settlementRequestType)
						: '-',
				hidden: columnsVisibility[
					columnsVisibility.findIndex((column) => column.id === 'settlementRequestType')
				]?.hidden,
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
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'incomeValue')]?.hidden,
			},
			/* تعداد درخواست برای تسویه */
			{
				colId: 'requestCount',
				headerName: t('cash_settlement_reports_page.request_for_settlement_column'),
				cellClass: 'ltr',
				width: 104,
				valueGetter: (row) => (row.requestCount >= 0 ? sepNumbers(String(row.requestCount)) : ''),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'requestCount')]
					?.hidden,
			},
			/* تعداد پذیرفته شده */
			{
				colId: 'doneCount',
				headerName: t('cash_settlement_reports_page.done_count_column'),
				cellClass: 'ltr',
				valueGetter: (value) => (value.doneCount >= 0 ? sepNumbers(String(value.doneCount)) : ''),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'doneCount')]?.hidden,
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
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'userType')]?.hidden,
			},
			/* وضعیت */
			{
				colId: 'status',
				headerName: t('cash_settlement_reports_page.status_column'),
				cellClass: 'text-right',
				valueGetter: (row) => (row.status ? t('cash_settlement_reports_page.type_status_' + row.status) : ''),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'status')]?.hidden,
			},
			/* عملیات */
			{
				colId: 'action',
				headerName: t('cash_settlement_reports_page.action_column'),
				valueGetter: (row) => row.id,
				valueFormatter: ({ row }) => (
					<CashSettlementReportsTableActionCell data={row} onDeleteRow={onDeleteRow} onRequest={onRequest} />
				),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'action')]?.hidden,
			},
		],
		[columnsVisibility],
	);

	return (
		<>
			<LightweightTable rowData={reports ?? []} columnDefs={COLUMNS} />
		</>
	);
};

export default CashSettlementReportsTable;
