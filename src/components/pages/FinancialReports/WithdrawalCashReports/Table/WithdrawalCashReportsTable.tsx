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
			/* ردیف */
			{
				colId: 'id',
				headerName: t('withdrawal_cash_reports_page.id_column'),
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
			},
			/* زمان درخواست */
			{
				colId: 'saveDate',
				headerName: t('withdrawal_cash_reports_page.date_column'),
				valueGetter: (row) => dateFormatter(row.saveDate ?? ''),
			},
			/* موعد پرداخت */
			{
				colId: 'requestDate',
				headerName: t('withdrawal_cash_reports_page.time_column'),
				valueGetter: (row) => dayjs(row.requestDate).calendar('jalali').format('HH:mm:ss'),
			},
			/* بانک */
			{
				colId: 'customerBank',
				headerName: t('withdrawal_cash_reports_page.bank_column'),
				valueGetter: (row) => row.customerBank,
			},
			/* مبلغ */
			{
				colId: 'requestAmount',
				headerName: t('withdrawal_cash_reports_page.amount_column'),
				valueGetter: (row) => sepNumbers(String(row.requestAmount)),
			},
			/* سامانه */
			{
				colId: 'channel',
				headerName: t('withdrawal_cash_reports_page.gateway_column'),
				valueGetter: (row) => t('states.state_' + row.channel),
			},
			/* وضعیت */
			{
				colId: 'state',
				headerName: t('withdrawal_cash_reports_page.state_column'),
				valueGetter: (row) => t('states.state_' + row.state),
			},
			/* عملیات */
			{
				colId: 'action',
				headerName: t('withdrawal_cash_reports_page.action_column'),
				cellClass: 'flex-justify-center',
				valueGetter: (row) => row.id,
				valueFormatter: ({ row }) => (
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
