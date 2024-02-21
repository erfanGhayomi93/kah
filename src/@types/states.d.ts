declare type TLoginModalStates = 'phoneNumber' | 'login-with-otp' | 'welcome' | 'login-with-password' | 'set-password';

declare type TBsSides = 'buy' | 'sell';

declare type TBsCollaterals = 'cash' | 'stock';

declare type TBsSymbolTypes = 'base' | 'option';

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

declare interface SymbolContractModalStates {
	term: string;
	contract: null | Option.Root;
	contractType: Record<'id' | 'title', string>;
	activeSettlement: Option.BaseSettlementDays | null;
}

declare type IBrokerUrls = Record<
	'todayOrders' | 'todayTrades' | 'drafts' | 'createOrder' | 'ordersCount' | 'openOrders' | 'commission',
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
	validityDate: TBsValidityDates;
	price: number;
	quantity: number;
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
