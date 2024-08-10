import brokerAxios from '@/api/brokerAxios';
import { useRecentFreezeQuery, useRecentUnFreezeQuery } from '@/api/queries/requests';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { SessionHistorySVG, TrashSVG } from '@/components/icons';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useBrokerQueryClient } from '@/hooks';
import { Link } from '@/navigation';
import { dateFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo, type FC } from 'react';
import { toast } from 'react-toastify';

interface HistoryFreezeProps {
	tabSelected: string;
	onCloseModal: () => void;
}

const HistoryFreeze: FC<HistoryFreezeProps> = ({ tabSelected, onCloseModal }) => {
	const t = useTranslations();

	const url = useAppSelector(getBrokerURLs);

	const queryClient = useBrokerQueryClient();

	const isFreeze = useMemo(() => tabSelected === 'freezeModalTab', [tabSelected]);

	const { data: dataFreeze } = useRecentFreezeQuery({
		queryKey: ['RecentFreezeList'],
		enabled: isFreeze,
	});

	const { data: dataUnFreeze } = useRecentUnFreezeQuery({
		queryKey: ['RecentUnFreezeList'],
		enabled: !isFreeze,
	});

	const deleteChangeBroker = async (symbolISIN: string) => {
		if (!url) return;

		try {
			const response = await brokerAxios.post(url.FreezeDelete, null, {
				params: {
					symbolISIN,
					type: isFreeze ? 'freeze' : 'unFreeze',
				},
			});
			const { data } = response;

			if (!data) {
				const message = isFreeze
					? 'alerts.freeze_request_delete_failed'
					: 'alerts.unFreeze_request_delete_failed';

				toast.success(t(message), {
					toastId: message,
				});
			} else {
				const message = isFreeze ? 'alerts.freeze_request_deleted' : 'alerts.unFreeze_request_deleted';

				toast.success(t(message), {
					toastId: message,
				});

				queryClient.refetchQueries({
					queryKey: [isFreeze ? 'RecentFreezeList' : 'RecentUnFreezeList'],
				});

				queryClient.invalidateQueries({ queryKey: ['freezeUnFreezeReports'] });
			}
		} catch (e) {
			const message = isFreeze ? 'alerts.freeze_request_delete_failed' : 'alerts.unFreeze_request_delete_failed';

			toast.error(t(message), {
				toastId: message,
			});
		}
	};

	const columnDefs = useMemo<Array<IColDef<Payment.IRecentFreezeList>>>(
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
				colId: 'requestState',
				headerName: t('change_broker_modal.last_state_column'),
				valueGetter: (row) => row.requestState,
				valueFormatter: ({ row }) => (
					<div className='flex-justify-center'>
						<span className='min-w-80'>{t('freeze_request_state.' + row.requestState)}</span>

						{row.requestState === 'InProgress' && (
							<span className='cursor-pointer' onClick={() => deleteChangeBroker(row.symbolISIN)}>
								<TrashSVG />
							</span>
						)}
					</div>
				),
			},
		],
		[tabSelected],
	);

	return (
		<div className='flex h-full gap-8 px-24 flex-column'>
			<LightweightTable
				transparent
				headerHeight={40}
				rowHeight={40}
				rowData={(isFreeze ? dataFreeze : dataUnFreeze) || []}
				columnDefs={columnDefs}
				className='bg-white darkness:bg-gray-50'
			/>

			<Link
				className='h-40 w-full gap-8 rounded font-medium text-info-100 flex-justify-center'
				href={'/option-reports/freeze-and-unfreeze'}
				onClick={() => onCloseModal()}
			>
				<SessionHistorySVG width='1.6rem' height='1.6rem' />
				{t('deposit_modal.more_reports_deposit')}
			</Link>
		</div>
	);
};

export default HistoryFreeze;
