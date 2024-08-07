declare interface ServerResponse<T = unknown> {
	succeeded: boolean;
	errors: null | [string];
	result: T;
}

declare interface PaginationResponse<T = unknown> extends PaginationParams {
	result: T;
	pageSize: number;
	succeeded: boolean;
	errors: null | [string];
}

declare interface PaginationParams {
	pageNumber: number;
	totalPages: number;
	totalCount: number;
	pageSize: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}

declare interface TransactionPaginationParams {
	succeeded: boolean;
	errors: string[];
	customerWltRemain: number;
	customerBond: number;
	customerBondProfit: number;
	customerLoan: number;
	customerLoanInterest: number;
	customerLastRemain: number;
	result: Reports.ITransactions[];
	pageSize: number;
	pageNumber: number;
	offset: number;
	total: number;
}

declare type APIEndpoints = Record<'oauth' | 'rlc' | 'pushengine', string>;
