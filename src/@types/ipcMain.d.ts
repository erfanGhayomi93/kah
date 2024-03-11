declare interface IpcMainChannels {
	saturn_contract_added: Array<{
		symbolISIN: string;
		symbolTitle: string;
		activeTab: Saturn.OptionTab;
	}>;
	send_order: IOFields;
	send_orders: IOFields[];
	set_option_watchlist_filters: IOptionWatchlistFilters;
	refetch_active_order_tab: undefined;
	set_selected_orders: Order.TOrder[];
	deselect_orders: undefined;
}
