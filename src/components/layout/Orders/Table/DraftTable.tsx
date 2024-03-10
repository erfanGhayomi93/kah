import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import AgTable from '@/components/common/Tables/AgTable';
import { dateFormatter, days, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import NoData from '../NoData';
import SymbolTitleCell from '../common/SymbolTitleCell';
import SymbolTitleHeader from '../common/SymbolTitleHeader';

interface DraftTableProps {
	setSelectedRows: (orders: Order.TOrder[]) => void;
	data: Order.DraftOrder[];
	loading: boolean;
}

const DraftTable = ({ setSelectedRows, loading, data }: DraftTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Order.DraftOrder>>(null);

	const columnDefs = useMemo<Array<ColDef<Order.DraftOrder>>>(
		() => [
			{
				colId: 'symbol_title',
				headerName: t('orders.symbol_title'),
				cellClass: 'justify-end text-right',
				headerComponent: SymbolTitleHeader,
				cellRenderer: SymbolTitleCell,
				checkboxSelection: true,
				headerCheckboxSelection: true,
				valueGetter: ({ data }) => data!.symbolTitle,
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},
			{
				colId: 'order_side',
				headerName: t('orders.order_side'),
				valueGetter: ({ data }) => data!.side,
				valueFormatter: ({ value }) => (value === 'Buy' ? t('side.buy') : t('side.sell')),
				cellClass: ({ data }) => {
					switch (data!.side) {
						case 'Buy':
							return 'text-success-100';
						case 'Sell':
							return 'text-error-100';
						default:
							return '';
					}
				},
			},
			{
				colId: 'order_status',
				headerName: t('orders.order_status'),
				minWidth: 200,
				valueFormatter: () => t('orders.draft'),
				cellClass: 'text-secondary-300',
			},
			{
				colId: 'count',
				headerName: t('orders.count'),
				valueGetter: ({ data }) => data!.quantity ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'price',
				headerName: t('orders.price'),
				valueGetter: ({ data }) => data!.price ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
			},
			{
				colId: 'create_date',
				headerName: t('orders.create_date'),
				valueGetter: ({ data }) => data!.date,
				valueFormatter: ({ value }) => dateFormatter(value, 'datetime'),
			},
			{
				colId: 'validity',
				headerName: t('orders.validity'),
				valueFormatter: ({ data }) => {
					const { validity, validityDate } = data!;

					if (validity === 'GoodTillDate') {
						const tt = new Date(validityDate).getTime();
						const d = days(Date.now(), tt);

						if (d === 0) return t('validity_date.today');
						if (d === 1) return t('validity_date.tomorrow');

						return dateFormatter(tt, 'date');
					}

					return t('validity_date.' + validity.toLowerCase());
				},
			},
		],
		[JSON.stringify(data)],
	);

	const defaultColDef: ColDef<Order.DraftOrder> = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			flex: 1,
		}),
		[],
	);

	const unselectAll = () => {
		const eGrid = gridRef.current;
		if (!eGrid) return;

		eGrid.deselectAll();
	};

	useLayoutEffect(() => {
		ipcMain.handle('deselect_orders', unselectAll);

		return () => {
			ipcMain.removeHandler('deselect_orders', unselectAll);
		};
	}, []);

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid) return;

		try {
			eGrid.setGridOption('rowData', data);
		} catch (e) {
			//
		}
	}, [data]);

	return (
		<>
			<AgTable<Order.DraftOrder>
				ref={gridRef}
				rowData={data}
				rowHeight={40}
				headerHeight={48}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				suppressRowClickSelection={false}
				onSelectionChanged={(e) => setSelectedRows(e.api.getSelectedRows() ?? [])}
				rowClass='cursor-pointer'
				className='h-full border-0'
				rowSelection='multiple'
			/>

			{(loading || data.length === 0) && (
				<div
					className='absolute left-0 w-full flex-justify-center'
					style={{ backdropFilter: 'blur(2px)', top: '48px', height: 'calc(100% - 48px)', zIndex: 9 }}
				>
					{loading ? <Loading /> : data.length === 0 ? <NoData /> : null}
				</div>
			)}
		</>
	);
};

export default DraftTable;
