import { useCashSettlementReportsQuery, usePhysicalSettlementReportsQuery } from '@/api/queries/reportsQueries';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { SessionHistorySVG } from '@/components/icons';
import { Link } from '@/navigation';
import { dateFormatter } from '@/utils/helpers';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useMemo, type FC } from 'react';

interface HistorySettlementProps {
	tabSelected: string;
	onCloseModal: () => void;
}

export const HistorySettlement: FC<HistorySettlementProps> = ({ tabSelected, onCloseModal }) => {
	const t = useTranslations();

	const isCash = useMemo(() => tabSelected === 'optionSettlementCashTab', [tabSelected]);

	const dateParams = useMemo(
		() => ({
			fromDate: dayjs().subtract(1, 'month').toDate().getTime(),
			toDate: dayjs().add(1, 'year').toDate().getTime(),
		}),
		[],
	);

	const { data: cashHistory } = useCashSettlementReportsQuery({
		queryKey: [
			'cashSettlementReports',
			{
				...dateParams,
			},
		],
	});

	const { data: physicalHistory } = usePhysicalSettlementReportsQuery({
		queryKey: [
			'physicalSettlementReports',
			{
				...dateParams,
			},
		],
	});

	const columnDefs = useMemo<Array<IColDef<Reports.ICashSettlementReports>>>(
		() => [
			/* نماد */
			{
				colId: 'symbolTitle',
				headerName: t('cash_settlement_reports_page.symbol_column'),
				valueGetter: (row) => row.symbolTitle ?? '',
			},
			/* سمت */
			{
				colId: 'side',
				headerName: t('physical_settlement_reports_page.side_column'),
				valueGetter: (row) => t(`common.${row?.side.toLowerCase()}`),
				cellClass: (row) =>
					clsx({
						'text-success-100': row.side === 'Buy',
						'text-error-100': row.side === 'Sell',
					}),
			},
			/* تاریخ */
			{
				colId: 'cashSettlementDate',
				headerName: t('cash_settlement_reports_page.date'),
				valueGetter: (row) => (row.cashSettlementDate ? dateFormatter(row.cashSettlementDate, 'date') : '-'),
			},
			/* وضعیت */
			{
				colId: 'status',
				headerName: t('cash_settlement_reports_page.status_column'),
				cellClass: 'text-right',
				valueGetter: (row) => (row.status ? t('cash_settlement_reports_page.type_status_' + row.status) : ''),
			},
		],
		[tabSelected],
	);

	return (
		<div className='flex h-full gap-8 flex-column'>
			<div className='flex-1 rounded-sm p-8 shadow-sm'>
				<LightweightTable
					rowData={(isCash ? cashHistory?.result : physicalHistory?.result) || []}
					columnDefs={columnDefs}
					className='bg-white darkBlue:bg-gray-50 dark:bg-gray-50'
				/>
			</div>

			<Link
				className='h-40 w-full gap-8 rounded font-medium text-info-100 flex-justify-center'
				href={isCash ? '/option-reports/cash-settlement' : '/option-reports/physical-settlement'}
				onClick={() => onCloseModal()}
			>
				<SessionHistorySVG width='1.6rem' height='1.6rem' />
				{t('deposit_modal.more_reports_deposit')}
			</Link>
		</div>
	);
};
