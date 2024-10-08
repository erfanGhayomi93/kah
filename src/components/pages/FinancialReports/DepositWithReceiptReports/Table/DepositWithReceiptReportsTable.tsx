import brokerAxios from '@/api/brokerAxios';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setDepositModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { useBrokerQueryClient } from '@/hooks';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { type GridApi } from '@ag-grid-community/core';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import DepositWithReceiptReportsActionCell from './DepositWithReceiptReportsActionCell';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		urls: getBrokerURLs(state),
	}),
);

interface DepositWithReceiptReportsTableProps {
	reports: Reports.IDepositWithReceipt[] | null;
	columnsVisibility: DepositWithReceiptReports.TDepositWithReceiptReportsColumnsState[];
}

const DepositWithReceiptReportsTable = ({ reports, columnsVisibility }: DepositWithReceiptReportsTableProps) => {
	const t = useTranslations();

	const queryClient = useBrokerQueryClient();

	const dispatch = useAppDispatch();

	const gridRef = useRef<GridApi<Reports.IDepositWithReceipt>>(null);

	const { urls } = useAppSelector(getStates);

	const onEditRow = (data: Reports.IDepositWithReceipt | undefined) => {
		if (!data) return;

		try {
			dispatch(setDepositModal({ data, activeTab: 'receiptDepositTab' }));
		} catch (e) {
			//
		}
	};

	const onDeleteRow = (data: Reports.IDepositWithReceipt | undefined) =>
		new Promise<void>(async (resolve, reject) => {
			if (!urls || !data) return;

			try {
				const response = await brokerAxios.post<ServerResponse<boolean>>(urls.AccountOfflineDepositCancel, {
					ids: [data?.id],
				});

				if (response.status !== 200 || !response.data.succeeded)
					throw new Error(response.data.errors?.[0] ?? '');

				toast.success(t('alerts.instant_deposit_canceled_successfully'));

				queryClient.invalidateQueries({
					queryKey: ['depositWithReceiptReports'],
				});

				queryClient.invalidateQueries({
					queryKey: ['userRemainQuery'],
				});

				resolve();
			} catch (e) {
				toast.error(t('alerts.instant_deposit_canceled_failed'));
				reject();
			}
		});

	const COLUMNS = useMemo<Array<IColDef<Reports.IDepositWithReceipt>>>(
		() => [
			/* ردیف */
			{
				colId: 'id',
				headerName: t('deposit_with_receipt_reports_page.id_column'),
				width: 32,
				valueGetter: (_r, rowIndex) => String((rowIndex ?? 0) + 1),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'id')]?.hidden,
			},

			/* زمان */
			{
				colId: 'receiptDate',
				headerName: t('deposit_with_receipt_reports_page.date_column'),
				cellClass: 'ltr',
				valueGetter: (row) => row.receiptDate,
				valueFormatter: ({ value }) => dateFormatter(value as string, 'datetime'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'receiptDate')]?.hidden,
			},

			/* بانک کارگزاری */
			{
				colId: 'providerType',
				headerName: t('deposit_with_receipt_reports_page.broker_bank_column'),
				valueGetter: (row) => row.providerType,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'providerType')]
					?.hidden,
			},

			/* شماره فیش */
			{
				colId: 'receiptNumber',
				headerName: t('deposit_with_receipt_reports_page.receipt_number_column'),
				valueGetter: (row) => row.receiptNumber,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'receiptNumber')]
					.hidden,
			},

			/* مبلغ */
			{
				colId: 'amount',
				headerName: t('deposit_with_receipt_reports_page.price_column'),
				valueGetter: (row) => row.amount,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'amount')]?.hidden,
			},

			/* وضعیت */
			{
				colId: 'state',
				headerName: t('deposit_with_receipt_reports_page.status_column'),
				width: 200,
				valueGetter: (row) => t(`states.state_${row.state}`),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'state')]?.hidden,
			},

			/* عملیات */
			{
				colId: 'action',
				headerName: t('deposit_with_receipt_reports_page.operation_column'),
				valueGetter: (row) => row.id,
				valueFormatter: ({ row }) => (
					<DepositWithReceiptReportsActionCell data={row} onDeleteRow={onDeleteRow} onEditRow={onEditRow} />
				),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'action')]?.hidden,
			},
		],
		[columnsVisibility],
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

	return <LightweightTable rowData={reports ?? []} columnDefs={COLUMNS} />;
};

export default DepositWithReceiptReportsTable;
