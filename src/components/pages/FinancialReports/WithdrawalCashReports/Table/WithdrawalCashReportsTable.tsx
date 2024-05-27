import brokerAxios from '@/api/brokerAxios';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setWithdrawalModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { createSelector } from '@reduxjs/toolkit';
import { useQueryClient } from '@tanstack/react-query';
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

	const queryClient = useQueryClient();

	const dispatch = useAppDispatch();

	const { urls } = useAppSelector(getStates);

	const dateFormatter = (v: string | number) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD');
	};

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
			{
				/* ردیف */
				headerName: t('withdrawal_cash_reports_page.id_column'),
				// field: 'id',
				// maxWidth: 112,
				// minWidth: 112,
				valueFormatter: (row) => 1,
			},
			/* زمان درخواست */
			{
				headerName: t('withdrawal_cash_reports_page.date_column'),
				// field: 'saveDate',
				// maxWidth: 144,
				// minWidth: 144,
				valueFormatter: (row) => dateFormatter(row.saveDate ?? ''),
			},
			/* موعد پرداخت */
			{
				headerName: t('withdrawal_cash_reports_page.time_column'),
				// field: 'requestDate',
				valueFormatter: (row) => dayjs(row.requestDate).calendar('jalali').format('HH:mm:ss'),
			},
			/* بانک */
			{
				headerName: t('withdrawal_cash_reports_page.bank_column'),
				// field: 'customerBank',
				valueFormatter: (row) => row.customerBank,
			},
			/* مبلغ */
			{
				headerName: t('withdrawal_cash_reports_page.amount_column'),
				// field: 'requestAmount',
				valueFormatter: (row) => sepNumbers(String(row.requestAmount)),
			},
			/* سامانه */
			{
				headerName: t('withdrawal_cash_reports_page.gateway_column'),
				// field: 'channel',
				valueFormatter: (row) => t('states.state_' + row.channel),
			},
			/* وضعیت */
			{
				headerName: t('withdrawal_cash_reports_page.state_column'),
				// field: 'state',
				// maxWidth: 220,
				// minWidth: 220,
				valueFormatter: (row) => t('states.state_' + row.state),
			},
			/* عملیات */
			{
				headerName: t('withdrawal_cash_reports_page.action_column'),
				// field: 'action',
				// maxWidth: 112,
				// minWidth: 112,
				cellClass: 'flex-justify-center',
				valueFormatter: (row) => (
					<WithdrawalCashReportsActionCell data={row} onDeleteRow={onDeleteRow} onEditRow={onEditRow} />
				),
			},
		],
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
