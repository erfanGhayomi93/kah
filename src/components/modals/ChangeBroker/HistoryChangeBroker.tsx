import brokerAxios from '@/api/brokerAxios';
import { useHistoryChangeBrokerQuery } from '@/api/queries/requests';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { SessionHistorySVG, TrashSVG } from '@/components/icons';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useBrokerQueryClient } from '@/hooks';
import { Link } from '@/navigation';
import { dateFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { toast } from 'react-toastify';

interface HistoryChangeBrokerType {
	onCloseModal: () => void;
}

export const HistoryChangeBroker: FC<HistoryChangeBrokerType> = ({ onCloseModal }) => {
	const t = useTranslations();

	const url = useAppSelector(getBrokerURLs);

	const queryClient = useBrokerQueryClient();

	const { data = [] } = useHistoryChangeBrokerQuery({
		queryKey: ['LastHistoryChangeBroker'],
	});

	const deleteChangeBroker = async (id: number) => {
		if (!url) return;
		try {
			const response = await brokerAxios.post(url.AccountChangeBrokerDelete, null, {
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

				queryClient.invalidateQueries({
					queryKey: ['changeBrokerReports'],
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
			},
			{
				colId: 'symbolTitle',
				headerName: t('change_broker_modal.symbol_column'),
				valueGetter: (row) => (row.symbolTitle ? row.symbolTitle : '-'),
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
			},
		],
		[],
	);

	return (
		<div className='flex h-full gap-8 overflow-auto px-24 flex-column'>
			<div className='flex-1 rounded-sm p-8 shadow-sm'>
				<LightweightTable
					headerHeight={40}
					rowHeight={40}
					rowData={data.slice(0, 4)}
					columnDefs={columnDefs}
					className='bg-white darkness:bg-gray-50'
				/>
			</div>

			<Link
				className='h-40 w-full gap-8 rounded font-medium text-info-100 flex-justify-center'
				href={'/change-broker-reports'}
				onClick={() => onCloseModal()}
			>
				<SessionHistorySVG width='1.6rem' height='1.6rem' />
				{t('deposit_modal.more_reports_deposit')}
			</Link>
		</div>
	);
};
