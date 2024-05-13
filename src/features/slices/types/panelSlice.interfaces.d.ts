export interface IManageColumnsModal {
	initialColumns?: IManageColumn[];
	title: React.ReactNode;
	columns: IManageColumn[];
	applyChangesAfterClose?: boolean;
	onReset?: () => void;
	onColumnChanged: (updatedCol: IManageColumn, columns: IManageColumn[]) => void;
}

export interface PanelState {
	manageWatchlistColumns: boolean;

	savedTemplates: boolean;

	symbolInfoPanel: string | null;

	manageTransactionColumnsPanel: boolean;

	manageInstantDepositColumnsPanel: boolean;

	manageColumns: null | IManageColumnsModal;
}
