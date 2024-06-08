import brokerAxios from '@/api/brokerAxios';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useBrokerQueryClient } from '@/hooks';
import { dateFormatter } from '@/utils/helpers';
import { type GridApi } from '@ag-grid-community/core';
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

	const queryClient = useBrokerQueryClient();

	const gridRef = useRef<GridApi<Reports.IFreezeUnfreezeReports>>(null);

	const url = useAppSelector(getBrokerURLs);

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
				colId: 'id',
				headerName: t('freeze_and_unfreeze_reports_page.id_column'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'id')]?.hidden,
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
			},
			{
				colId: 'symbolTitle',
				headerName: t('freeze_and_unfreeze_reports_page.symbol_column'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'symbolTitle')]?.hidden,
				valueGetter: (row) => row.symbolTitle ?? '',
			},
			{
				colId: 'confirmedOn',
				headerName: t('freeze_and_unfreeze_reports_page.date_column'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'confirmedOn')]?.hidden,
				valueGetter: (row) => dateFormatter(row.confirmedOn ?? '', 'date'),
			},
			{
				colId: 'requestState',
				headerName: t('freeze_and_unfreeze_reports_page.status_column'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'requestState')]
					?.hidden,
				valueGetter: (row) =>
					row.requestState ? t('freeze_and_unfreeze_reports_page.state_' + row.requestState) : '',
			},
			{
				colId: 'action',
				headerName: t('freeze_and_unfreeze_reports_page.action_column'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'action')]?.hidden,
				valueGetter: (row) => row.symbolISIN,
				valueFormatter: ({ row }) => (
					<FreezeUnFreezeReportsTableActionCell data={row} onDeleteRow={onDeleteRow} />
				),
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

export default FreezeUnFreezeReportsTable;
