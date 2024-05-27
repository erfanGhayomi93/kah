import { useDepositHistoryQuery } from '@/api/queries/requests';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { SessionHistorySVG } from '@/components/icons';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { type FC, useMemo } from 'react';

interface HistoryDepositType {
	onCloseModal: () => void;
}

export const HistoryDeposit: FC<HistoryDepositType> = ({ onCloseModal }) => {
	const t = useTranslations();

	const { data } = useDepositHistoryQuery({
		queryKey: ['depositHistoryOnline'],
	});

	const columnDefs = useMemo<Array<IColDef<Payment.IDepositHistoryList>>>(
		() => [
			{
				headerName: t('deposit_modal.time_history'),
				valueFormatter: (row) => dateFormatter(row.saveDate),
				headerClass: '!bg-white',
			},
			{
				headerName: t('deposit_modal.price_history'),
				valueFormatter: (row) => sepNumbers(String(row.amount)),
				headerClass: '!bg-white',
			},
			{
				headerName: t('deposit_modal.status_history'),
				valueFormatter: (row) => t('deposit_modal.' + 'state_' + row.state),
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
				href={'/financial-reports/instant-deposit'}
				onClick={() => onCloseModal()}
			>
				<SessionHistorySVG />

				{t('deposit_modal.more_reports_deposit')}
			</Link>
		</div>
	);
};
