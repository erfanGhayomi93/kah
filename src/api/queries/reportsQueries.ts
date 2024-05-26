import { store } from '@/api/inject-store';
import {
	initialCashSettlementReportsFilters,
	initialChangeBrokerReportsFilters,
	initialDepositWithReceiptReportsFilters,
	initialFreezeUnFreezeReportsFilters,
	initialInstantDepositReportsFilters,
	initialOrdersReportsFilters,
	initialPhysicalSettlementReportsFilters,
	initialTradesReportsFilters,
	initialTransactionsFilters,
	initialWithdrawalCashReportsFilters,
} from '@/constants';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import dayjs from '@/libs/dayjs';
import { createQuery, setHours, toISOStringWithoutChangeTime } from '@/utils/helpers';
import brokerAxios from '../brokerAxios';

export const useTransactionsReportsQuery = createQuery<
	PaginationResponse<Reports.ITransactions[]> | null,
	['transactionsReport', Transaction.ITransactionsFilters]
>({
	staleTime: 18e5,
	queryKey: ['transactionsReport', initialTransactionsFilters],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const url = getBrokerURLs(store.getState());
			if (!url) return null;

			const [
				,
				{ fromDate, fromPrice, groupMode, pageNumber, pageSize, symbol, toDate, toPrice, transactionType },
			] = queryKey;

			const params: Record<string, string | string[]> = {
				'QueryOption.PageNumber': String(pageNumber),
				'QueryOption.PageSize': String(pageSize),
				fromDate: toISOStringWithoutChangeTime(setHours(new Date(fromDate), 0, 0)),
				toDate: toISOStringWithoutChangeTime(setHours(new Date(toDate), 23, 59, 59)),
				GroupMode: groupMode,
			};

			if (symbol) params.symbolISIN = symbol.symbolISIN;
			if (fromPrice) params.FromPrice = String(fromPrice);
			if (toPrice) params.ToPrice = String(toPrice);

			if (Array.isArray(transactionType) && transactionType.length > 0) {
				params.TransactionType = [];
				transactionType.forEach((type) => {
					(params.TransactionType as string[]).push(type.id);
				});
			}

			const response = await brokerAxios.get(url.customerTurnOverRemain, {
				params,
				signal,
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data;
		} catch (e) {
			return null;
		}
	},
});

export const useInstantDepositReports = createQuery<
	PaginationResponse<Reports.IInstantDeposit[]> | null,
	['instantDepositReports', InstantDepositReports.IInstantDepositReportsFilters]
>({
	staleTime: 18e5,
	queryKey: ['instantDepositReports', initialInstantDepositReportsFilters],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const url = getBrokerURLs(store.getState());
			if (!url) return null;

			const [, { fromDate, fromPrice, pageNumber, pageSize, providers, status, toDate, toPrice }] = queryKey;

			const params: Record<string, string | string[]> = {
				'QueryOption.PageNumber': String(pageNumber),
				'QueryOption.PageSize': String(pageSize),
				startDate: toISOStringWithoutChangeTime(setHours(new Date(fromDate), 0, 0)),
				endDate: toISOStringWithoutChangeTime(setHours(new Date(toDate), 23, 59, 59)),
			};

			if (fromPrice) params.minAmount = String(fromPrice);
			if (toPrice) params.maxAmount = String(toPrice);

			if (Array.isArray(providers) && providers.length > 0) {
				params.ProviderTypes = [];
				providers.forEach((provider) => {
					(params.ProviderTypes as string[]).push(provider);
				});
			}

			if (Array.isArray(status) && status.length > 0) {
				params.Statuses = [];
				status.forEach((s) => {
					(params.Statuses as string[]).push(s);
				});
			}

			const response = await brokerAxios.get<PaginationResponse<Reports.IInstantDeposit[]>>(
				url.getFilteredEPaymentApi,
				{
					params,
					signal,
				},
			);
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data;
		} catch (e) {
			return null;
		}
	},
});

export const useDepositWithReceiptReports = createQuery<
	PaginationResponse<Reports.IDepositWithReceipt[]> | null,
	['depositWithReceiptReports', DepositWithReceiptReports.DepositWithReceiptReportsFilters]
