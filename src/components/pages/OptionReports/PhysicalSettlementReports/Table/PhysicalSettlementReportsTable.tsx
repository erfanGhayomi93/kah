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
import PhysicalSettlementReportsTableActionCell from './PhysicalSettlementReportsTableActionCell';

interface PhysicalSettlementReportsTableProps {
	reports: Reports.IPhysicalSettlementReports[] | null;
	columnsVisibility: PhysicalSettlementReports.IPhysicalSettlementReportsColumnsState[];
}

const PhysicalSettlementReportsTable = ({ reports, columnsVisibility }: PhysicalSettlementReportsTableProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const queryClient = useBrokerQueryClient();

	const urls = useAppSelector(getBrokerURLs);

	const onDeleteRow = (data: Reports.ICashSettlementReports | undefined) =>
		new Promise<void>(async (resolve, reject) => {
			if (!urls || !data) return null;

			try {
				const response = await brokerAxios.post<ServerResponse<boolean>>(urls.settlementdeleteCash, {
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
		if (!data?.enabled || data?.status !== 'Draft') return;

		dispatch(setOptionSettlementModal({ data, activeTab: 'optionSettlementPhysicalTab' }));
	};

	const COLUMNS = useMemo<Array<IColDef<Reports.IPhysicalSettlementReports>>>(
		() => [
			/* نماد */
			{
				colId: 'symbolTitle',
				headerName: t('physical_settlement_reports_page.symbol_column'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'symbolTitle')]?.hidden,
				valueGetter: (row) => row.symbolTitle,
			},
			/* سمت */
			{
				colId: 'side',
				headerName: t('physical_settlement_reports_page.side_column'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'side')]?.hidden,
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
				headerName: t('physical_settlement_reports_page.open_position_count_column'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'openPositionCount')]
					?.hidden,
				valueGetter: (row) => (row.openPositionCount >= 0 ? sepNumbers(String(row.openPositionCount)) : ''),
			},
			/* تاریخ تسویه فیزیکی */
			{
				colId: 'cashSettlementDate',
				headerName: t('physical_settlement_reports_page.physical_date_column'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'cashSettlementDate')]
					?.hidden,
				valueGetter: (row) => (row.cashSettlementDate ? dateFormatter(row.cashSettlementDate, 'date') : '-'),
			},
			/* وضعیت قرارداد (سود یا زیان)  */
			{
				colId: 'pandLStatus',
				headerName: t('physical_settlement_reports_page.status_contract_column'),
				cellClass: (row) =>
					clsx({
						'dark:text-dark-success-200 text-success-200 ': row.pandLStatus === 'Profit',
						'dark:text-dark-error-200 text-error-200 ': row.pandLStatus === 'Loss',
					}),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'pandLStatus')]?.hidden,
				valueGetter: (row) =>
					row.pandLStatus
						? t('physical_settlement_reports_page.type_contract_status_' + row.pandLStatus)
						: '',
			},
			/* نوع اعمال */
			{
				colId: 'settlementRequestType',
				headerName: t('physical_settlement_reports_page.request_type_column'),
				hidden: columnsVisibility[
					columnsVisibility.findIndex((column) => column.id === 'settlementRequestType')
				]?.hidden,
				valueGetter: (row) =>
					row.settlementRequestType
						? t('physical_settlement_reports_page.type_request_settlement_' + row.settlementRequestType)
						: '-',
			},
			/* مبلغ تسویه */
			{
				colId: 'incomeValue',
				headerName: t('physical_settlement_reports_page.settlement_price_column'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'incomeValue')]?.hidden,
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
				headerName: t('physical_settlement_reports_page.request_for_settlement_column'),
				cellClass: 'ltr',
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'requestCount')]
					?.hidden,
				valueGetter: (row) => (row.requestCount >= 0 ? sepNumbers(String(row.requestCount)) : ''),
			},
			/* تعداد پذیرفته شده */
			{
				colId: 'doneCount',
				headerName: t('physical_settlement_reports_page.done_count_column'),
				cellClass: 'ltr',
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'doneCount')]?.hidden,
				valueGetter: (row) => (row.doneCount >= 0 ? sepNumbers(String(row.doneCount)) : ''),
			},
			/* تعداد نکول */
			{
				colId: 'penValue',
				headerName: t('physical_settlement_reports_page.pen_count_column'),
				cellClass: 'ltr',
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'penValue')]?.hidden,
				valueGetter: (row) => (row.peValue >= 0 ? sepNumbers(String(row.penValue)) : ''),
			},
			/* مبلغ نکول */
			{
				colId: 'penVolume',
				headerName: t('physical_settlement_reports_page.pen_volume_column'),
				cellClass: 'ltr',
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'penVolume')]?.hidden,
				valueGetter: (row) => (row.penVolume >= 0 ? sepNumbers(String(row.penVolume)) : ''),
			},
			/* درخواست کننده */
			{
				colId: 'userType',
				headerName: t('physical_settlement_reports_page.user_type_column'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'userType')]?.hidden,
				valueGetter: (row) => {
					if (row?.userType === 'System') return t('common.system');

					if (row?.userType === 'Backoffice') return t('common.broker');

					return row?.userName ?? '-';
				},
			},
			/* وضعیت */
			{
				colId: 'status',
				headerName: t('physical_settlement_reports_page.status_column'),
				cellClass: 'text-right',
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'status')]?.hidden,
				valueGetter: (row) =>
					row.status ? t('physical_settlement_reports_page.type_status_' + row.status) : '',
			},
			/* عملیات */
			{
				colId: 'action',
				headerName: t('physical_settlement_reports_page.action_column'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'action')]?.hidden,
				valueGetter: (row) => row.symbolISIN,
				valueFormatter: ({ row }) => (
					<PhysicalSettlementReportsTableActionCell
						data={row}
						onDeleteRow={onDeleteRow}
						onRequest={onRequest}
					/>
				),
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

export default PhysicalSettlementReportsTable;
