import brokerAxios from '@/api/brokerAxios';
import { useHistoryChangeBrokerQuery } from '@/api/queries/requests';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { SessionHistorySVG, TrashSVG } from '@/components/icons';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { dateFormatter } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { type FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface HistoryChangeBrokerType {
	onCloseModal: () => void;
}

export const HistoryChangeBroker: FC<HistoryChangeBrokerType> = ({ onCloseModal }) => {
	const t = useTranslations();

	const url = useSelector(getBrokerURLs);

	const queryClient = useQueryClient();

	const { data } = useHistoryChangeBrokerQuery({
		queryKey: ['LastHistoryChangeBroker'],
	});

	const deleteChangeBroker = async (id: number) => {
		if (!url) return;
		try {
			const response = await brokerAxios.post(url.DeleteChangeBroker, null, {
				params: {
					RequestID: id,
				},
			});
			const { data } = response;

			if (!data.succeeded) {
				toast.success(t('alerts.change_broker_failure_' + data.errors[0]), {
					toastId: 'change_broker_successfully',
				});
			} else {
				toast.success(t('alerts.change_broker_request_successfully'), {
					toastId: 'change_broker_successfully',
				});

				queryClient.refetchQueries({
					queryKey: ['LastHistoryChangeBroker'],
				});
			}
		} catch (e) {
			const { message } = e as Error;
			toast.error(t('alerts.change_broker_failure_' + message), {
				toastId: message,
			});
		}
	};

	const columnDefs = useMemo<Array<IColDef<Payment.IChangeBrokerList>>>(
		() => [
			{
				colId: 'saveDate',
				headerName: t('deposit_modal.time_history'),
				valueGetter: (row) => dateFormatter(row.saveDate),
				headerClass: '!bg-white',
			},
			{
				colId: 'symbolTitle',
				headerName: t('change_broker_modal.symbol_column'),
				valueGetter: (row) => (row.symbolTitle ? row.symbolTitle : '-'),
				headerClass: '!bg-white',
			},
			{
				colId: 'action',
				headerName: t('change_broker_modal.last_state_column'),
				valueGetter: (row) => row.id,
				valueFormatter: ({ row }) => (
					<div className='flex-justify-center'>
						<span className='min-w-80'>{t('deposit_modal.' + 'state_' + row.lastState)}</span>

						{row.lastState === 'Draft' && (
							<span className='cursor-pointer' onClick={() => deleteChangeBroker(row.id)}>
								<TrashSVG />
							</span>
						)}
					</div>
				),
				headerClass: '!bg-white',
				cellClass: '!text-sm',
			},
		],
		[],
	);

	return (
		<div className='flex h-full pr-24 flex-column'>
			<div className='flex-1 rounded-sm p-8 shadow-card'>
				<LightweightTable rowData={data || []} columnDefs={columnDefs} className='bg-white' />
			</div>

			<Link
				className='h-48 w-full gap-8 rounded font-medium text-info flex-justify-center'
				href={'/financial-reports/change-broker'}
				onClick={() => onCloseModal()}
			>
				<SessionHistorySVG />

				{t('deposit_modal.more_reports_deposit')}
			</Link>
		</div>
	);
};
