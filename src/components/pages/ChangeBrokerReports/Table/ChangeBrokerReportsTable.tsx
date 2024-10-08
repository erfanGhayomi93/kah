import axios from '@/api/brokerAxios';
import { store } from '@/api/inject-store';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useBrokerQueryClient } from '@/hooks';
import { dateFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import ChangeBrokerReportsTableActionCell from './ChangeBrokerReportsTableActionCell';

interface IChangeBrokerReportsTableProps {
	reports: Reports.IChangeBrokerReports[] | null;
	columnsVisibility: ChangeBrokerReports.IChangeBrokerReportsColumnsState[];
}

const ChangeBrokerReportsTable = ({ reports, columnsVisibility }: IChangeBrokerReportsTableProps) => {
	const t = useTranslations();

	const queryClient = useBrokerQueryClient();

	const onDeleteRow = (data: Reports.IChangeBrokerReports | undefined) =>
		new Promise<void>(async (resolve, reject) => {
			const url = getBrokerURLs(store.getState());
			if (!url || !data) return null;

			try {
				const response = await axios.post<ServerResponse<boolean>>(
					`${url.AccountChangeBrokerDelete}?RequestID=${data?.id}`,
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
			/* ردیف */
			{
				colId: 'id',
				headerName: t('change_broker_reports_page.id_column'),
				width: 32,
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'id')]?.hidden,
			},
			/* زمان */
			{
				colId: 'saveDate',
				headerName: t('change_broker_reports_page.date_column'),
				cellClass: 'ltr',
				valueGetter: (row) => dateFormatter(row.saveDate ?? '', 'datetime'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'saveDate')]?.hidden,
			},
			/* نماد */
			{
				colId: 'symbolTitle',
				headerName: t('change_broker_reports_page.symbol_column'),
				cellClass: 'ltr text-right',
				valueGetter: (row) => row.symbolTitle,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'symbolTitle')]?.hidden,
			},
			/* سامانه */
			{
				colId: 'gateway',
				headerName: t('change_broker_reports_page.gateway_column'),
				valueGetter: () => t('states.state_Online'),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'gateway')]?.hidden,
			},
			/* وضعیت */
			{
				colId: 'lastState',
				headerName: t('change_broker_reports_page.status_column'),
				width: 180,
				valueGetter: (row) => t('states.state_' + row.lastState),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'lastState')]?.hidden,
			},
			/* عملیات */
			{
				colId: 'action',
				headerName: t('change_broker_reports_page.action_column'),
				valueGetter: (row) => row.id,
				valueFormatter: ({ row }) => (
					<ChangeBrokerReportsTableActionCell data={row} onDeleteRow={onDeleteRow} />
				),
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'action')]?.hidden,
			},
		],
		[columnsVisibility],
	);

	return <LightweightTable rowData={reports ?? []} columnDefs={COLUMNS} />;
};

export default ChangeBrokerReportsTable;
