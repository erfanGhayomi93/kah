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
	const t = useTranslations('transactions_page');

	const COLUMNS = useMemo<Array<IColDef<Reports.ITransactions>>>(
		() => [
			/* ردیف */
			{
				colId: 'symbolISIN',
				headerName: t('id_column'),
				maxWidth: 112,
				minWidth: 112,
				valueGetter: (_r, rowIndex) => rowIndex + 1,
				sortable: false,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'symbolISIN')]?.hidden,
			},

			/* تاریخ */
			{
				colId: 'tradeDate',
				headerName: t('date_column'),
				maxWidth: 144,
				minWidth: 144,
				cellClass: 'ltr',
				valueGetter: (row) => (row?.fcKey === '-1' ? '' : row?.tradeDate),
				valueFormatter: ({ value }) => (!value ? '−' : dateFormatter(value as string, 'date')),
				sortable: false,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'tradeDate')]?.hidden,
			},

			/* عملیات */
			{
				colId: 'turnOverTransactionType',
				headerName: t('operation_column'),
				maxWidth: 128,
				valueGetter: (row) => row.turnOverTransactionType,
				valueFormatter: ({ value }) => (value ? t('type_' + value) : '-'),
				cellClass: ({ turnOverTransactionType }) =>
					clsx({
						'text-success-100': turnOverTransactionType === 'Buy',
						'text-error-100': turnOverTransactionType === 'Sell',
					}),
				sortable: false,
				hidden: columnsVisibility[
					columnsVisibility.findIndex((column) => column.id === 'turnOverTransactionType')
				]?.hidden,
			},

			/* شرح تراکنش */
			{
				colId: 'description',
				headerName: t('description_column'),
				width: 200,
				cellClass: 'text-right',
				valueGetter: (row) => row.description,
				valueFormatter: ({ row }) =>
					row.description === '-' ? (
						row.turnOverTransactionTypeName
					) : (
						<span
							dangerouslySetInnerHTML={{
								__html: sanitizeHTML(row.description ?? ''),
							}}
						/>
					),
				sortable: false,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'description')]?.hidden,
			},

			/* بدهکار */
			{
				colId: 'debit',
				headerName: t('withdraw_column'),
				maxWidth: 160,
				valueGetter: (row) => row.debit,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber >= 0
						? sepNumbers(String(valueAsNumber))
						: `(${sepNumbers(String(valueAsNumber))})`;
				},
				sortable: false,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'debit')]?.hidden,
			},

			/* بستانکار */
			{
				colId: 'credit',
				headerName: t('deposit_column'),
				maxWidth: 160,
				valueGetter: (row) => row.credit,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber >= 0
						? sepNumbers(String(valueAsNumber))
						: `(${sepNumbers(String(valueAsNumber))})`;
				},
				sortable: false,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'credit')]?.hidden,
			},

			/* مانده */
			{
				colId: 'remaining',
				headerName: t('remain_column'),
				maxWidth: 160,
				valueGetter: (row) => row.remaining,
				valueFormatter: ({ value }) => {
					const valueAsNumber = Number(value);
					return valueAsNumber > 0
						? `+${sepNumbers(String(valueAsNumber))}`
						: `(${sepNumbers(String(Math.abs(valueAsNumber)))})`;
				},
				sortable: false,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'remaining')]?.hidden,
			},

			/* ایستگاه معاملاتی */
			{
				colId: 'branchName',
				headerName: t('trades_situation'),
				maxWidth: 160,
				sortable: false,
				valueGetter: (row) => row.branchName,
				hidden: columnsVisibility[columnsVisibility.findIndex((column) => column.id === 'branchName')]?.hidden,
			},
		],
		[columnsVisibility],
	);

	return <LightweightTable rowData={reports ?? []} columnDefs={COLUMNS} />;
};

export default TransactionsTable;
