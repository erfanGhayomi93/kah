import brokerAxios from '@/api/brokerAxios';
import AgTable from '@/components/common/Tables/AgTable';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { type RootState } from '@/features/store';
import dayjs from '@/libs/dayjs';
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

const WithdrawalCashReportsTable = ({
	reports,
	columnsVisibility,
}: WithdrawalCashReportsTableProps) => {
	const gridRef = useRef<GridApi<Reports.IWithdrawal>>(null);

	const t = useTranslations();

	const queryClient = useQueryClient();

	const { urls } = useAppSelector(getStates);

	const dateFormatter = (v: string | number) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD');
	};

	const onDeleteRow = (data: Reports.IWithdrawal | undefined) => new Promise<void>(async (resolve, reject) => {
		if (!urls || !data) return;

		try {
			const response = await brokerAxios.post<ServerResponse<boolean>>(urls.paymentDeleteRequest, {
				ids: [data?.id]
			});

			if (response.status !== 200 || !response.data.succeeded) throw new Error(response.data.errors?.[0] ?? '');

			toast.success(t('alerts.withdrawal_cash_canceled_successfully'));


			queryClient.invalidateQueries({
				queryKey: ['withdrawalCashReports']
			});

			queryClient.invalidateQueries({
				queryKey: ['userRemainQuery']
			});

			resolve();
		} catch (e) {
			toast.error(t('alerts.withdrawal_cash_canceled_failed'));
			reject();
		}
	});

	const onEditRow = async () => {
		//
	};

	const COLUMNS = useMemo<Array<ColDef<Reports.IWithdrawal>>>(
		() =>
			[
				{
					/* ردیف */
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
				/* زمان درخواست */
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
				/* موعد پرداخت */
				{
					headerName: t('withdrawal_cash_reports_page.time_column'),
					field: 'requestDate',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dayjs(value).calendar('jalali').format('HH:mm:ss'),
				},
				/* بانک */
				{
					headerName: t('withdrawal_cash_reports_page.bank_column'),
					field: 'customerBank',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => value,
				},
				/* مبلغ */
				{
					headerName: t('withdrawal_cash_reports_page.amount_column'),
					field: 'requestAmount',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
				},
				/* سامانه */
				{
					headerName: t('withdrawal_cash_reports_page.gateway_column'),
					field: 'channel',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => t('states.state_' + value),
				},
				/* وضعیت */
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
				/* عملیات */
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
