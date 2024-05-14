import AgTable from '@/components/common/Tables/AgTable';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef } from 'react';
import DepositWithReceiptReportsActionCell from './DepositWithReceiptReportsActionCell';

interface DepositWithReceiptReportsTableProps {
	reports: Reports.IDepositWithReceipt[] | null;
	columnsVisibility: IDepositWithReceiptReportsColumnsState[];
	setColumnsVisibility: Dispatch<SetStateAction<IDepositWithReceiptReportsColumnsState[]>>;
}

const DepositWithReceiptReportsTable = ({ reports, columnsVisibility }: DepositWithReceiptReportsTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Reports.IDepositWithReceipt>>(null);

	const dateFormatter = (v: string | number) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD');
	};

	const onDeleteRow = async () => {
		//
	};

	const onEditRow = async () => {
		//
	};

	const COLUMNS = useMemo<Array<ColDef<Reports.IDepositWithReceipt>>>(
		() =>
			[
				{
					headerName: t('deposit_with_receipt_page.id_column'),
					field: 'id',
					maxWidth: 112,
					minWidth: 112,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueGetter: ({ node }) => String((node?.childIndex ?? 0) + 1),
				},
				{
					headerName: t('deposit_with_receipt_page.date_column'),
					field: 'receiptDate',
					maxWidth: 144,
					minWidth: 144,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value ?? ''),
				},
				{
					headerName: t('deposit_with_receipt_page.broker_bank_column'),
					field: 'providerType',
					maxWidth: 250,
					minWidth: 250,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
				},
				{
					headerName: t('deposit_with_receipt_page.receipt_number_column'),
					field: 'receiptNumber',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					maxWidth: 250,
					minWidth: 250,
					// valueFormatter: ({ value }) => t('bank_accounts.' + value)
				},
				{
					headerName: t('deposit_with_receipt_page.price_column'),
					field: 'amount',
					maxWidth: 250,
					minWidth: 250,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
				},
				{
					headerName: t('deposit_with_receipt_page.status_column'),
					field: 'state',
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => t(`states.state_${value}`),
				},
				{
					headerName: t('deposit_with_receipt_page.operation_column'),
					field: 'action',
					maxWidth: 200,
					minWidth: 200,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellRenderer: DepositWithReceiptReportsActionCell,
					cellRendererParams: {
						onDeleteRow,
						onEditRow
					}

				},
			] as Array<ColDef<Reports.IDepositWithReceipt>>,
		[],
	);

	const defaultColDef: ColDef<Reports.IDepositWithReceipt> = useMemo(
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
			<AgTable<Reports.IDepositWithReceipt>
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

export default DepositWithReceiptReportsTable;
