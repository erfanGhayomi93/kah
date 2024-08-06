import { useDrawalHistoryQuery } from '@/api/queries/requests';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { SessionHistorySVG } from '@/components/icons';
import { Link } from '@/navigation';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo, type FC } from 'react';

interface historyDrawalProps {
	onCloseModal: () => void;
}

export const HistoryDrawal: FC<historyDrawalProps> = ({ onCloseModal }) => {
	const t = useTranslations();

	const { data } = useDrawalHistoryQuery({
		queryKey: ['drawalHistoryOnline'],
	});

	const columnDefs = useMemo<Array<IColDef<Payment.IDrawalHistoryList>>>(
		() => [
			/* موعد پرداخت */
			{
				colId: 'requestDate',
				headerName: t('withdrawal_modal.withdrawal_date_column'),
				valueGetter: (row) => dateFormatter(row.requestDate),
			},
			/* مبلغ */
			{
				colId: 'requestAmount',
				headerName: t('withdrawal_modal.amount_column'),
				valueGetter: (row) => sepNumbers(String(row.requestAmount)),
			},
			/* وضعیت */
			{
				colId: 'state',
				headerName: t('withdrawal_modal.status_column'),
				valueGetter: (row) => t('deposit_modal.' + 'state_' + row.state),
			},
		],
		[],
	);

	return (
		<div className='flex h-full overflow-auto pr-24 flex-column'>
			<div className='flex-1 overflow-auto rounded-sm p-8 shadow-sm'>
				<LightweightTable
					rowData={data || []}
					columnDefs={columnDefs}
					className='bg-white darkBlue:bg-gray-50 dark:bg-gray-50'
				/>
			</div>

			<div>
				<Link
					className='h-48 w-full gap-8 rounded font-medium text-info-100 flex-justify-center'
					href={'/financial-reports/withdrawal-cash'}
					onClick={() => onCloseModal()}
				>
					<SessionHistorySVG width='1.6rem' height='1.6rem' />
					{t('deposit_modal.more_reports_deposit')}
				</Link>
			</div>
		</div>
	);
};
