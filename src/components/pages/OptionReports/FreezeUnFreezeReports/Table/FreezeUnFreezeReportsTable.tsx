import brokerAxios from '@/api/brokerAxios';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import dayjs from '@/libs/dayjs';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import FreezeUnFreezeReportsTableActionCell from './FreezeUnFreezeReportsTableActionCell';

interface FreezeUnFreezeReportsTableProps {
	reports: Reports.IFreezeUnfreezeReports[] | null;
	columnsVisibility: FreezeUnFreezeReports.IFreezeUnFreezeReportsColumnsState[];
}

const FreezeUnFreezeReportsTable = ({ reports, columnsVisibility }: FreezeUnFreezeReportsTableProps) => {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const gridRef = useRef<GridApi<Reports.IFreezeUnfreezeReports>>(null);

	const url = useAppSelector(getBrokerURLs);

	const dateFormatter = (v: string | number) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD');
	};

	const onDeleteRow = (data: Reports.IFreezeUnfreezeReports | undefined) =>
		new Promise<void>(async (resolve, reject) => {
			if (!url || !data) return null;

			try {
				const response = await brokerAxios.post<number>(url.deleteFreezeUnFreeze, null, {
					params: {
						symbolISIN: data.symbolISIN,
						type: data.requestType,
					},
				});

				if (response.status !== 200 || !response.data) throw new Error('Error');

				toast.success(t('alerts.' + data.requestType.toLowerCase() + '_request_deleted'), {
					toastId: data.requestType + '_request_deleted',
				});

				queryClient.invalidateQueries({ queryKey: ['freezeUnFreezeReports'] });

				resolve();
			} catch (error) {
				toast.error(t('alerts.' + data.requestType.toLowerCase() + '_request_delete_failed'), {
					toastId: data.requestType + '_request_delete_failed',
				});

				reject();
			}
		});

	const COLUMNS = useMemo<Array<IColDef<Reports.IFreezeUnfreezeReports>>>(
		() => [
			{
				headerName: t('freeze_and_unfreeze_reports_page.id_column'),
				// field: 'id',
				// pinned: 'right',
				// maxWidth: 112,
				valueFormatter: () => 1,
			},
			{
				headerName: t('freeze_and_unfreeze_reports_page.symbol_column'),
				// field: 'symbolTitle',
				// minWidth: 112,
				valueFormatter: (row) => row.symbolTitle ?? '',
			},
			{
				headerName: t('freeze_and_unfreeze_reports_page.date_column'),
				// field: 'confirmedOn',
				// minWidth: 112,
				valueFormatter: (row) => dateFormatter(row.confirmedOn ?? ''),
			},
			{
				headerName: t('freeze_and_unfreeze_reports_page.status_column'),
				// field: 'requestState',
				// minWidth: 128,
				valueFormatter: (row) =>
					row.requestState ? t('freeze_and_unfreeze_reports_page.state_' + row.requestState) : '',
			},
			{
				headerName: t('freeze_and_unfreeze_reports_page.action_column'),
				// field: 'action',
				// maxWidth: 200,
				// minWidth: 200,
				cellClass: 'flex-justify-center',
				valueFormatter: (row) => <FreezeUnFreezeReportsTableActionCell data={row} onDeleteRow={onDeleteRow} />,
			},
		],
		[],
	);

	const defaultColDef: ColDef<Reports.IFreezeUnfreezeReports> = useMemo(
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

export default FreezeUnFreezeReportsTable;
