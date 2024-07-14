import { DateAsMillisecond } from './enums';

export const initialOptionWatchlistFilters: IOptionWatchlistFilters = {
	symbols: [],
	type: [],
	status: [],
	dueDays: [0, 365],
	delta: [-1, 1],
	minimumTradesValue: '',
};
export const initialTransactionsFilters: Transaction.ITransactionsFilters = {
	pageNumber: 1,
	pageSize: 25,
	symbol: null,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	fromPrice: 0,
	toPrice: 0,
	groupMode: 'GreedyGrouped',
	transactionType: [],
};

export const initialInstantDepositReportsFilters: InstantDepositReports.IInstantDepositReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	toPrice: 0,
	fromPrice: 0,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	providers: [],
	status: [],
};

export const initialDepositWithReceiptReportsFilters: DepositWithReceiptReports.DepositWithReceiptReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	status: [],
	toPrice: 0,
	fromPrice: 0,
	receiptNumber: '',
	attachment: null,
};

export const initialWithdrawalCashReportsFilters: WithdrawalCashReports.WithdrawalCashReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	status: [],
	toPrice: 0,
	fromPrice: 0,
	banks: [],
};

export const initialChangeBrokerReportsFilters: ChangeBrokerReports.IChangeBrokerReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	symbol: null,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	status: [],
	attachment: null,
};

export const initialFreezeUnFreezeReportsFilters: FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	requestState: null,
	symbol: null,
};

export const initialCashSettlementReportsFilters: CashSettlementReports.ICashSettlementReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	symbol: null,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	contractStatus: 'All',
	settlementRequestType: [],
	requestStatus: [],
};

export const initialPhysicalSettlementReportsFilters: PhysicalSettlementReports.IPhysicalSettlementReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	symbol: null,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	contractStatus: 'All',
	settlementRequestType: [],
	requestStatus: [],
};

export const initialOrdersReportsFilters: OrdersReports.IOrdersReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	symbol: null,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	side: 'All',
	status: [],
};

export const initialTradesReportsFilters: TradesReports.ITradesReportsFilters = {
	pageNumber: 1,
	pageSize: 25,
	symbol: null,
	date: 'dates.year',
	fromDate: new Date().getTime() - DateAsMillisecond.Year,
	toDate: new Date().getTime(),
	side: 'All',
};
