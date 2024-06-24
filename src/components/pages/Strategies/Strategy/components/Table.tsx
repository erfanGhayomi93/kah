import AgTable, { type AgTableProps } from '@/components/common/Tables/AgTable';
import { type GridApi, type SortChangedEvent } from '@ag-grid-community/core';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import NoTableData from './NoTableData';

interface PaginationProps {
	fetchNextPage: () => void;
	pageSize: number;
	pageNumber: number;
}

interface TableProps<T> extends AgTableProps<T>, PaginationProps {
	columnsVisibility: IManageColumn[];
	isFetching?: boolean;
}

type TableRow = Strategy.AllStrategies;

const Table = forwardRef<GridApi, TableProps<TableRow>>(
	(
		{
			isFetching,
			pageSize,
			pageNumber,
			columnsVisibility,
			rowData = [],
			fetchNextPage,
			defaultColDef = {},
			...props
		},
		ref,
	) => {
		const gridRef = useRef<GridApi<TableRow>>(null);

		const [sorting, setSorting] = useState<{ colId: string; sort: TSortingMethods } | null>(null);

		const onSortChanged = ({ columns }: SortChangedEvent<TableRow>) => {
			try {
				if (!Array.isArray(columns) || columns.length < 1) return;

				const col = columns[0];
				const colId = col.getColId();
				const sort = col.getSort();

				setSorting(sort ? { colId, sort } : null);
			} catch (e) {
				//
			}
		};

		useImperativeHandle(ref, () => gridRef.current!);

		const data = useMemo<TableRow[]>(() => {
			try {
				if (!Array.isArray(rowData)) return [];
				const rows = JSON.parse(JSON.stringify(rowData)) as typeof rowData;

				if (sorting) {
					rows.sort((a, b) => {
						try {
							const { colId, sort } = sorting;
							const valueA = a[colId as keyof Strategy.AllStrategies];
							const valueB = b[colId as keyof Strategy.AllStrategies];

							if (typeof valueA === 'string') {
								if (sort === 'asc') return valueA.localeCompare(valueB as string);
								else return (valueB as string).localeCompare(valueA);
							} else {
								if (sort === 'asc') return (valueB as number) - valueA;
								else return valueA - (valueB as number);
							}
						} catch (e) {
							return 0;
						}
					});
				}

				return rows.slice(0, pageNumber * pageSize);
			} catch (e) {
				return rowData!;
			}
		}, [rowData, sorting, pageNumber, pageSize]);

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
			<div className='relative flex-1'>
				<AgTable<TableRow>
					ref={gridRef}
					className='h-full border-0'
					suppressColumnVirtualisation={false}
					rowHeight={48}
					headerHeight={40}
					rowData={data}
					onSortChanged={onSortChanged}
					defaultColDef={{
						suppressMovable: true,
						sortable: true,
						resizable: false,
						minWidth: 104,
						comparator: (_a, _b) => 0,
						...defaultColDef,
					}}
					onBodyScrollEnd={({ api }) => {
						const lastRowIndex = api.getLastDisplayedRowIndex();
						if ((lastRowIndex + 1) % 20 <= 1) fetchNextPage();
					}}
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
	},
);

export default Table as <TData extends TableRow>(
	props: TableProps<TData> & { ref?: React.Ref<GridApi<TData>> },
) => JSX.Element;