>({
	staleTime: 18e5,
	queryKey: ['depositWithReceiptReports', initialDepositWithReceiptReportsFilters],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const url = getBrokerURLs(store.getState());
			if (!url) return null;

			const [
				,
				{ attachment, fromDate, fromPrice, pageNumber, pageSize, receiptNumber, status, toDate, toPrice },
			] = queryKey;

			const params: Record<string, string | string[]> = {
				'QueryOption.PageNumber': String(pageNumber),
				'QueryOption.PageSize': String(pageSize),
				StartDate: toISOStringWithoutChangeTime(setHours(new Date(fromDate), 0, 0)),
				EndDate: toISOStringWithoutChangeTime(setHours(new Date(toDate), 23, 59, 59)),
			};

			if (fromPrice) params.MinAmount = String(fromPrice);
			if (toPrice) params.MaxAmount = String(toPrice);
			if (receiptNumber) params.ReceiptNumber = receiptNumber;
			if (attachment !== null) params.HasAttachment = String(Number(attachment));

			if (Array.isArray(status) && status.length > 0) {
				params.StatesList = [];
				status.forEach((s) => {
					(params.StatesList as string[]).push(s);
				});
			}

			const response = await brokerAxios.get<PaginationResponse<Reports.IDepositWithReceipt[]>>(
				url.getDepositOfflineHistory,
				{
					params,
					signal,
				},
			);
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data;
		} catch (e) {
			return null;
		}
	},
});

export const useWithdrawalCashReports = createQuery<
	PaginationResponse<Reports.IWithdrawal[]> | null,
	['withdrawalCashReports', WithdrawalCashReports.WithdrawalCashReportsFilters]
>({
	staleTime: 18e5,
	queryKey: ['withdrawalCashReports', initialWithdrawalCashReportsFilters],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const url = getBrokerURLs(store.getState());
			if (!url) return null;

			const [, { banks, fromDate, fromPrice, pageNumber, pageSize, status, toDate, toPrice }] = queryKey;

			const params: Record<string, string | string[]> = {
				'QueryOption.PageNumber': String(pageNumber),
				'QueryOption.PageSize': String(pageSize),
			};

			if (fromDate) params.StartDate = toISOStringWithoutChangeTime(setHours(new Date(fromDate), 0, 0));
			else
				params.StartDate = toISOStringWithoutChangeTime(
					dayjs().subtract(1, 'week').hour(0).minute(0).second(0).toDate(),
				);

			if (toDate) params.EndDate = toISOStringWithoutChangeTime(setHours(new Date(toDate), 23, 59, 59));
			else
				params.EndDate = toISOStringWithoutChangeTime(
					dayjs().add(1, 'week').hour(23).minute(59).second(59).toDate(),
				);

			if (fromPrice) params.MinAmount = String(fromPrice);
			if (toPrice) params.MaxAmount = String(toPrice);

			if (Array.isArray(status) && status.length > 0) {
				params.Statuses = [];
				status.forEach((item) => {
					(params.Statuses as string[]).push(item);
				});
			}
			if (Array.isArray(banks) && banks.length > 0) {
				params.AccountIds = [];
				banks.forEach(({ id }) => {
					(params.AccountIds as string[]).push(String(id));
				});
			}

			const response = await brokerAxios.get<PaginationResponse<Reports.IWithdrawal[]>>(url.getFilteredPayment, {
				params,
				signal,
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data;
		} catch (e) {
			return null;
		}
	},
});

