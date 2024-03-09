import AgTable from '@/components/common/Tables/AgTable';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useMemo, useRef } from 'react';

type TOrders = Order.OpenOrder | Order.ExecutedOrder | Order.TodayOrder | Order.OptionOrder | Order.DraftOrder;

interface TableProps {
	tab: TOrdersTab;
	data: TOrders[];
}

const Table = ({ tab, data }: TableProps) => {
	const gridRef = useRef<GridApi<TOrders>>(null);

	const columnDefs = useMemo<Array<ColDef<TOrders>>>(() => [], [JSON.stringify(data)]);

	const defaultColDef: ColDef<TOrders> = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			flex: 1,
		}),
		[],
	);

	return (
		<AgTable<TOrders>
			ref={gridRef}
			rowData={data}
			columnDefs={columnDefs}
			defaultColDef={defaultColDef}
			suppressRowClickSelection={false}
			rowClass='cursor-pointer'
			className='h-full border-0'
			rowSelection='multiple'
		/>
	);
};

export default Table;
