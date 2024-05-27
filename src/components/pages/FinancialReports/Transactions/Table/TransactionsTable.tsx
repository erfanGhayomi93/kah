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
				headerName: t('transactions_page.id_column'),
				maxWidth: 96,
				flex: 1,
				valueFormatter: (row) => 1,
			},
			{
				headerName: t('transactions_page.date_column'),
				maxWidth: 96,
				flex: 1,
				valueFormatter: (row) => dateFormatter(row?.date ?? ''),
			},
			{
				headerName: t('transactions_page.operator_column'),
				valueFormatter: (row) => t('transactions_page.operator_type_' + row?.transactionType),
				flex: 1,
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
				headerName: t('transactions_page.description_column'),
				maxWidth: 144,
				flex: 1,
				valueFormatter: (row) =>
					row?.description === 'payfast-1561' ? (
						t('transactions_page.payfast')
					) : (
						<span
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(row.description ?? ''),
							}}
						/>
					),
			},
			{
				headerName: t('transactions_page.debit_column'),
				flex: 1,
				cellClass: (row) =>
					clsx('ltr', {
						'text-error-100': Number(row?.debit) < 0,
					}),
				valueFormatter: (row) =>
					Number(row?.debit) >= 0 ? sepNumbers(String(row?.debit)) : `(${sepNumbers(String(row?.debit))})`,
			},
			{
				headerName: t('transactions_page.credit_column'),
				flex: 1,
				cellClass: (row) =>
					clsx('ltr', {
						'text-error-100': Number(row?.credit) < 0,
					}),
				valueFormatter: (row) =>
					Number(row?.credit) >= 0 ? sepNumbers(String(row?.credit)) : `(${sepNumbers(String(row?.credit))})`,
			},
			{
				headerName: t('transactions_page.remain_column'),
				cellClass: (row) => clsx('ltr', Number(row?.remaining) > 0 ? 'text-success-400' : 'text-error-300'),
				flex: 1,
				valueFormatter: (row) =>
					Number(row?.remaining) >= 0
						? sepNumbers(String(row?.remaining))
						: `(${sepNumbers(String(row?.remaining))})`,
			},
			{
				headerName: t('transactions_page.station_column'),
				flex: 1,
				maxWidth: 144,
				valueFormatter: (row) => row?.station,
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