export const userOnlineDepositStatusesQuery = createQuery<string[] | null, ['userOnlineDepositStatuses']>({
	queryKey: ['userOnlineDepositStatuses'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await brokerAxios.get<ServerResponse<string[]>>(url.getEPaymentApiGetStatuses, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useChangeBrokerReportsQuery = createQuery<
	PaginationResponse<Reports.IChangeBrokerReports[]> | null,
	['changeBrokerReports', ChangeBrokerReports.IChangeBrokerReportsFilters]
>({
	staleTime: 18e5,
	queryKey: ['changeBrokerReports', initialChangeBrokerReportsFilters],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const url = getBrokerURLs(store.getState());
			if (!url) return null;

			const [, { attachment, fromDate, pageNumber, pageSize, status, toDate, symbol }] = queryKey;

			const params: Record<string, string | string[]> = {
				'QueryOption.PageNumber': String(pageNumber),
				'QueryOption.PageSize': String(pageSize),
				'QueryOption.OrderByDirection': 'Asc',
				'QueryOption.NeedTotalCount': 'true',
				StartDate: toISOStringWithoutChangeTime(setHours(new Date(fromDate), 0, 0)),
				EndDate: toISOStringWithoutChangeTime(setHours(new Date(toDate), 23, 59, 59)),
			};

			if (fromDate !== undefined)
				params.StartDate = toISOStringWithoutChangeTime(setHours(new Date(fromDate), 0, 0));
			else
				params.StartDate = toISOStringWithoutChangeTime(
					dayjs().subtract(1, 'week').hour(0).minute(0).second(0).toDate(),
				);

			if (toDate !== undefined)
				params.EndDate = toISOStringWithoutChangeTime(setHours(new Date(toDate), 23, 59, 59));
			else
				params.EndDate = toISOStringWithoutChangeTime(
					dayjs().add(1, 'week').hour(23).minute(59).second(59).toDate(),
				);

			if (symbol) params.SymbolISIN = symbol.symbolISIN;

			if (typeof attachment === 'boolean') params.HasAttachment = String(Number(attachment || 0));

			if (Array.isArray(status) && status.length > 0) {
				params.Statuses = [];
				status.forEach((item) => {
					(params.Statuses as string[]).push(item);
				});
			}

			const response = await brokerAxios.get<PaginationResponse<Reports.IChangeBrokerReports[]>>(
				url.getChangeBrokerChangeBrokersByFilter,
				{
					params,
					signal,
				},
			);
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data;
		} catch (e) {
			return null;
		}
	},
});

export const userOnlineDepositProvidersQuery = createQuery<string[] | null, ['userOnlineDepositProviders']>({
	queryKey: ['userOnlineDepositProviders'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await brokerAxios.get<ServerResponse<string[]>>(url.getEPaymentApiGetProviderTypes, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const userCashWithdrawalStatusesQuery = createQuery<string[] | null, ['userOnlineDepositStatuses']>({
	queryKey: ['userOnlineDepositStatuses'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await brokerAxios.get<ServerResponse<string[]>>(url.getPaymentGetStatuses, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useFreezeUnFreezeReportsQuery = createQuery<
	PaginationResponse<Reports.IFreezeUnfreezeReports[]> | null,
	['freezeUnFreezeReports', FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters]
>({
	staleTime: 18e5,
	queryKey: ['freezeUnFreezeReports', initialFreezeUnFreezeReportsFilters],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const url = getBrokerURLs(store.getState());

			if (!url) return null;

			const [, { fromDate, pageNumber, pageSize, toDate, symbol, requestState }] = queryKey;

			const params: Record<string, string> = {
				'QueryOption.PageNumber': String(pageNumber),
				'QueryOption.PageSize': String(pageSize),
				'DateOption.FromDate': toISOStringWithoutChangeTime(setHours(new Date(fromDate), 0, 0)),
				'DateOption.ToDate': toISOStringWithoutChangeTime(setHours(new Date(toDate), 23, 59, 59)),
				// 'RequestType': '0'
			};

			if (symbol) params.SymbolISIN = symbol.symbolISIN;

			if (requestState) params.RequestState = requestState;

			const response = await brokerAxios.get<PaginationResponse<Reports.IFreezeUnfreezeReports[]>>(
				url.getFreezerequests,
				{
					params,
					signal,
				},
			);
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data;
		} catch (e) {
			return null;
		}
	},
});

export const useCashSettlementReportsQuery = createQuery<
	PaginationResponse<Reports.ICashSettlementReports[]> | null,
	['cashSettlementReports', Partial<CashSettlementReports.ICashSettlementReportsFilters>]
>({
	queryKey: ['cashSettlementReports', initialCashSettlementReportsFilters],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const url = getBrokerURLs(store.getState());

			if (!url) return null;

			const [
				,
				{
					fromDate,
					pageNumber,
					pageSize,
					toDate,
					symbol,
					contractStatus,
					requestStatus,
					settlementRequestType,
				},
			] = queryKey;

			const params: Record<string, string | string[] | undefined> = {
				StartDate: fromDate ? toISOStringWithoutChangeTime(setHours(new Date(fromDate), 0, 0)) : undefined,
				EndDate: toDate ? toISOStringWithoutChangeTime(setHours(new Date(toDate), 23, 59, 59)) : undefined,
				SymbolISIN: symbol ? String(symbol?.symbolISIN) : undefined,
				'QueryOption.PageNumber': pageNumber ? String(pageNumber) : undefined,
				'QueryOption.PageSize': pageSize ? String(pageSize) : undefined,
			};

			if (contractStatus) params.PandLStatus = contractStatus;

			if (Array.isArray(settlementRequestType) && settlementRequestType.length > 0) {
				params.SettlementType = [];
				settlementRequestType.forEach((item) => {
					(params.SettlementType as string[]).push(item.id);
				});
			}

			if (Array.isArray(requestStatus) && requestStatus.length > 0) {
				params.RequestStatus = [];
				requestStatus.forEach((item) => {
					(params.RequestStatus as string[]).push(item.id);
				});
			}

			const response = await brokerAxios.get<PaginationResponse<Reports.ICashSettlementReports[]>>(
				url.Settlementcash,
				{
					params,
					signal,
				},
			);
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data;
		} catch (e) {
			return null;
		}
	},
});

export const usePhysicalSettlementReportsQuery = createQuery<
	PaginationResponse<Reports.IPhysicalSettlementReports[]> | null,
	['physicalSettlementReports', Partial<PhysicalSettlementReports.IPhysicalSettlementReportsFilters>]
>({
	queryKey: ['physicalSettlementReports', initialPhysicalSettlementReportsFilters],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const url = getBrokerURLs(store.getState());

			console.log(url, 'rul');

			if (!url) return null;

			const [
				,
				{
					fromDate,
					pageNumber,
					pageSize,
					toDate,
					symbol,
					contractStatus,
					requestStatus,
					settlementRequestType,
					side,
				},
			] = queryKey;

			const params: Record<string, string | string[] | undefined> = {
				StartDate: fromDate ? toISOStringWithoutChangeTime(setHours(new Date(fromDate), 0, 0)) : undefined,
				EndDate: toDate ? toISOStringWithoutChangeTime(setHours(new Date(toDate), 23, 59, 59)) : undefined,
				'QueryOption.PageNumber': pageNumber ? String(pageNumber) : undefined,
				'QueryOption.PageSize': pageSize ? String(pageSize) : undefined,
				side: side ?? undefined,
			};
			if (symbol?.symbolISIN) params.SymbolISIN = symbol.symbolISIN;

			if (contractStatus) params.PandLStatus = contractStatus;

			if (Array.isArray(settlementRequestType) && settlementRequestType.length > 0) {
				params.SettlementType = [];
				settlementRequestType.forEach((item) => {
					(params.SettlementType as string[]).push(item.id);
				});
			}

			if (Array.isArray(requestStatus) && requestStatus.length > 0) {
				params.RequestStatus = [];
				requestStatus.forEach((item) => {
					(params.RequestStatus as string[]).push(item.id);
				});
			}

			const response = await brokerAxios.get<PaginationResponse<Reports.IPhysicalSettlementReports[]>>(
				url.Settlementphysical,
				{
					params,
					signal,
				},
			);
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data;
		} catch (e) {
			return null;
		}
	},
});

export const useOrdersReportsQuery = createQuery<
	PaginationResponse<Reports.IOrdersReports[]> | null,
	['ordersReports', OrdersReports.IOrdersReportsFilters]
>({
	staleTime: 18e5,
	queryKey: ['ordersReports', initialOrdersReportsFilters],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const url = getBrokerURLs(store.getState());

			if (!url) return null;

			const [, { fromDate, pageNumber, pageSize, toDate, symbol, side, status }] = queryKey;

			const params: Record<string, string | string[]> = {
				'QueryOption.PageNumber': String(pageNumber),
				'QueryOption.PageSize': String(pageSize),
				'DateOption.FromDate': toISOStringWithoutChangeTime(setHours(new Date(fromDate), 0, 0)),
				'DateOption.ToDate': toISOStringWithoutChangeTime(setHours(new Date(toDate), 23, 59, 59)),
			};

			if (side !== 'All') params.OrderSide = side;

			if (symbol) params.SymbolISIN = symbol.symbolISIN;

			if (Array.isArray(status) && status.length > 0) {
				params.OMSOrderState = [];
				status.forEach((st) => {
					(params.OMSOrderState as string[]).push(st.id);
				});
			}

			const response = await brokerAxios.get<PaginationResponse<Reports.IOrdersReports[]>>(url.getOrderOrders, {
				params,
				signal,
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data;
		} catch (e) {
			return null;
		}
	},
});

export const useTradesReportsQuery = createQuery<
	PaginationResponse<Reports.ITradesReports[]> | null,
	['tradesReports', TradesReports.ITradesReportsFilters]
>({
	staleTime: 18e5,
	queryKey: ['tradesReports', initialTradesReportsFilters],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const url = getBrokerURLs(store.getState());

			if (!url) return null;

			const [, { fromDate, pageNumber, pageSize, toDate, symbol, side }] = queryKey;

			const params: Record<string, string | string[]> = {
				'QueryOption.PageNumber': String(pageNumber),
				'QueryOption.PageSize': String(pageSize),
				'DateOption.FromDate': toISOStringWithoutChangeTime(setHours(new Date(fromDate), 0, 0)),
				'DateOption.ToDate': toISOStringWithoutChangeTime(setHours(new Date(toDate), 23, 59, 59)),
			};

			if (side !== 'All') params.OrderSide = side;

			if (symbol) params.SymbolISIN = symbol.symbolISIN;

			const response = await brokerAxios.get<PaginationResponse<Reports.ITradesReports[]>>(
				url.getOrderDetailedOrders,
				{
					params,
					signal,
				},
			);
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data;
		} catch (e) {
			return null;
		}
	},
});
