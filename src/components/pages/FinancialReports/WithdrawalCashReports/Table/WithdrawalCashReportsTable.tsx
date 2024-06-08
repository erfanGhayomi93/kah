import brokerAxios from '@/api/brokerAxios';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setWithdrawalModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { useBrokerQueryClient } from '@/hooks';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { type GridApi } from '@ag-grid-community/core';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import WithdrawalCashReportsActionCell from './WithdrawalCashReportsActionCell';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		urls: getBrokerURLs(state),
	}),
);

interface WithdrawalCashReportsTableProps {
	reports: Reports.IWithdrawal[] | null;
	columnsVisibility: WithdrawalCashReports.TWithdrawalCashReportsColumnsState[];
}

const WithdrawalCashReportsTable = ({ reports, columnsVisibility }: WithdrawalCashReportsTableProps) => {
	const gridRef = useRef<GridApi<Reports.IWithdrawal>>(null);

	const t = useTranslations();

	const queryClient = useBrokerQueryClient();

	const dispatch = useAppDispatch();

	const { urls } = useAppSelector(getStates);

	const onDeleteRow = (data: Reports.IWithdrawal | undefined) =>
		new Promise<void>(async (resolve, reject) => {
			if (!urls || !data) return;

			try {
				const response = await brokerAxios.post<ServerResponse<boolean>>(urls.paymentDeleteRequest, {
					ids: [data?.id],
				});

				if (response.status !== 200 || !response.data.succeeded)
					throw new Error(response.data.errors?.[0] ?? '');

				toast.success(t('alerts.withdrawal_cash_canceled_successfully'));

				queryClient.invalidateQueries({
					queryKey: ['withdrawalCashReports'],
				});

				queryClient.invalidateQueries({
					queryKey: ['userRemainQuery'],
				});

				resolve();
			} catch (e) {
				toast.error(t('alerts.withdrawal_cash_canceled_failed'));
				reject();
			}
		});

	const onEditRow = async (data: Reports.IWithdrawal | undefined) => {
		if (!data) return;

		try {
			dispatch(setWithdrawalModal({ data }));
		} catch (e) {
			//
		}
	};

	const COLUMNS = useMemo<Array<IColDef<Reports.IWithdrawal>>>(
		() => [
			/* ردیف */
			{
				colId: 'id',
				headerName: t('withdrawal_cash_reports_page.id_column'),
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'id')]?.hidden,
			},
			/* زمان درخواست */
			{
				colId: 'saveDate',
				headerName: t('withdrawal_cash_reports_page.date_column'),
				cellClass: 'ltr',
				valueGetter: (row) => dateFormatter(row.saveDate ?? '', 'datetime'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'saveDate')]?.hidden,
			},
			/* موعد پرداخت */
			{
				colId: 'requestDate',
				headerName: t('withdrawal_cash_reports_page.time_column'),
				valueGetter: (row) => dateFormatter(row.requestDate ?? '', 'date'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'requestDate')]?.hidden,
			},
			/* بانک */
			{
				colId: 'customerBank',
				headerName: t('withdrawal_cash_reports_page.bank_column'),
				valueGetter: (row) => row.customerBank,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'customerBank')]
					?.hidden,
			},
			/* مبلغ */
			{
				colId: 'requestAmount',
				headerName: t('withdrawal_cash_reports_page.amount_column'),
				valueGetter: (row) => sepNumbers(String(row.requestAmount)),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'requestAmount')]
					?.hidden,
			},
			/* سامانه */
			{
				colId: 'channel',
				headerName: t('withdrawal_cash_reports_page.gateway_column'),
				valueGetter: (row) => t('states.state_' + row.channel),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'channel')]?.hidden,
			},
			/* وضعیت */
			{
				colId: 'state',
				headerName: t('withdrawal_cash_reports_page.state_column'),
				valueGetter: (row) => t('states.state_' + row.state),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'state')]?.hidden,
			},
			/* عملیات */
			{
				colId: 'action',
				headerName: t('withdrawal_cash_reports_page.action_column'),
				valueGetter: (row) => row.id,
				valueFormatter: ({ row }) => (
					<WithdrawalCashReportsActionCell data={row} onDeleteRow={onDeleteRow} onEditRow={onEditRow} />
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

	return (
		<>
			<LightweightTable rowData={reports ?? []} columnDefs={COLUMNS} />
		</>
	);
};

export default WithdrawalCashReportsTable;
