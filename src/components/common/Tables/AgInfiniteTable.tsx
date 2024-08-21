import { onBodyScroll } from '@/utils/table';
import { createGrid, ModuleRegistry, type GridApi, type GridOptions } from '@ag-grid-community/core';
import { type FetchNextPageOptions, type InfiniteData, type InfiniteQueryObserverResult } from '@tanstack/react-query';
import { InfiniteRowModelModule } from 'ag-grid-community';
import { type AxiosError } from 'axios';
import clsx from 'clsx';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

ModuleRegistry.registerModules([InfiniteRowModelModule]);

export interface AgTableProps<TData> extends GridOptions<TData> {
	useTransaction?: boolean;
	className?: ClassesValue;
	style?: React.CSSProperties;
	theme?: 'quartz' | 'balham' | 'material' | 'alpine';
}

const AgInfiniteTable = forwardRef<undefined | GridApi<unknown>, AgTableProps<unknown>>(
	({ className, style, useTransaction = false, theme = 'alpine', rowData, ...gridOptions }, ref) => {
		const gridRef = useRef<undefined | GridApi<unknown>>(undefined);

		useImperativeHandle(ref, () => gridRef.current, [gridRef]);

		const onTableLoad = useCallback((eGridDiv: HTMLDivElement | null) => {
			if (!eGridDiv) return;

			gridRef.current = createGrid<unknown>(eGridDiv, {
				rowModelType: 'infinite',
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
				infiniteInitialRowCount: 0,
				maxBlocksInCache: 10,
				maxConcurrentDatasourceRequests: 1,
				cacheOverflowSize: 2,
				cacheBlockSize: 50,
				onColumnVisible: ({ api, column }) => {
					try {
						if (!column) return;

						api.flashCells({
							columns: [column.getColId()],
						});
					} catch (e) {
						//
					}
				},
				onBodyScroll,
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

export type InfiniteQueryResult<T> = (
	options?: FetchNextPageOptions,
) => Promise<InfiniteQueryObserverResult<InfiniteData<PaginationResponse<T[]>, unknown>, AxiosError>>;

export default AgInfiniteTable as <TData extends unknown>(
	props: AgTableProps<TData> & { ref?: React.Ref<GridApi<TData>> },
) => JSX.Element;
