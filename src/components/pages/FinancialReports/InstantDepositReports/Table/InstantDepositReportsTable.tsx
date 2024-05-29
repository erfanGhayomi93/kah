import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface InstantDepositReportsTableProps {
	reports: Reports.IInstantDeposit[] | null;
	columnsVisibility: InstantDepositReports.TInstantDepositReportsColumnsState[];
}

const InstantDepositReportsTable = ({ reports, columnsVisibility }: InstantDepositReportsTableProps) => {
	const t = useTranslations();

	const COLUMNS = useMemo<Array<IColDef<Reports.IInstantDeposit>>>(
		() => [
			/* ردیف */
			{
				colId: 'id',
				headerName: t('instant_deposit_reports_page.id_column'),
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
			},
			/* تاریخ */
			{
				colId: 'saveDate',
				headerName: t('instant_deposit_reports_page.date_column'),
				cellClass: 'ltr',
				valueGetter: (row) => dateFormatter(row.saveDate ?? '', 'datetime'),
			},
			/* درگاه */
			{
				colId: 'providerType',
				headerName: t('instant_deposit_reports_page.getway_column'),
				valueGetter: (row) => t('bank_accounts.' + row.providerType),
			},
			/* شماره پیگیری */
			{
				colId: 'reservationNumber',
				headerName: t('instant_deposit_reports_page.reservation_number_column'),
				valueGetter: (row) => row.reservationNumber,
			},
			/* مبلغ */
			{
				colId: 'amount',
				headerName: t('instant_deposit_reports_page.price_column'),
				// width: 220,
				valueGetter: (row) => sepNumbers(String(row.amount)),
			},
			/* وضعیت */
			{
				colId: 'state',
				headerName: t('instant_deposit_reports_page.status_column'),
				valueGetter: (row) => t('states.state_' + row.state),
			},
		],
		[],
	);

	return (
		<>
			<LightweightTable rowData={reports ?? []} columnDefs={COLUMNS} />
		</>
	);
};

export default InstantDepositReportsTable;
