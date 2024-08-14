import { type FetchNextPageOptions, type InfiniteData, type InfiniteQueryObserverResult } from '@tanstack/react-query';
import { type AxiosError } from 'axios';

export type InfiniteQueryResult<T> = (
	options?: FetchNextPageOptions,
) => Promise<InfiniteQueryObserverResult<InfiniteData<PaginationResponse<T[]>, unknown>, AxiosError>>;
