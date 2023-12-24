import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry, createGrid, type GridApi, type GridOptions } from '@ag-grid-community/core';
import clsx from 'clsx';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

ModuleRegistry.register(ClientSideRowModelModule);

interface AgTableProps<TData extends unknown> extends GridOptions<TData> {
	className?: ClassesValue;
	style?: React.CSSProperties;
	theme?: 'quartz' | 'balham' | 'material' | 'alpine';
}

const AgTable = forwardRef<undefined | GridApi<unknown>, AgTableProps<unknown>>(
	({ className, style, theme = 'alpine', ...gridOptions }, ref) => {
		const tableRef = useRef<undefined | GridApi<unknown>>(undefined);

		useImperativeHandle(ref, () => tableRef.current, [tableRef]);

		const onTableLoad = useCallback((eGridDiv: HTMLDivElement | null) => {
			if (!eGridDiv) return;
			tableRef.current = createGrid<unknown>(eGridDiv, {
				rowModelType: 'clientSide',
				suppressColumnVirtualisation: true,
				suppressCellFocus: true,
				suppressAnimationFrame: true,
				suppressScrollOnNewData: true,
				suppressLoadingOverlay: true,
				suppressNoRowsOverlay: true,
				suppressColumnMoveAnimation: true,
				suppressDragLeaveHidesColumns: true,
				animateRows: true,
				enableRtl: true,
				rowBuffer: 5,
				rowHeight: 48,
				headerHeight: 48,
				scrollbarWidth: 8,
				defaultColDef: {
					suppressMovable: true,
					sortable: false,
					resizable: false,
				},
				...gridOptions,
			});
		}, []);

		return <div ref={onTableLoad} className={clsx(`ag-theme-${theme}`, className)} style={style} />;
	},
);

export default AgTable as <TData extends unknown>(props: AgTableProps<TData> & { ref?: React.Ref<GridApi<TData>> }) => JSX.Element;
