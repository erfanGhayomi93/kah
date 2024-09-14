import AgInfiniteTable from '@/components/common/Tables/AgInfiniteTable';
import { type AgTableProps } from '@/components/common/Tables/AgTable';
import { type GridApi, type IGetRowsParams } from '@ag-grid-community/core';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import NoTableData from './NoTableData';

interface TableProps<T> extends AgTableProps<T> {
	columnsVisibility: IManageColumn[];
	isFetching?: boolean;
	dependencies?: unknown[];
	setHashTable?: (data: string[]) => void;
}

type TableRow = Strategy.AllStrategies;

const Table = forwardRef<GridApi, TableProps<TableRow>>(
	(
		{ isFetching, columnsVisibility, setHashTable, rowData = [], defaultColDef = {}, dependencies = [], ...props },
		ref,
	) => {
		const gridRef = useRef<GridApi<TableRow>>(null);

		const dataRef = useRef<Strategy.AllStrategies[]>(rowData ?? []);

		const getRows = (params: IGetRowsParams) => {
			const newData = [...dataRef.current];
			const sortModel = params.sortModel[0];

			try {
				if (sortModel) {
					const { colId, sort } = sortModel;
					newData.sort((a, b) => {
						if (colId in a && colId in b) {
							const valueA = a[colId as keyof typeof a];
							const valueB = b[colId as keyof typeof b];

							return compare(valueA, valueB, sort);
						}

						if (colId in a && colId in b) {
							const valueA = a[colId as keyof typeof a];
							const valueB = b[colId as keyof typeof b];

							return compare(valueA, valueB, sort);
						}

						return 0;
					});
				}
			} catch (e) {
				//
			}

			const rowsThisPage = newData.slice(params.startRow, params.endRow);
			let lastRow = -1;
			if (newData.length <= params.endRow) {
				lastRow = newData.length;
			}

			setHashTable?.(newData.slice(0, params.endRow).map((item) => item.key));
			params.successCallback(rowsThisPage, lastRow);
		};

		const updateDatasource = () => {
			gridRef.current?.setGridOption('datasource', {
				rowCount: rowData?.length,
				getRows,
			});
		};

		const compare = (
			valueA: string | number | boolean,
			valueB: string | number | boolean,
			sorting: 'asc' | 'desc',
		): number => {
			try {
				if (typeof valueA === 'string' && typeof valueB === 'string') {
					if (sorting === 'asc') return valueA.localeCompare(valueB);
					return valueB.localeCompare(valueA);
				}

				if (typeof valueA === 'number' && typeof valueB === 'number') {
					if (sorting === 'asc') return valueB - valueA;
					return valueA - valueB;
				}
			} catch (e) {
				//
			}

			return 0;
		};

		const datasourceDependencies = useMemo(() => {
			if (!Array.isArray(rowData) || rowData.length === 0) return [];

			const result = rowData.map((item) => item.baseMarketUnit);
			result.sort((a, b) => b.localeCompare(a));

			return result;
		}, [rowData]);

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

		useEffect(() => {
			dataRef.current = rowData ?? [];
		}, [rowData]);

		useEffect(() => {
			updateDatasource();
		}, [datasourceDependencies.join(',')]);

		useImperativeHandle(ref, () => gridRef.current!);

		return (
			<div className='relative flex-1'>
				<AgInfiniteTable
					ref={gridRef}
					suppressColumnVirtualisation={false}
					className='h-full border-0'
					getRowId={({ data }) => data.key}
					defaultColDef={{
						suppressMovable: true,
						resizable: false,
						minWidth: 104,
						comparator: (_a, _b) => 0,
						...defaultColDef,
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

				{!rowData?.length && !isFetching && <NoTableData />}
			</div>
		);
	},
);

export default Table as <TData extends TableRow>(
	props: TableProps<TData> & { ref?: React.Ref<GridApi<TData>> },
) => JSX.Element;
