import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry, createGrid, type GridApi, type GridOptions } from '@ag-grid-community/core';
import clsx from 'clsx';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

ModuleRegistry.register(ClientSideRowModelModule);

export interface AgTableProps<TData> extends GridOptions<TData> {
	useTransaction?: boolean;
	className?: ClassesValue;
	style?: React.CSSProperties;
	theme?: 'quartz' | 'balham' | 'material' | 'alpine';
}

const AgTable = forwardRef<undefined | GridApi<unknown>, AgTableProps<unknown>>(
	({ className, style, useTransaction = false, theme = 'alpine', rowData, ...gridOptions }, ref) => {
		const gridRef = useRef<undefined | GridApi<unknown>>(undefined);

		useImperativeHandle(ref, () => gridRef.current, [gridRef]);

		const onTableLoad = useCallback((eGridDiv: HTMLDivElement | null) => {
			if (!eGridDiv) return;
			gridRef.current = createGrid<unknown>(eGridDiv, {
				rowModelType: 'clientSide',
				suppressColumnVirtualisation: true,
				suppressCellFocus: true,
				suppressMultiSort: true,
				enableCellTextSelection: true,
				suppressAnimationFrame: true,
				suppressScrollOnNewData: true,
				suppressLoadingOverlay: true,
				suppressNoRowsOverlay: true,
				suppressColumnMoveAnimation: true,
				suppressDragLeaveHidesColumns: true,
				animateRows: true,
				enableRtl: true,
				domLayout: 'normal',
				rowBuffer: 5,
				rowHeight: 48,
				headerHeight: 48,
				scrollbarWidth: 12,
				rowData: rowData ?? [],
				onColumnVisible: ({ api, column }) => {
					try {
						if (!column) return;

						const colId = column.getColId();

						// api.ensureColumnVisible(colId);
						api.flashCells({
							columns: [colId],
						});
					} catch (e) {
						//
					}
				},
				defaultColDef: {
					suppressMovable: true,
					sortable: false,
					resizable: false,
				},
				icons: {
					sortAscending:
						'<svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="36" d="M112 244l144-144 144 144M256 120v292" /></svg>',
					sortDescending:
						'<svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="36" d="M112 268l144 144 144-144M256 392V100" /></svg>',
				},
				...gridOptions,
			});
		}, []);

		useEffect(() => {
			const gridApi = gridRef.current;
			if (useTransaction || !gridApi) return;

			try {
				if (Array.isArray(rowData) && !gridApi.isDestroyed()) gridApi.setGridOption('rowData', rowData);
			} catch (e) {
				//
			}
		}, [rowData]);

		useEffect(
			() => () => {
				try {
					const gridApi = gridRef.current;
					if (gridApi && !gridApi.isDestroyed()) {
						gridApi.destroy();
						gridRef.current = undefined;
					}
				} catch (e) {
					//
				}
			},
			[],
		);

		return <div ref={onTableLoad} className={clsx(`ag-theme-${theme}`, className)} style={style} />;
	},
);

export default AgTable as <TData extends unknown>(
	props: AgTableProps<TData> & { ref?: React.Ref<GridApi<TData>> },
) => JSX.Element;
