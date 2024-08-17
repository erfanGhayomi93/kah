type TExecuteStrategyFieldName = 'bestSellLimitPrice_1' | 'bestBuyLimitPrice_1';

declare interface IpcMainChannels {
	send_order: IOFields;
	send_orders: IOFields[];
	order_sent: { id: string | undefined; response: Order.Response | 'error' };
	set_option_watchlist_filters: Omit<IOptionWatchlistFilters, 'priceBasis' | 'term' | 'sort'>;
	set_transactions_filters: Omit<Transaction.ITransactionsFilters, 'pageNumber' | 'pageSize'>;
	set_option_watchlist_columns: Option.Column[];
	set_instant_deposit_reports_filters: Omit<
		InstantDepositReports.IInstantDepositReportsFilters,
		'pageNumber' | 'pageSize'
	>;
	set_deposit_with_receipt_filters: Omit<
		DepositWithReceiptReports.DepositWithReceiptReportsFilters,
		'pageNumber' | 'pageSize'
	>;
	set_freeze_and_unfreeze_filters: Omit<
		FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters,
		'pageNumber' | 'pageSize'
	>;
	set_withdrawal_cash_reports_filters: Omit<
		WithdrawalCashReports.WithdrawalCashReportsFilters,
		'pageNumber' | 'pageSize'
	>;
	set_changeBroker_reports_filters: Omit<ChangeBrokerReports.IChangeBrokerReportsFilters, 'pageNumber' | 'pageSize'>;
	set_cash_settlement_reports_filters: Omit<
		CashSettlementReports.ICashSettlementReportsFilters,
		'pageNumber',
		'pageSize'
	>;
	set_physical_settlement_reports_filters: Omit<
		PhysicalSettlementReports.IPhysicalSettlementReportsFilters,
		'pageNumber' | 'pageSize'
	>;
	set_orders_reports_filters: Omit<OrdersReports.IOrdersReportsFilters, 'pageNumber' | 'pageSize'>;
	set_trades_reports_filters: Omit<OrdersReports.ITradesReportsFilters, 'pageNumber' | 'pageSize'>;
	deselect_orders: undefined;
	'broker:logged_out': undefined;
	'home.hide_section': { id: TDashboardSections; hidden: boolean };
}
