import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import clsx from 'clsx';
import * as DOMPurify from 'dompurify';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';

interface WatchlistTableProps {
	reports: Reports.ITransactions[] | null;
	columnsVisibility: Transaction.ITransactionColumnsState[];
}

const TransactionsTable = ({ reports, columnsVisibility }: WatchlistTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Reports.ITransactions>>(null);

	const dateFormatter = (v: string | number) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD');
	};

	const COLUMNS = useMemo<Array<IColDef<Reports.ITransactions>>>(
		() => [
			{
				colId: 'id',
				headerName: t('transactions_page.id_column'),
				width: 62,
				valueGetter: (row, rowIndex) => String((rowIndex ?? 0) + 1),
			},
			{
				colId: 'date',
				headerName: t('transactions_page.date_column'),
				// width: 96,
				valueGetter: (row) => dateFormatter(row?.date ?? ''),
			},
			{
				colId: 'transactionType',
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
								__html: DOMPurify.sanitize(row.description ?? ''),
							}}
						/>
					),
				width: 180,
			},
			{
				colId: 'debit',
				headerName: t('transactions_page.debit_column'),
				cellClass: (row) =>
					clsx('ltr', {
						'text-error-100': Number(row?.debit) < 0,
					}),
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
			},
			{
				colId: 'station',
				headerName: t('transactions_page.station_column'),
				width: 62,
				valueGetter: (row) => row?.station,
			},
		],
		[],
	);

	const defaultColDef: ColDef<Reports.ITransactions> = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			minWidth: 114,
			flex: 1,
		}),
		[],
	);

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid || !Array.isArray(columnsVisibility)) return;

		try {
			for (let i = 0; i < columnsVisibility.length; i++) {
				const { hidden, id } = columnsVisibility[i];
				eGrid.setColumnsVisible([id], !hidden);
			}
		} catch (e) {
			//
		}
	}, [columnsVisibility]);

	return (
		<>
			<LightweightTable rowData={reports ?? []} columnDefs={COLUMNS} />
		</>
	);
};

export default TransactionsTable;
