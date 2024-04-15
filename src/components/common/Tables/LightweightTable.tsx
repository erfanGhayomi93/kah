import clsx from 'clsx';
import styles from './LightweightTable.module.scss';

export interface IColDef<T> {
	headerName: string;
	cellClass?: ClassesValue;
	headerClass?: ClassesValue;
	valueFormatter: (row: T) => React.ReactNode;
}

interface LightweightTableProps<T extends unknown> {
	rowData: T[];
	columnDefs: Array<IColDef<T>>;
}

const LightweightTable = <T extends unknown>({ columnDefs, rowData }: LightweightTableProps<T>) => {
	return (
		<table className={styles.table}>
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
				{rowData.map((cell, i) => (
					<tr className={styles.tr} key={i}>
						{columnDefs.map((col, i) => (
							<td className={clsx(styles.td, col.cellClass)} key={i}>
								{col.valueFormatter(cell)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default LightweightTable;
