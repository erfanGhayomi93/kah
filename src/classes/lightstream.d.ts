export interface SubscriptionOptions {
	mode: 'MERGE' | 'RAW',
	items: string[];
	fields: string[];
	snapshot: boolean;
	dataAdapter: string;
}