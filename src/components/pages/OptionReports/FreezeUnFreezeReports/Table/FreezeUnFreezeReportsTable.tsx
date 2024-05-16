import AgTable from '@/components/common/Tables/AgTable';
import dayjs from '@/libs/dayjs';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef } from 'react';
import FreezeUnFreezeReportsTableActionCell from './FreezeUnFreezeReportsTableActionCell';

interface FreezeUnFreezeReportsTableProps {
	reports: Reports.IFreezeUnfreezeReports[] | null;
	columnsVisibility: FreezeUnFreezeReports.IFreezeUnFreezeReportsColumnsState[];
	setColumnsVisibility: Dispatch<SetStateAction<FreezeUnFreezeReports.IFreezeUnFreezeReportsColumnsState[]>>;
}

const FreezeUnFreezeReportsTable = ({
	reports,
	columnsVisibility,
	setColumnsVisibility,
}: FreezeUnFreezeReportsTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Reports.IFreezeUnfreezeReports>>(null);

	const dateFormatter = (v: string | number) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD');
	};

	const onDeleteRow = async () => {
		//
	};

	const COLUMNS = useMemo<Array<ColDef<Reports.IFreezeUnfreezeReports>>>(
		() =>
			[
				{
					headerName: t('freeze_and_unfreeze_reports_page.id_column'),
					field: 'id',
					pinned: 'right',
					maxWidth: 112,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueGetter: ({ node }) => String((node?.childIndex ?? 0) + 1),
				},
				{
					headerName: t('freeze_and_unfreeze_reports_page.symbol_column'),
					field: 'symbolTitle',
					minWidth: 112,
					lockPosition: true,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => value ?? '',
				},
				{
					headerName: t('freeze_and_unfreeze_reports_page.date_column'),
					field: 'confirmedOn',
					minWidth: 112,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => dateFormatter(value ?? ''),
				},
				{
					headerName: t('freeze_and_unfreeze_reports_page.status_column'),
					field: 'requestState',
					minWidth: 128,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					valueFormatter: ({ value }) => (value ? t('freeze_and_unfreeze_report_page.state' + value) : ''),
				},
				{
					headerName: t('freeze_and_unfreeze_reports_page.action_column'),
					field: 'action',
					maxWidth: 200,
					minWidth: 200,
					initialHide: false,
					suppressMovable: true,
					sortable: false,
					cellRenderer: FreezeUnFreezeReportsTableActionCell,
					cellRendererParams: {
						onDeleteRow,
					},
				},
			] as Array<ColDef<Reports.IFreezeUnfreezeReports>>,
		[],
	);

	const defaultColDef: ColDef<Reports.IFreezeUnfreezeReports> = useMemo(
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
			<AgTable<Reports.IFreezeUnfreezeReports>
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

export default FreezeUnFreezeReportsTable;
