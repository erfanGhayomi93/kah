import brokerAxios from '@/api/brokerAxios';
import { useRecentFreezeQuery, useRecentUnFreezeQuery } from '@/api/queries/requests';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { SessionHistorySVG, TrashSVG } from '@/components/icons';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { dateFormatter } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo, type FC } from 'react';
import { toast } from 'react-toastify';


interface HistoryFreezeProps {
	tabSelected: string;
	onCloseModal: () => void
}

const HistoryFreeze: FC<HistoryFreezeProps> = ({ tabSelected, onCloseModal }) => {

	const t = useTranslations();

	const url = useAppSelector(getBrokerURLs);

	const queryClient = useQueryClient();

	const isFreeze = useMemo(() => tabSelected === 'freezeModalTab', [tabSelected]);

	const { data: dataFreeze } = useRecentFreezeQuery({
		queryKey: ['RecentFreezeList'],
		enabled: isFreeze
	});

	const { data: dataUnFreeze } = useRecentUnFreezeQuery({
		queryKey: ['RecentUnFreezeList'],
		enabled: !isFreeze
	});

	const deleteChangeBroker = async (symbolISIN: string) => {
		if (!url) return;

		try {
			const response = await brokerAxios.post(url.DeleteFreeze, null, {
				params: {
					symbolISIN,
					type: isFreeze ? 'freeze' : 'unFreeze'
				},
			});
			const { data } = response;

			if (!data) {
				const message = isFreeze ? 'alerts.freeze_request_delete_failed' : 'alerts.unFreeze_request_delete_failed';

				toast.success(t(message), {
					toastId: message
				});
			} else {
				const message = isFreeze ? 'alerts.freeze_request_deleted' : 'alerts.unFreeze_request_deleted';

				toast.success(t(message), {
					toastId: message
				});

				queryClient.refetchQueries({
					queryKey: [isFreeze ? 'RecentFreezeList' : 'RecentUnFreezeList']
				});
			}
		} catch (e) {
			const message = isFreeze ? 'alerts.freeze_request_delete_failed' : 'alerts.unFreeze_request_delete_failed';

			toast.error(t(message), {
				toastId: message
			});
		}
	};

	const columnDefs = useMemo<Array<IColDef<Payment.IRecentFreezeList>>>(() => [
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
						{t('freeze_request_state.' + row.requestState)}
					</span>

					{
						row.requestState === 'InProgress' && (
							<span
								className='cursor-pointer'
								onClick={() => deleteChangeBroker(row.symbolISIN)}
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
	], [tabSelected]);


	return (
		<div className="h-full pr-24 flex flex-column">
			<div className="flex-1 rounded-sm shadow-card p-8">
				<LightweightTable
					rowData={(isFreeze ? dataFreeze : dataUnFreeze) || []}
					columnDefs={columnDefs}
					className="bg-white"
				/>
			</div>

			<Link
				className='h-48 text-info rounded w-full font-medium gap-8 flex-justify-center'
				href={'/option-reports/freeze-and-unfreeze'}
				onClick={() => onCloseModal()}
			>
				<SessionHistorySVG />

				{t('deposit_modal.more_reports_deposit')}
			</Link>
		</div>
	);
};



export default HistoryFreeze;
