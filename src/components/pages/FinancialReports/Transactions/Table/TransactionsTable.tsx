import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { dateFormatter, sanitizeHTML, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface WatchlistTableProps {
	reports: Reports.ITransactions[] | null;
	columnsVisibility: Transaction.ITransactionColumnsState[];
}

const TransactionsTable = ({ reports, columnsVisibility }: WatchlistTableProps) => {
	const t = useTranslations();

	const COLUMNS = useMemo<Array<IColDef<Reports.ITransactions>>>(
		() => [
			{
				colId: 'id',
				headerName: t('transactions_page.id_column'),
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
				maxWidth: 112,
				minWidth: 112,
			},
			{
				colId: 'date',
				headerName: t('transactions_page.date_column'),
				maxWidth: 144,
				minWidth: 144,
				cellClass: 'ltr',
				valueGetter: (row) => dateFormatter(row?.date ?? '', 'datetime'),
			},
			{
				colId: 'transactionType',
				maxWidth: 128,
				headerName: t('transactions_page.operator_column'),
				valueGetter: (row) => t('transactions_page.operator_type_' + row?.transactionType),
				cellClass: (row) => {
					switch (row?.transactionType) {
						case 'Buy':
							return 'text-success-100';
						case 'Sell':
							return 'text-error-100';
						default:
							return 'text-text-100';
					}
				},
			},
			{
				colId: 'description',
				headerName: t('transactions_page.description_column'),
				valueGetter: (row) => row.description,
				valueFormatter: ({ row }) =>
					row.description === 'payfast-1561' ? (
						t('transactions_page.payfast')
					) : (
						<span
							dangerouslySetInnerHTML={{
								__html: sanitizeHTML(row.description ?? ''),
							}}
						/>
					),
			},
			{
				colId: 'debit',
				headerName: t('transactions_page.debit_column'),
				cellClass: (row) =>
					clsx(' ltr', {
						'text-error-100': Number(row?.debit) < 0,
					}),
				maxWidth: 160,
				valueGetter: (row) => row.debit,
				valueFormatter: ({ value }) =>
					Number(value) >= 0 ? sepNumbers(String(value)) : `(${sepNumbers(String(value))})`,
			},
			{
				colId: 'credit',
				headerName: t('transactions_page.credit_column'),
				cellClass: (row) =>
					clsx('ltr', {
						'text-error-100': Number(row?.credit) < 0,
					}),
				maxWidth: 160,
				valueGetter: (row) =>
					Number(row?.credit) >= 0 ? sepNumbers(String(row?.credit)) : `(${sepNumbers(String(row?.credit))})`,
			},
			{
				colId: 'remaining',
				headerName: t('transactions_page.remain_column'),
				cellClass: (row) => clsx('ltr', Number(row?.remaining) > 0 ? 'text-success-400' : 'text-error-300'),
				valueGetter: (row) =>
					Number(row?.remaining) >= 0
						? sepNumbers(String(row?.remaining))
						: `(${sepNumbers(String(row?.remaining))})`,
				maxWidth: 160,
			},
			{
				colId: 'station',
				headerName: t('transactions_page.station_column'),
				maxWidth: 160,
				valueGetter: (row) => row?.station,
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

export default TransactionsTable;
