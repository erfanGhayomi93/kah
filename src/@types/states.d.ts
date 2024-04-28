declare interface INextProps<T extends object = {}> {
	params: T & { locale: string };
}

declare interface INextStrategyProps extends INextProps<{ id: string }> {}

declare interface IOFields {
	symbolISIN: string;
	quantity: number;
	price: number;
	orderSide: 'buy' | 'sell';
	validity: TBsValidityDates;
	validityDate: number;
}

declare interface IOFieldsWithID {
	id: number;
	symbolISIN: string;
	quantity: number;
	price: number;
	orderSide: 'buy' | 'sell';
	validity: TBsValidityDates;
	validityDate: number;
}

declare type TLoginModalStates = 'phoneNumber' | 'login-with-otp' | 'welcome' | 'login-with-password' | 'set-password';

declare type TOptionSides = 'put' | 'call';

declare type TBsSides = 'buy' | 'sell';

declare type TBsCollaterals = 'cash' | 'stock';

declare type TBsSymbolTypes = 'base' | 'option';

declare type TBsModes = 'create' | 'edit';

declare type TBsTypes = 'draft' | 'order';

declare type TOrdersTab = 'open_orders' | 'today_orders' | 'executed_orders' | 'option_orders' | 'draft';

declare type TBsValidityDates = 'GoodTillDate' | 'FillAndKill' | 'GoodTillCancelled' | 'Day' | 'Week' | 'Month';

declare type TStrategyMarketTrend =
	| 'all'
	| Extract<Strategy.Cheap, 'BullishMarket' | 'BearishMarket' | 'NeutralMarket' | 'DirectionalMarket'>;

declare type TSymbolInfoPanelSections =
	| 'option_detail'
	| 'market_depth'
	| 'symbol_detail'
	| 'base_symbol_contracts'
	| 'user_open_positions'
	| 'quotes'
	| 'individual_and_legal'
	| 'chart'
	| 'same_sector_symbols'
	| 'supervisor_messages';

declare type OptionWatchlistColumns =
	| 'symbolTitle'
	| 'tradeValue'
	| 'premium'
	| 'delta'
	| 'baseSymbolPrice'
	| 'breakEvenPoint'
	| 'leverage'
	| 'openPositionCount'
	| 'impliedVolatility'
	| 'iotm'
	| 'blackScholes'
	| 'tradeVolume'
	| 'dueDays'
	| 'strikePrice'
	| 'bestBuyPrice'
	| 'bestSellPrice'
	| 'symbolFullTitle'
	| 'baseSymbolTitle'
	| 'closingPrice'
	| 'historicalVolatility'
	| 'contractSize'
	| 'timeValue'
	| 'theta'
	| 'tradeCount'
	| 'contractEndDate'
	| 'spread'
	| 'blackScholesDifference'
	| 'baseClosingPrice'
	| 'gamma'
	| 'optionType'
	| 'requiredMargin'
	| 'initialMargin'
	| 'rho'
	| 'vega'
	| 'growth'
	| 'contractValueType'
	| 'highOpenPosition'
	| 'lastTradeDate'
	| 'legalBuyVolume'
	| 'individualBuyVolume'
	| 'legalSellVolume'
	| 'individualSellVolume'
	| 'sectorName'
	| 'notionalValue'
	| 'intrinsicValue'
	| 'action';

declare type TDashboardSections =
	| 'market_view'
	| 'market_state'
	| 'best'
	| 'user_progress_bar'
	| 'compare_transaction_value'
	| 'option_contracts'
	| 'option_trades_value'
	| 'option_market_process'
	| 'individual_and_legal'
	| 'price_changes_watchlist'
	| 'open_positions_process'
	| 'meetings'
	| 'new_and_old'
	| 'top_base_assets'
	| 'custom'
	| 'recent_activities'
	| 'due_dates';

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

declare interface ISymbolInfoPanelGrid {
	id: TSymbolInfoPanelSections;
	height: number;
	expand: boolean;
	hidden: boolean;
	i: number;
	readonly isOption?: boolean;
}

declare interface IDashboardGrid {
	id: TDashboardSections;
	w: number;
	h: number;
	i: number;
	hidden: boolean;
}

declare interface IBaseModalConfiguration {
	moveable?: boolean;
	animation?: boolean;
}

declare interface SymbolContractModalStates {
	term: string;
	sendBaseSymbol: boolean;
	contracts: Option.Root[];
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

declare interface IAnalyzeModalInputs {
	chartData: Array<Record<'x' | 'y', number>>;
	minPrice: number;
	maxPrice: number;
	mostProfit: number;
	mostLoss: number;
	baseAssets: number;
	bep: Record<'x' | 'y', number>;
	budget: number;
	profitProbability: number;
	timeValue: number;
	risk: number;
	requiredMargin: number;
	withCommission: boolean;
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

declare namespace OrderBasket {
	export interface Root {
		baseSymbol: {
			symbolISIN: string;
			symbolTitle: string;
		};

		orders: OrderBasket.Order[];
	}
	export interface Order extends ISymbolStrategyContract {}
}

declare interface ISymbolStrategyContract {
	id: string;
	quantity: number;
	price: number;
	strikePrice: number;
	contractSize: number;
	settlementDay: Date | number | string;
	type: TOptionSides;
	side: TBsSides;
	symbol: Option.Root;
	commission: {
		value: number;
		checked?: boolean;
		onChecked?: (checked: boolean) => void;
	};
	requiredMargin: {
		value: number;
		checked?: boolean;
		onChecked?: (checked: boolean) => void;
	};
}

declare interface ISymbolChartStates {
	interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
	type: 'area' | 'candlestick';
}
