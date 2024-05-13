import AgTable from '@/components/common/Tables/AgTable';
import ConvertToHTML from '@/components/common/Tables/Cells/ConvertToHTML';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef } from 'react';

interface WatchlistTableProps {
	reports: Reports.ITransactions[] | null;
	finalRemain: number;
	lastTrades: number;
	columnsVisibility: TTransactionColumnsState[];
	setColumnsVisibility: Dispatch<SetStateAction<TTransactionColumnsState[]>>;
}

const TransactionsTable = ({
	reports,
	finalRemain,
	lastTrades,
	columnsVisibility,
	setColumnsVisibility,
}: WatchlistTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Reports.ITransactions>>(null);

	const dateFormatter = (v: string | number) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD');
	};

	const COLUMNS = useMemo<Array<ColDef<Reports.ITransactions>>>(
		() =>
			[
				{
					headerName: t('transactions_reports_page.id_column'),
					field: 'symbolIsin',
					pinned: 'right',
					maxWidth: 96,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueGetter: ({ node }) => String((node?.childIndex ?? 0) + 1),
				},
				{
					headerName: t('transactions_reports_page.date_column'),
					field: 'date',
					maxWidth: 96,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value ?? ''),
				},
				{
					headerName: t('transactions_reports_page.operator_column'),
					field: 'transactionType',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ data }) => t('transactions_reports_page.operator_type_' + data?.transactionType),
					cellClass: ({ data }) => {
						switch (data?.transactionType) {
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
					headerName: t('transactions_reports_page.description_column'),
					field: 'description',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					minWidth: 144,
					cellRenderer: ConvertToHTML,
					valueFormatter: ({ data }) =>
						data?.description === 'payfast-1561'
							? t('transactions_reports_page.payfast')
							: data?.description,
				},
				{
					headerName: t('transactions_reports_page.debit_column'),
					field: 'debit',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellClass: ({ value }) =>
						clsx('ltr', {
							'text-error-100': value < 0,
						}),
					valueFormatter: ({ data }) =>
						Number(data?.debit) >= 0
							? sepNumbers(String(data?.debit))
							: `(${sepNumbers(String(data?.debit))})`,
				},
				{
					headerName: t('transactions_reports_page.credit_column'),
					field: 'credit',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellClass: ({ data }) =>
						clsx('ltr', {
							'text-error-100': Number(data?.credit) < 0,
						}),
					valueFormatter: ({ data }) =>
						Number(data?.credit) >= 0
							? sepNumbers(String(data?.credit))
							: `(${sepNumbers(String(data?.credit))})`,
				},
				{
					headerName: t('transactions_reports_page.remain_column'),
					field: 'remaining',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellClass: ({ data }) =>
						clsx('ltr', Number(data?.remaining) > 0 ? 'text-success-400' : 'text-error-300'),
					valueFormatter: ({ data }) =>
						Number(data?.remaining) >= 0
							? sepNumbers(String(data?.remaining))
							: `(${sepNumbers(String(data?.remaining))})`,
				},
				{
					headerName: t('transactions_reports_page.station_column'),
					field: 'station',
					maxWidth: 144,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
				},
			] as Array<ColDef<Reports.ITransactions>>,
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
		if (!eGrid) return;

		try {
			eGrid.setGridOption('rowData', reports);
		} catch (e) {
			//
		}
	}, [reports]);

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
			<AgTable<Reports.ITransactions>
				ref={gridRef}
				rowData={reports}
				rowHeight={40}
				headerHeight={48}
				columnDefs={COLUMNS}
				defaultColDef={defaultColDef}
				suppressRowClickSelection={false}
				className='h-full border-0'
			/>
		</>
	);
};

export default TransactionsTable;
