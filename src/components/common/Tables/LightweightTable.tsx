import { AngleDownSVG, AngleUpSVG } from '@/components/icons';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './LightweightTable.module.scss';

type TSorting<K> = null | { column: IColDef<K>; type: TSortingMethods };

type TValueGetterResult = string | number | boolean;

interface IFValueFormatter<K> {
	row: K;
	rowIndex: number;
	value: TValueGetterResult;
}

export interface IColDef<K> {
	colId: string;
	headerName: string;
	cellClass?: ClassesValue | ((data: K) => ClassesValue);
	headerClass?: ClassesValue;
	hidden?: boolean;
	width?: number;
	minWidth?: number;
	maxWidth?: number;
	sort?: TSortingMethods | null;
	sortable?: boolean; // !== false
	comparator?: (valueA: TValueGetterResult, valueB: TValueGetterResult, rowA: K, rowB: K) => number;
	onCellClick?: (row: K, e: React.MouseEvent) => void;
	valueGetter: (row: K, rowIndex: number) => TValueGetterResult;
	valueFormatter?: (api: IFValueFormatter<K>) => React.ReactNode;
}

interface HeaderCellProps<K> extends IColDef<K> {
	onClick?: (e: React.MouseEvent) => void;
	onSortDetect: (type: TSortingMethods) => void;
	sorting: TSorting<K>;
}

interface RowCellProps<K> {
	column: IColDef<K>;
	row: K;
	rowIndex: number;
}

interface LightweightTableProps<T extends unknown[], K extends unknown> {
	rowData: T;
	className?: ClassesValue;
	columnDefs: Array<IColDef<K>>;
	rowHeight?: number;
	headerHeight?: number;
	onRowClick?: (row: K, e: React.MouseEvent) => void;
	onHeaderClick?: (column: IColDef<K>, e: React.MouseEvent) => void;
}

const LightweightTable = <T extends unknown[], K = ElementType<T>>({
	columnDefs,
	rowData,
	className,
	rowHeight = 48,
	headerHeight = 48,
	onRowClick,
	onHeaderClick,
}: LightweightTableProps<T, K>) => {
	const [sorting, setSorting] = useState<TSorting<K>>(null);

	const onClickHeaderCell = (column: IColDef<K>, e: React.MouseEvent) => {
		try {
			onHeaderClick?.(column, e);
		} catch (e) {
			//
		}

		if (column.sortable === false) return;

		if (!sorting || sorting.column.colId !== column.colId) {
			setSorting({
				column: { ...column },
				type: 'asc',
			});
		} else {
			setSorting((prev) => {
				if (prev!.type === 'desc') return null;
				return {
					...prev!,
					type: 'desc',
				};
			});
		}
	};

	const defaultComparator = (valueA: TValueGetterResult, valueB: TValueGetterResult) => {
		if (typeof valueA === 'string' || typeof valueB === 'string')
			return String(valueA).localeCompare(String(valueB));
		return Number(valueA) - Number(valueB);
	};

	const onSortDetect = (type: TSortingMethods, column: IColDef<K>) => {
		if (column.hidden) return;

		setSorting({
			column,
			type,
		});
	};

	const rowDataMapper = useMemo(() => {
		const data = JSON.parse(JSON.stringify(rowData)) as K[];
		if (!sorting) return data;

		const comparator = (a: K, b: K): number => {
			const { column, type } = sorting;

			const valueA = column.valueGetter(a, 0);
			const valueB = column.valueGetter(b, 0);

			let sortingResult = 0;

			if (column.comparator) sortingResult = column.comparator(valueA, valueB, a, b);
			else sortingResult = defaultComparator(valueA, valueB);

			if (type === 'desc') sortingResult *= -1;

			return sortingResult;
		};

		data.sort(comparator);

		return data;
	}, [rowData, sorting]);

	return (
		<div className={styles.wrapper}>
			<table className={clsx(styles.table, className)}>
				<thead className={styles.thead}>
					<tr style={{ height: `${headerHeight}px` }} className={styles.tr}>
						{columnDefs.map((col) => (
							<HeaderCell
								key={col.colId}
								{...col}
								sorting={sorting}
								onSortDetect={(sortType) => onSortDetect(sortType, col)}
								onClick={(e) => onClickHeaderCell(col, e)}
							/>
						))}
					</tr>
				</thead>

				<tbody className={styles.tbody}>
					{rowDataMapper.map((row, i) => (
						<tr
							style={{
								height: `${rowHeight}px`,
							}}
							onClick={(e) => onRowClick?.(row, e)}
							className={styles.tr}
							key={i}
						>
							{columnDefs.map((col) => (
								<RowCell key={col.colId} column={col} row={row} rowIndex={i} />
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const HeaderCell = <K,>({
	colId,
	headerName,
	headerClass,
	hidden,
	minWidth,
	maxWidth,
	width,
	sort,
	sorting,
	sortable,
	onClick,
	onSortDetect,
}: HeaderCellProps<K>) => {
	const sortingColId = sorting?.column.colId ?? undefined;

	useEffect(() => {
		if (sort) onSortDetect(sort);
	}, [sort]);

	if (hidden) return null;

	return (
		<td
			style={{
				minWidth: minWidth ? `${minWidth}px` : undefined,
				maxWidth: maxWidth ? `${maxWidth}px` : undefined,
				width: width ? `${width}px` : '64px',
			}}
			onClick={(e) => onClick?.(e)}
			className={clsx(styles.th, sortable !== false && styles.selectable, headerClass)}
		>
			<div className={styles.cell}>
				<span>{headerName}</span>
				{sorting !== null && sortingColId === colId && (
					<div className={styles.icon}>
						{sorting.type === 'desc' ? (
							<AngleDownSVG width='1.4rem' height='1.4rem' />
						) : (
							<AngleUpSVG width='1.4rem' height='1.4rem' />
						)}
					</div>
				)}
			</div>
		</td>
	);
};

const RowCell = <K,>({ column, row, rowIndex }: RowCellProps<K>) => {
	if (column.hidden) return null;

	const value = column.valueGetter(row, rowIndex);

	return (
		<td
			key={column.colId}
			onClick={(e) => column.onCellClick?.(row, e)}
			className={clsx(
				styles.td,
				typeof column.cellClass === 'function' ? column.cellClass(row) : column.cellClass,
			)}
		>
			{typeof column?.valueFormatter === 'function' ? column.valueFormatter?.({ row, value, rowIndex }) : value}
		</td>
	);
};

export default LightweightTable;
