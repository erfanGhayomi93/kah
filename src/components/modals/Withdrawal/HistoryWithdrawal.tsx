import { useWithdrawalHistoryQuery } from '@/api/queries/requests';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { SessionHistorySVG } from '@/components/icons';
import { Link } from '@/navigation';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface HistoryWithdrawalProps {
	onCloseModal: () => void;
}

export const HistoryWithdrawal = ({ onCloseModal }: HistoryWithdrawalProps) => {
	const t = useTranslations();

	const { data } = useWithdrawalHistoryQuery({
		queryKey: ['withdrawalHistoryOnline'],
	});

	const columnDefs = useMemo<Array<IColDef<Payment.IWithdrawalHistoryList>>>(
		() => [
			/* موعد پرداخت */
			{
				colId: 'requestDate',
				headerName: t('withdrawal_modal.withdrawal_date_column'),
				valueGetter: (row) => dateFormatter(row.requestDate, 'date'),
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
				valueGetter: (row) => t('states.' + 'state_' + row.state),
			},
		],
		[],
	);

	return (
		<div className='h-full gap-8 flex-column'>
			<LightweightTable
				transparent
				headerHeight={40}
				rowHeight={40}
				rowData={data || []}
				columnDefs={columnDefs}
				className='bg-white darkness:bg-gray-50'
			/>

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

export default HistoryWithdrawal;
