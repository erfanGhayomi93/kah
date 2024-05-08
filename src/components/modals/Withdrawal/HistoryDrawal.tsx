import { useDrawalHistoryQuery } from '@/api/queries/requests';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { SessionHistorySVG } from '@/components/icons';
import { Link } from '@/navigation';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo, type FC } from 'react';

interface historyDrawalProps {
	onCloseModal: () => void
}



export const HistoryDrawal: FC<historyDrawalProps> = ({ onCloseModal }) => {

	const t = useTranslations();

	const { data } = useDrawalHistoryQuery({
		queryKey: ['drawalHistoryOnline']
	});

	const columnDefs = useMemo<Array<IColDef<Payment.IDrawalHistoryList>>>(() => [
		/* موعد پرداخت */
		{
			headerName: t('withdrawal_modal.withdrawal_date_column'),
			valueFormatter: (row) => dateFormatter(row.requestDate),
			headerClass: '!bg-white',
		},
		/* مبلغ */
		{
			headerName: t('withdrawal_modal.amount_column'),
			valueFormatter: (row) => sepNumbers(String(row.requestAmount)),
			headerClass: '!bg-white',
		},
		/* وضعیت */
		{
			headerName: t('withdrawal_modal.status_column'),
			valueFormatter: (row) => t('deposit_modal.' + 'state_' + row.state),
			headerClass: '!bg-white',
			cellClass: ''
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
				href={'/financial-reports/withdrawal-cash'}
				onClick={() => onCloseModal()}
			>
				<SessionHistorySVG />

				{t('deposit_modal.more_reports_deposit')}
			</Link>
		</div>
	);
};
