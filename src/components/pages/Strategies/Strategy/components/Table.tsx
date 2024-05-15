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
		<div className='relative flex-1'>
			<AgTable<unknown>
				ref={ref}
				suppressColumnVirtualisation={false}
				rowHeight={48}
				headerHeight={40}
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

			{isFetching && (
				<div
					style={{ backdropFilter: 'blur(1px)' }}
					className='absolute left-0 top-0 size-full flex-justify-center'
				>
					<div className='size-48 spinner' />
				</div>
			)}
			{data.length === 0 && !isFetching && <NoTableData />}
		</div>
	);
});

export default Table as <TData extends unknown>(
	props: TableProps<TData> & { ref?: React.Ref<GridApi<TData>> },
) => JSX.Element;
