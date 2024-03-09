import AgTable from '@/components/common/Tables/AgTable';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';

interface OptionTableProps {
	data: Order.OptionOrder[];
}

const OptionTable = ({ data }: OptionTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Order.OptionOrder>>(null);

	const columnDefs = useMemo<Array<ColDef<Order.OptionOrder>>>(
		() => [
			{
				colId: 'symbol_title',
				headerName: t('orders.symbol_title'),
				cellClass: 'justify-end text-right',
				valueGetter: ({ data }) => data!.symbolTitle,
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},
			{
				colId: 'order_side',
				headerName: t('orders.order_side'),
				valueGetter: ({ data }) => data!.side,
				valueFormatter: ({ value }) => (value === 'Call' ? t('side.buy') : t('side.sell')),
				cellClass: ({ data }) => {
					switch (data!.side) {
						case 'Call':
							return 'text-success-100';
						case 'Put':
							return 'text-error-100';
						default:
							return '';
					}
				},
			},
			{
				colId: 'position_count',
				headerName: t('orders.position_count'),
				valueGetter: ({ data }) => Math.max(0, data!.positionCount),
				valueFormatter: ({ value }) => sepNumbers(String(value ?? 0)),
			},
			{
				colId: 'variation_margin',
				headerName: t('orders.variation_margin'),
				minWidth: 144,
				flex: 1,
				valueGetter: ({ data }) => data!.variationMargin,
				valueFormatter: ({ value }) => sepNumbers(String(value ?? 0)),
			},
			{
				colId: 'physical_settlement_date',
				headerName: t('orders.physical_settlement_date'),
				minWidth: 144,
				flex: 1,
				valueGetter: ({ data }) => data!.physicalSettlementDate,
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
			},
			{
				colId: 'strike_price',
				headerName: t('orders.strike_price'),
				minWidth: 144,
				flex: 1,
				valueGetter: ({ data }) => data!.strikePrice,
				valueFormatter: ({ value }) => sepNumbers(String(value ?? 0)),
			},
			{
				colId: 'remain_days',
				headerName: t('orders.remain_days'),
				minWidth: 160,
				flex: 1,
				valueGetter: ({ data }) => Math.max(0, data!.remainDays),
			},
		],
		[JSON.stringify(data)],
	);

	const defaultColDef: ColDef<Order.OptionOrder> = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			flex: 1,
		}),
		[],
	);

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
		<AgTable<Order.OptionOrder>
			ref={gridRef}
			rowData={data}
			rowHeight={40}
			headerHeight={48}
			columnDefs={columnDefs}
			defaultColDef={defaultColDef}
			suppressRowClickSelection={false}
			rowClass='cursor-pointer'
			className='h-full border-0'
			rowSelection='multiple'
		/>
	);
};

export default OptionTable;
