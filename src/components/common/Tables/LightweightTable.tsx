import styles from './LightweightTable.module.scss';

export interface IColDef<T> {
	headerName: string;
	colId: string | number;
	valueFormatter: (row: T) => React.ReactNode;
}

interface LightweightTableProps<T extends unknown> {
	rowData: T[];
	columnDefs: Array<IColDef<T>>;
	getRowId?: (row: T, index: number) => string | number;
}

const LightweightTable = <T extends unknown>(props: LightweightTableProps<T>) => {
	return <table className={styles.table}></table>;
};

export default LightweightTable;
