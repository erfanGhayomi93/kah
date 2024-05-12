declare interface IpcMainChannels {
	send_order: IOFields;
	send_orders: IOFields[];
	order_sent: { id: string | undefined; response: Order.Response | 'error' };
	set_option_watchlist_filters: IOptionWatchlistFilters;
	set_transactions_filters: Omit<Transaction.ITransactionsFilters, 'pageNumber' | 'pageSize'>;
	refetch_active_order_tab: undefined;
	set_selected_orders: Order.TOrder[];
	set_instant_deposit_reports_filters: Omit<
		InstantDepositReports.IInstantDepositReportsFilters,
		'pageNumber' | 'pageSize'
	>;
	set_deposit_with_receipt_filters: Omit<
		DepositWithReceiptReports.DepositWithReceiptReportsFilters,
		'pageNumber' | 'pageSize'
	>;
	set_withdrawal_cash_filters: Omit<WithdrawalCashReports.WithdrawalCashReportsFilters, 'pageNumber' | 'pageSize'>;
	set_changeBroker_reports_filters: Omit<ChangeBrokerReports.IChangeBrokerReportsFilters, "pageNumber" | "pageSize">;
	deselect_orders: undefined;
	'home.hide_section': { id: TDashboardSections; hidden: boolean };
}
