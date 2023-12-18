declare interface ServerResponse<T = unknown> {
	succeeded: boolean;
	errors: null | string[];
	result: T;
}

declare interface PaginationResponse<T = unknown> {
	result: T[];
	totalTotalCount: number;
	pageNumber: number;
	totalPages: number;
	totalCount: number;
	pageSize: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
	succeeded: boolean;
	errors: null | string[];
}
