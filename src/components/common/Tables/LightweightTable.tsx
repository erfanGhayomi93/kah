import clsx from 'clsx';
import React from 'react';
import styles from './LightweightTable.module.scss';

export interface IColDef<T> {
	headerName: string;
	cellClass?: ClassesValue | ((data: T) => ClassesValue);
	headerClass?: ClassesValue;
	onCellClick?: (row: T, e: React.MouseEvent) => void;
	valueFormatter: (row: T) => React.ReactNode;
}

interface LightweightTableProps<T extends unknown[], K extends unknown> {
	rowData: T;
	className?: ClassesValue;
	columnDefs: Array<IColDef<K>>;
}

const LightweightTable = <T extends unknown[], K = ElementType<T>>({
	columnDefs,
	rowData,
	className,
}: LightweightTableProps<T, K>) => {
	return (
		<table className={clsx(styles.table, className)}>
			<thead className={styles.thead}>
				<tr className={styles.tr}>
					{columnDefs.map((item, i) => (
						<th className={clsx(styles.th, item.headerClass)} key={i}>
							{item.headerName}
						</th>
					))}
				</tr>
			</thead>
			<tbody className={styles.tbody}>
				{rowData.map((row, i) => (
					<tr className={styles.tr} key={i}>
						{columnDefs.map((col, i) => (
							<td
								onClick={(e) => col.onCellClick?.(row as K, e)}
								className={clsx(
									styles.td,
									typeof col.cellClass === 'function' ? col.cellClass(row as K) : col.cellClass,
								)}
								key={i}
							>
								{col.valueFormatter(row as K)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default LightweightTable;
