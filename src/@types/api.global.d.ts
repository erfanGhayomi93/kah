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
