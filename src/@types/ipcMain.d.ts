declare interface IpcMainChannels {
	saturn_contract_added: Array<{
		symbolISIN: string;
		symbolTitle: string;
		activeTab: Saturn.OptionTab;
	}>;
	send_order: IOFields;
	set_option_watchlist_filters: IOptionWatchlistFilters;
	refetch_active_order_tab: undefined;
}
