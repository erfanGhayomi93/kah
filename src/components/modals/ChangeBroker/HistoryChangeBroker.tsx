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
		queryKey: ['LastHistoryChangeBroker']
	});

	const deleteChangeBroker = async (id: number) => {
		if (!url) return;
		try {
			const response = await brokerAxios.post(url.DeleteChangeBroker, null, {
				params: {
					RequestID: id
				},
			});
			const { data } = response;

			if (!data.succeeded) {
				toast.success(t('alerts.change_broker_failure_' + data.errors[0]), {
					toastId: 'change_broker_successfully'
				});
			} else {
				toast.success(t('alerts.change_broker_request_successfully'), {
					toastId: 'change_broker_successfully'
				});

				queryClient.refetchQueries({
					queryKey: ['LastHistoryChangeBroker']
				});
			}
		} catch (e) {
			const { message } = (e as Error);
			toast.error(t('alerts.change_broker_failure_' + message), {
				toastId: message
			});
		}
	};


	const columnDefs = useMemo<Array<IColDef<Payment.IChangeBrokerList>>>(() => [
		{
			headerName: t('deposit_modal.time_history'),
			valueFormatter: (row) => dateFormatter(row.saveDate),
			headerClass: '!bg-white',
		}, {
			headerName: t('change_broker_modal.symbol_column'),
			valueFormatter: (row) => row.symbolTitle ? row.symbolTitle : '-',
			headerClass: '!bg-white',
		}, {
			headerName: t('change_broker_modal.last_state_column'),
			valueFormatter: (row) => (
				<div className='flex-justify-center'>
					<span className='min-w-80'>
						{t('deposit_modal.' + 'state_' + row.lastState)}
					</span>

					{
						row.lastState === 'Draft' && (
							<span
								className='cursor-pointer'
								onClick={() => deleteChangeBroker(row.id)}
							>
								<TrashSVG />
							</span>
						)
					}
				</div>
			),
			headerClass: '!bg-white',
			cellClass: '!text-sm'
		}
	], []);


	return (
		<div className="h-full pr-24 flex flex-column">
			<div className="flex-1 rounded-sm shadow-card p-8">
				<LightweightTable
					rowData={data || []}
					columnDefs={columnDefs}
					className="bg-white"
				/>
			</div>

			<Link
				className='h-48 text-info rounded w-full font-medium gap-8 flex-justify-center'
				href={'/financial-reports/instant-deposit'}
				onClick={() => onCloseModal()}
			>
				<SessionHistorySVG />

				{t('deposit_modal.more_reports_deposit')}
			</Link>
		</div>
	);
};
