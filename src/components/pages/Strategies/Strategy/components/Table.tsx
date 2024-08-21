import AgInfiniteTable from '@/components/common/Tables/AgInfiniteTable';
import { type AgTableProps } from '@/components/common/Tables/AgTable';
import { type GridApi, type IGetRowsParams } from '@ag-grid-community/core';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import NoTableData from './NoTableData';

interface TableProps<T> extends AgTableProps<T> {
	columnsVisibility: IManageColumn[];
	isFetching?: boolean;
	dependencies?: unknown[];
}

type TableRow = Strategy.AllStrategies;

const Table = forwardRef<GridApi, TableProps<TableRow>>(
	({ isFetching, columnsVisibility, rowData = [], defaultColDef = {}, dependencies = [], ...props }, ref) => {
		const gridRef = useRef<GridApi<TableRow>>(null);

		const dataRef = useRef<Strategy.AllStrategies[]>(rowData ?? []);

		const getRows = (params: IGetRowsParams) => {
			const newData = [...dataRef.current];

			const rowsThisPage = newData.slice(params.startRow, params.endRow);
			let lastRow = -1;
			if (newData.length <= params.endRow) {
				lastRow = newData.length;
			}

			params.successCallback(rowsThisPage, lastRow);
		};

		const updateDatasource = () => {
			gridRef.current?.setGridOption('datasource', {
				rowCount: rowData?.length,
				getRows,
			});
		};

		useImperativeHandle(ref, () => gridRef.current!);

		const datasourceDependencies = useMemo(() => {
			if (!Array.isArray(rowData) || rowData.length === 0) return [];

			const result = rowData.map((item) => item.marketUnit);
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

		return (
			<div className='relative flex-1'>
				<AgInfiniteTable
					ref={gridRef}
					suppressColumnVirtualisation={false}
					className='h-full border-0'
					defaultColDef={{
						suppressMovable: true,
						sortable: false,
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
