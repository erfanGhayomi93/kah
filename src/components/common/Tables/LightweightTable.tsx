import { AngleDownSVG, AngleUpSVG } from '@/components/icons';
import { dateFormatter, numFormatter, sepNumbers, toFixed } from '@/utils/helpers';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './LightweightTable.module.scss';

type TSorting<K> = null | { column: IColDef<K>; type: TSortingMethods };

type TValueGetterResult = string | number | boolean;

interface IValueFormatterAPI<K> {
	row: K;
	rowIndex: number;
	value: TValueGetterResult;
}

type TCellValue<K> =
	| { valueType?: 'separate' | 'percent' | 'decimal' | 'date' | 'time' | 'datetime' | 'abbreviations' }
	| { valueFormatter?: (api: IValueFormatterAPI<K>) => React.ReactNode };

type THeaderValue = { headerName: string } | { headerComponent: () => React.ReactNode };

export type IColDef<K> = TCellValue<K> &
	THeaderValue & {
		colId: string;
		cellClass?: ClassesValue | ((data: K) => ClassesValue);
		headerClass?: ClassesValue;
		hidden?: boolean;
		width?: number;
		minWidth?: number;
		maxWidth?: number;
		sort?: TSortingMethods | null;
		sortable?: boolean;
		comparator?: (valueA: TValueGetterResult, valueB: TValueGetterResult, rowA: K, rowB: K) => number;
		onCellClick?: (row: K, e: React.MouseEvent) => void;
		valueGetter: (row: K, rowIndex: number) => TValueGetterResult;
	};

type HeaderCellProps<K> = IColDef<K> & {
	onClick?: (e: React.MouseEvent) => void;
	onSortDetect: (type: TSortingMethods) => void;
	sorting: TSorting<K>;
};

interface RowCellProps<K> {
	column: IColDef<K>;
	row: K;
	rowIndex: number;
}

interface LightweightTableProps<T extends unknown[], K extends unknown> {
	rowData: T;
	headerClass?: string;
	cellClass?: string;
	className?: ClassesValue;
	columnDefs: Array<IColDef<K>>;
	rowHeight?: number;
	headerHeight?: number;
	reverseColors?: boolean;
	onRowClick?: (row: K, e: React.MouseEvent) => void;
	onHeaderClick?: (column: IColDef<K>, e: React.MouseEvent) => void;
}

const LightweightTable = <T extends unknown[], K = ElementType<T>>({
	columnDefs,
	rowData,
	className,
	reverseColors,
	headerClass,
	cellClass,
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
			<table className={clsx(styles.table, reverseColors && styles.reverseColors, className)}>
				<thead className={styles.thead}>
					<tr style={{ height: `${headerHeight}px` }} className={styles.tr}>
						{columnDefs.map((col) => (
							<HeaderCell
								key={col.colId}
								{...col}
								headerClass={clsx(headerClass, col.headerClass)}
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
								<RowCell
									key={col.colId}
									row={row}
									rowIndex={i}
									column={{
										...col,
										cellClass: clsx(col.cellClass, cellClass),
									}}
								/>
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
	...props
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
				{'headerName' in props ? props.headerName : props.headerComponent()}

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

	const getFormattedValue = () => {
		const value = column.valueGetter(row, rowIndex);

		try {
			if ('valueFormatter' in column && typeof column?.valueFormatter === 'function') {
				return column.valueFormatter?.({ row, value, rowIndex });
			}

			if ('valueType' in column && typeof column?.valueType === 'string') {
				const valueAsNumber = Number(value);
				const isNumber = !isNaN(valueAsNumber);

				if (column.valueType === 'separate') {
					return isNumber ? sepNumbers(String(value)) : '−';
				}

				if (column.valueType === 'percent') {
					return isNumber ? `${toFixed(valueAsNumber)}%` : '−';
				}

				if (column.valueType === 'decimal') {
					return isNumber ? toFixed(Number(value), 4) : '−';
				}

				if (column.valueType === 'abbreviations') {
					return isNumber ? numFormatter(valueAsNumber) : '−';
				}

				if (column.valueType === 'date' || column.valueType === 'datetime' || column.valueType === 'time') {
					return typeof value !== 'boolean' ? dateFormatter(value, column.valueType) : '−';
				}
			}
		} catch (e) {
			//
		}

		return value;
	};

	return (
		<td
			key={column.colId}
			onClick={(e) => column.onCellClick?.(row, e)}
			className={clsx(
				styles.td,
				typeof column.cellClass === 'function' ? column.cellClass(row) : column.cellClass,
			)}
		>
			{getFormattedValue()}
		</td>
	);
};

export default LightweightTable;
