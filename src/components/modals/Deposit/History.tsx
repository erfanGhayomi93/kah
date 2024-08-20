import { useDepositHistoryQuery, useReceiptHistoryQuery } from '@/api/queries/requests';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { SessionHistorySVG } from '@/components/icons';
import { Link } from '@/navigation';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';

interface HistoryDepositType {
	activeTab?: Payment.TDepositTab;
	onCloseModal: () => void;
}

export const HistoryDeposit: FC<HistoryDepositType> = ({ activeTab, onCloseModal }) => {
	const t = useTranslations();

	const { data: depositData = [] } = useDepositHistoryQuery({
		queryKey: ['depositHistoryOnline'],
		enabled: activeTab === 'liveDepositTab',
	});

	const { data: receiptData = [] } = useReceiptHistoryQuery({
		queryKey: ['receiptHistoryOnline'],
		enabled: activeTab === 'receiptDepositTab',
	});

	const depositColumnDefs = useMemo<Array<IColDef<Payment.IDepositHistoryList>>>(
		() => [
			{
				colId: 'saveDate',
				headerName: t('deposit_modal.time_history'),
				valueGetter: (row) => dateFormatter(row.saveDate),
				cellClass: 'ltr',
			},
			{
				colId: 'amount',
				headerName: t('deposit_modal.price_history'),
				valueGetter: (row) => sepNumbers(String(row.amount)),
			},
			{
				colId: 'state',
				headerName: t('deposit_modal.status_history'),
				valueGetter: (row) => t('states.' + 'state_' + row.state),
				cellClass: 'text-sm',
			},
		],
		[],
	);

	const receiptColumnDefs = useMemo<Array<IColDef<Payment.IReceiptHistoryList>>>(
		() => [
			{
				colId: 'saveDate',
				headerName: t('deposit_modal.time_history'),
				valueGetter: (row) => row.date,
				valueFormatter: ({ value }) => dateFormatter(value as string),
				cellClass: 'ltr',
			},
			{
				colId: 'amount',
				headerName: t('deposit_modal.price_history'),
				valueGetter: (row) => row.amount,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'providerType',
				headerName: t('deposit_modal.provider_type'),
				valueGetter: (row) => row.providerType,
				valueFormatter: ({ value }) => value,
			},
			{
				colId: 'receipt_value',
				headerName: t('deposit_modal.receipt_value_placeholder'),
				valueGetter: (row) => row.receiptNumber,
			},
			{
				colId: 'state',
				headerName: t('deposit_modal.status_history'),
				valueGetter: (row) => row.state,
				valueFormatter: ({ value }) => t(`states.state_${value}`),
			},
		],
		[],
	);

	const modifiedData = useMemo(() => {
		if (activeTab === 'liveDepositTab') return depositData.slice(0, 4);
		return receiptData.slice(0, 8);
	}, [activeTab, depositData, receiptData]);

	const reportPageUrl =
		activeTab === 'liveDepositTab'
			? '/financial-reports/instant-deposit'
			: '/financial-reports/deposit-with-receipt';

	return (
		<div className='h-full gap-8 flex-column'>
			<LightweightTable<Payment.IDepositHistoryList[] | Payment.IReceiptHistoryList[]>
				transparent
				headerHeight={40}
				rowHeight={40}
				rowData={modifiedData}
				columnDefs={
					(activeTab === 'liveDepositTab' ? depositColumnDefs : receiptColumnDefs) as Array<
						IColDef<Payment.IDepositHistoryList | Payment.IReceiptHistoryList>
					>
				}
			/>

			<Link
				className='h-40 w-full gap-8 rounded font-medium text-info-100 flex-justify-center'
				href={reportPageUrl}
				onClick={() => onCloseModal()}
			>
				<SessionHistorySVG width='1.6rem' height='1.6rem' />
				{t('deposit_modal.more_reports_deposit')}
			</Link>
		</div>
	);
};
