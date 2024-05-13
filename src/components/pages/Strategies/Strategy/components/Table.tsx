import Loading from '@/components/common/Loading';
import AgTable, { type AgTableProps } from '@/components/common/Tables/AgTable';
import { type GridApi } from '@ag-grid-community/core';
import { forwardRef } from 'react';
import NoTableData from './NoTableData';

interface TableProps<T> extends AgTableProps<T> {
	isFetching?: boolean;
}

const Table = forwardRef<GridApi, TableProps<unknown>>(({ isFetching, rowData, defaultColDef = {}, ...props }, ref) => {
	const data = rowData ?? [];

	return (
		<>
			<AgTable<unknown>
				ref={ref}
				suppressColumnVirtualisation={false}
				rowHeight={40}
				headerHeight={48}
				rowData={data}
				defaultColDef={{
					suppressMovable: true,
					sortable: true,
					resizable: false,
					minWidth: 104,
					...defaultColDef,
				}}
				className='h-full border-0'
				{...props}
			/>

			{isFetching && <Loading />}
			{data.length === 0 && !isFetching && <NoTableData />}
		</>
	);
});

export default Table as <TData extends unknown>(
	props: TableProps<TData> & { ref?: React.Ref<GridApi<TData>> },
) => JSX.Element;
