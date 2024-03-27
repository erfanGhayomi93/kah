declare type TLoginModalStates = 'phoneNumber' | 'login-with-otp' | 'welcome' | 'login-with-password' | 'set-password';

declare type TOptionSides = 'put' | 'call';

declare type TBsSides = 'buy' | 'sell';

declare type TBsCollaterals = 'cash' | 'stock';

declare type TBsSymbolTypes = 'base' | 'option';

declare type TBsModes = 'create' | 'edit';

declare type TBsTypes = 'draft' | 'order';

declare type TOrdersTab = 'open_orders' | 'today_orders' | 'executed_orders' | 'option_orders' | 'draft';

declare type TBsValidityDates = 'GoodTillDate' | 'FillAndKill' | 'GoodTillCancelled' | 'Day' | 'Week' | 'Month';

declare type LightstreamStatus =
	| 'CONNECTING'
	| 'CONNECTED:STREAM-SENSING'
	| 'CONNECTED:WS-STREAMING'
	| 'CONNECTED:HTTP-STREAMING'
	| 'CONNECTED:WS-POLLING'
	| 'CONNECTED:HTTP-POLLING'
	| 'STALLED'
	| 'DISCONNECTED:WILL-RETRY'
	| 'DISCONNECTED:TRYING-RECOVERY'
	| 'DISCONNECTED';

declare type TSaturnBaseSymbolContracts = (Saturn.ContentOption | null)[];

declare interface IBaseModalConfiguration {
	isEnable?: boolean;
	moveable?: boolean;
	animation?: boolean;
}

declare interface SymbolContractModalStates {
	term: string;
	contract: null | Option.Root;
	contractType: Record<'id' | 'title', string>;
	activeSettlement: Option.BaseSettlementDays | null;
}

declare type IBrokerUrls = Record<
	| 'todayOrders'
	| 'executedOrders'
	| 'drafts'
	| 'createOrder'
	| 'ordersCount'
	| 'openOrders'
	| 'commission'
	| 'optionOrders'
	| 'userInformation'
	| 'deleteDraft'
	| 'deleteOrder'
	| 'groupDeleteDraft'
	| 'groupDeleteOrder'
	| 'updateDraft'
	| 'updateOrder'
	| 'userRemain'
	| 'userStatus'
	| 'createDraft',
	string
>;

declare type TOptionWatchlistColumnsState = Array<{
	colId: OptionWatchlistColumns;
	width?: number;
	hide?: boolean;
	pinned?: 'left' | 'right' | null;
	sort?: 'asc' | 'desc' | null;
	sortIndex?: null;
	aggFunc?: null;
	rowGroup?: boolean;
	rowGroupIndex?: null;
	pivot?: boolean;
	pivotIndex?: null;
	flex?: number;
}>;

declare interface IBsModalInputs {
	collateral: TBsCollaterals | null;
	validity: TBsValidityDates;
	validityDate: number;
	price: number;
	quantity: number;
	value: BigInt | number;
	side: TBsSides;
	priceLock: boolean;
	expand: boolean;
	holdAfterOrder: boolean;
}

declare type TSetBsModalInputs = <
	T extends
		| Partial<IBsModalInputs>
		| keyof Partial<IBsModalInputs>
		| ((values: IBsModalInputs) => Partial<IBsModalInputs>),
>(
	options: T,
	value?: (T extends keyof IBsModalInputs ? IBsModalInputs[T] : undefined) | undefined,
) => void;

declare interface IBlackScholesModalStates {
	baseSymbol: Option.BaseSearch | null;
	contractEndDate: Option.BaseSettlementDays | null;
	contract: {
		baseSymbolPrice: number;
		strikePrice: number;
		contractEndDate: number;
		historicalVolatility: number;
		premium: number;
	} | null;
	sharePrice: number;
	strikePrice: number;
	dueDays: number;
	volatility: string;
	riskFreeProfit: string;
	premium: number;
}

declare interface IOptionWatchlistFilters {
	symbols: Option.BaseSearch[];
	type: Array<'Call' | 'Put'>;
	status: Array<'ITM' | 'OTM' | 'ATM'>;
	dueDays: [number, number];
	delta: [number, number];
	minimumTradesValue: string;
}

declare interface OptionChainFilters {
	baseSymbol: Option.BaseSearch | null;
	settlementDay: Option.BaseSettlementDays | null;
}

interface IOrderBasket {
	id: string;
	baseSymbolISIN: string;
	symbolISIN: null | string;
	side: TBsSides;
	type: TOptionSides;
	settlementDay: null | string;
	strikePrice: number;
	price: number;
	quantity: number;
}
