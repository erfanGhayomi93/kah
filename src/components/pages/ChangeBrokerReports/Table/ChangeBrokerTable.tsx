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
				headerName: t('change_broker_reports_page.id_column'),
				// field: 'id',
				// pinned: 'right',
				// maxWidth: 112,
				// minWidth: 112,
				valueFormatter: (row) => row.id,
			},
			{
				headerName: t('change_broker_reports_page.date_column'),
				// field: 'saveDate',
				// maxWidth: 96,
				valueFormatter: (row) => dateFormatter(row.saveDate ?? ''),
			},
			{
				headerName: t('change_broker_reports_page.symbol_column'),
				// field: 'symbolTitle',
				// minWidth: 150,
				// maxWidth: 250,
				cellClass: 'ltr text-right',
				valueFormatter: (row) => row.symbolTitle,
			},
			{
				headerName: t('change_broker_reports_page.gateway_column'),
				// field: 'id',
				valueFormatter: () => t('states.state_Online'),
			},
			{
				headerName: t('change_broker_reports_page.status_column'),
				// field: 'lastState',
				valueFormatter: (row) => t('states.state_' + row.lastState),
			},
			{
				headerName: t('change_broker_reports_page.action_column'),
				// field: 'action',
				// maxWidth: 112,
				// minWidth: 112,
				cellClass: 'flex-justify-center',
				valueFormatter: (row) => <ChangeBrokerReportsTableActionCell data={row} onDeleteRow={onDeleteRow} />,
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
