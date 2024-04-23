declare interface IpcMainChannels {
	send_order: IOFields;
	send_orders: IOFields[];
	order_sent: { id: string | undefined; response: Order.Response | 'error' };
	set_option_watchlist_filters: IOptionWatchlistFilters;
	refetch_active_order_tab: undefined;
	set_selected_orders: Order.TOrder[];
	deselect_orders: undefined;
	'home.hide_section': { id: TDashboardSections; hidden: boolean };
}
