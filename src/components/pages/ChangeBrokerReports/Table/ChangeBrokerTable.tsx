import axios from '@/api/brokerAxios';
import { store } from '@/api/inject-store';
import AgTable from '@/components/common/Tables/AgTable';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import dayjs from '@/libs/dayjs';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import ChangeBrokerReportsActionCell from './ChangeBrokerReportsActionCell';

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

	const COLUMNS = useMemo<Array<ColDef<Reports.IChangeBrokerReports>>>(
		() =>
			[
				{
					headerName: t('change_broker_reports_page.id_column'),
					field: 'id',
					pinned: 'right',
					maxWidth: 112,
					minWidth: 112,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueGetter: ({ node }) => String((node?.childIndex ?? 0) + 1),
				},
				{
					headerName: t('change_broker_reports_page.date_column'),
					field: 'saveDate',
					maxWidth: 96,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value ?? ''),
				},
				{
					headerName: t('change_broker_reports_page.symbol_column'),
					field: 'symbolTitle',
					cellClass: 'ltr text-right',
					minWidth: 150,
					maxWidth: 250,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
				},
				{
					headerName: t('change_broker_reports_page.gateway_column'),
					field: 'id',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: () => t('states.state_Online'),
				},
				{
					headerName: t('change_broker_reports_page.status_column'),
					field: 'lastState',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => t('states.state_' + value),
				},
				{
					headerName: t('change_broker_reports_page.action_column'),
					field: 'action',
					maxWidth: 112,
					minWidth: 112,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellRenderer: ChangeBrokerReportsActionCell,
					cellRendererParams: {
						onDeleteRow,
					},
				},
			] as Array<ColDef<Reports.IChangeBrokerReports>>,
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
			<AgTable<Reports.IChangeBrokerReports>
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

export default ChangeBrokerTable;
