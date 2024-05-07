export interface IManageColumnsModal {
	title: React.ReactNode;
	columns: IManageStrategyColumn[];
	applyChangesAfterClose?: boolean;
	onReset?: () => void;
	onColumnChanged: (updatedCol: IManageStrategyColumn, columns: IManageStrategyColumn[]) => void;
}

export interface PanelState {
	manageWatchlistColumns: boolean;

	savedTemplates: boolean;

	symbolInfoPanel: string | null;

	manageTransactionColumnsPanel: boolean;

	manageInstantDepositColumnsPanel: boolean;

	manageColumns: null | IManageColumnsModal;
}
