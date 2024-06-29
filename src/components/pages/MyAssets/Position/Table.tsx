import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useMemo, useRef } from 'react';

import NoData from '@/components/common/NoData';
import AgTable from '@/components/common/Tables/AgTable';
import { useTranslations } from 'next-intl';

interface TableProps {
	type: TOptionSides;
}

const Table = ({ type }: TableProps) => {
	const t = useTranslations('my_assets');

	const gridRef = useRef<GridApi<unknown>>(null);

	const columnDefs = useMemo<Array<ColDef<unknown>>>(
		() => [
			{
				colId: 'index',
				headerName: t('col_index'),
				pinned: 'right',
				minWidth: 72,
				maxWidth: 72,
			},
			{
				colId: 'symbol',
				headerName: t('col_symbol'),
				minWidth: 120,
			},
			{
				colId: 'action',
				headerName: t('col_action'),
				pinned: 'left',
				minWidth: 144,
				maxWidth: 144,
			},
		],
		[],
	);

	const defaultColDef: ColDef = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			flex: 1,
			minWidth: 128,
		}),
		[],
	);

	return (
		<div className='flex-1 gap-16 flex-column'>
			<h2 className='text-base font-medium text-light-gray-700'>
				{t('positions_title')}{' '}
				<span className={type === 'call' ? 'text-light-success-100' : 'text-light-error-100'}>{t(type)}</span>
			</h2>

			<div className='relative w-full flex-1'>
				<AgTable
					ref={gridRef}
					rowData={[]}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					className={`h-full border-0 border-${type}`}
				/>

				<div className='absolute center'>
					<NoData />
				</div>
			</div>
		</div>
	);
};

export default Table;
