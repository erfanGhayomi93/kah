declare interface IpcMainChannels {
	saturn_contract_added: Array<{
		symbolISIN: string;
		symbolTitle: string;
		activeTab: Saturn.OptionTab;
	}>;
	send_order: IOFields;
}
