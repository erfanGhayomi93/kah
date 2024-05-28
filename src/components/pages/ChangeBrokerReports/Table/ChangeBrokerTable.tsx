import axios from '@/api/brokerAxios';
import { store } from '@/api/inject-store';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import dayjs from '@/libs/dayjs';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import ChangeBrokerReportsTableActionCell from './ChangeBrokerReportsActionCell';

interface ChangeBrokerTableProps {
	reports: Reports.IChangeBrokerReports[] | null;
	columnsVisibility: ChangeBrokerReports.IChangeBrokerReportsColumnsState[];
}

const ChangeBrokerTable = ({ reports, columnsVisibility }: ChangeBrokerTableProps) => {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const gridRef = useRef<GridApi<Reports.IChangeBrokerReports>>(null);

	const dateFormatter = (v: string | number) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD');
	};

	const onDeleteRow = (data: Reports.IChangeBrokerReports | undefined) =>
		new Promise<void>(async (resolve, reject) => {
			const url = getBrokerURLs(store.getState());
			if (!url || !data) return null;

			try {
				const response = await axios.post<ServerResponse<boolean>>(
					`${url.changeBrokerSetCancel}?RequestID=${data?.id}`,
				);

				if (response.status !== 200 || !response.data.succeeded)
					throw new Error(response.data.errors?.[0] ?? '');

				toast.success(t('alerts.change_broker_request_delete_successfully'), {
					toastId: 'change_broker_delete_successfully',
				});

				queryClient.invalidateQueries({ queryKey: ['changeBrokerReports'] });

				resolve();
			} catch (e) {
				reject();
			}
		});

	const COLUMNS = useMemo<Array<IColDef<Reports.IChangeBrokerReports>>>(
		() => [
			{
				colId: 'id',
				headerName: t('change_broker_reports_page.id_column'),
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
			},
			{
				colId: 'saveDate',
				headerName: t('change_broker_reports_page.date_column'),
				valueGetter: (row) => dateFormatter(row.saveDate ?? ''),
			},
			{
				colId: 'symbolTitle',
				headerName: t('change_broker_reports_page.symbol_column'),
				cellClass: 'ltr text-right',
				valueGetter: (row) => row.symbolTitle,
			},
			{
				colId: 'online',
				headerName: t('change_broker_reports_page.gateway_column'),
				valueGetter: () => t('states.state_Online'),
			},
			{
				colId: 'lastState',
				headerName: t('change_broker_reports_page.status_column'),
				valueGetter: (row) => t('states.state_' + row.lastState),
			},
			{
				colId: 'action',
				headerName: t('change_broker_reports_page.action_column'),
				cellClass: 'flex-justify-center',
				valueGetter: (row) => row.id,
				valueFormatter: ({ row }) => (
					<ChangeBrokerReportsTableActionCell data={row} onDeleteRow={onDeleteRow} />
				),
			},
		],
		[],
	);

	const defaultColDef: ColDef<Reports.IChangeBrokerReports> = useMemo(
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

export default ChangeBrokerTable;
