declare namespace Common {
	type Time = string;

	interface Commission {
		marketTitle: string;
		marketUnitTitle: string;
		commissionType: string;
		buyCommission: number;
		sellCommission: number;
	}
}

declare namespace Option {
	export type IOTM = 'ATM' | 'OTM' | 'ITM';

	export interface Root {
		/**
		 * اطلاعات نماد
		 */
		symbolInfo: SymbolInfo;

		/**
		 * اطلاعات اختیار نماد
		 */
		optionWatchlistData: Watchlist;
	}

	export interface SymbolInfo {
		/**
		 * آیدی نماد
		 */
		symbolISIN: string;
		/**
		 * آیدی نماد پایه
		 */
		baseSymbolISIN: string;
		/**
		 * روز‌های باقی مانده
		 */
		dueDays: number;
		/**
		 * قیمت اعمال
		 */
		strikePrice: number;
		/**
		 * نام نماد
		 */
		symbolTitle: string;
		/**
		 * نام نماد پایه
		 */
		baseSymbolTitle: string;
		/**
		 * اندازه قرارداد
		 */
		contractSize: number;
		/**
		 * تاریخ سررسید
		 */
		contractEndDate: string;
		/**
		 * نوع قرارداد
		 */
		optionType: 'Call' | 'Put';
		/**
		 * وجه تضمین اولیه
		 */
		initialMargin: number;
		/**
		 * نام صنعت
		 */
		sectorName: string;
		/**
		 * آیدی شرکت
		 */
		companyISIN: string;
		/**
		 * اسم شرکت
		 */
		companyName: string;
		/**
		 * آیدی مارکت
		 */
		marketUnit: string;
	}

	export interface Watchlist {
		/**
		 * آیدی نماد
		 */
		symbolISIN: string;
		/**
		 * آیدی شرکت
		 */
		companyISIN: string;
		/**
		 * پرمیوم / آخرین قیمت
		 */
		premium: number;
		/**
		 * درصد آخرین قیمت
		 */
		tradePriceVarPreviousTradePercent: number;
		/**
		 * درصد آخرین قیمت پایه
		 */
		baseTradePriceVarPreviousTradePercent: number;
		/**
		 * درصد قیمت پایانی پایه
		 */
		baseClosingPriceVarReferencePricePercent: number;
		/**
		 * درصد قیمت پایانی
		 */
		closingPriceVarReferencePricePercent: number;
		/**
		 * قیمت نماد پایه / آخرین قیمت پایه
		 */
		baseSymbolPrice: number;
		/**
		 * سر به سر
		 */
		breakEvenPoint: number;
		/**
		 * اهرم
		 */
		leverage: number;
		/**
		 * تعداد موقعیت‌های باز
		 */
		openPositionCount: number;
		/**
		 * نوسان پذیری ضمنی
		 */
		impliedVolatility: number;
		/**
		 * بهترین قیمت خرید
		 */
		bestBuyPrice: number;
		/**
		 * بهترین قیمت فروش
		 */
		bestSellPrice: number;
		/**
		 * قیمت پایانی
		 */
		closingPrice: number;
		/**
		 * نوسان پذیری
		 */
		historicalVolatility: number;
		/**
		 * ارزش زمانی
		 */
		timeValue: number;
		/**
		 * بلک شولز
		 */
		blackScholes: number;
		/**
		 * دلتا
		 */
		delta: number;
		/**
		 * تتا
		 */
		theta: number;
		/**
		 * رو
		 */
		rho: number;
		/**
		 * وگا
		 */
		vega: number;
		/**
		 * گاما
		 */
		gamma: number;
		/**
		 * لامبدا
		 */
		lambda: number;
		/**
		 * تعداد معاملات
		 */
		tradeCount: number;
		/**
		 * شکاف / اسپرد
		 */
		spread: number;
		/**
		 * اختلاف بلک شولز
		 */
		blackScholesDifference: number;
		/**
		 * قیمت پایانی پایه
		 */
		baseClosingPrice: number;
		/**
		 * وجه تضمین لازم
		 */
		requiredMargin: number;
		/**
		 * رشد
		 */
		growth: number;
		/**
		 * پر ارزش
		 */
		contractValueType: string;
		/**
		 * موقعیت‌های باز زیاد
		 */
		highOpenPosition: string;
		/**
		 * حجم خرید حقیقی
		 */
		individualBuyVolume: number;
		/**
		 * حجم فروش حقیقی
		 */
		individualSellVolume: number;
		/**
		 * حجم خرید حقوقی
		 */
		legalBuyVolume: number;
		/**
		 * حجم فروش حقوقی
		 */
		legalSellVolume: number;
		/**
		 * تاریخ آخرین معامله
		 */
		lastTradeDate: string;
		/**
		 * ارزش مفهومی معاملات / ارزش ذاتی
		 */
		notionalValue: number;
		/**
		 * O/I TM
		 */
		iotm: IOTM;
		/**
		 * ارزش ذاتی
		 */
		intrinsicValue: number;
		/**
		 * ارزش معاملات
		 */
		tradeValue: number;
		/**
		 * حجم معاملات
		 */
		tradeVolume: number;
	}

	export interface BaseSearch {
		symbolISIN: string;
		symbolTitle: string;
		companyISIN: string;
		companyName: string;
		insCode: null | string;
		symbolTradeState: 'NULL' | 'Reserved' | 'Suspended' | 'Open' | 'Frozen' | null;
	}

	export interface Search {
		strikePrice: number;
		symbolISIN: string;
		symbolTitle: string;
		companyISIN: string;
		companyName: string;
		insCode: string;
		symbolTradeState: 'NULL' | 'Reserved' | 'Suspended' | 'Open' | 'Frozen' | null;
		marketUnit: string;
		isOption: boolean;
	}

	export interface CustomWatchlistSearch {
		isInWatchlist: boolean;
		symbolISIN: string;
		symbolTitle: string;
		companyISIN: string;
		companyName: string;
		insCode: string;
		symbolTradeState: 'NULL' | 'Reserved' | 'Suspended' | 'Open' | 'Frozen' | null;
		marketUnit: string;
		isOption: boolean;
	}

	export interface BaseSettlementDays {
		baseSymbolISIN: string;
		contractEndDate: string;
		dueDays: number;
		openPosition: number;
		workingDaysLeftCount: number;
		oneMonthTradeValue: number;
	}

	export interface GetOpenPositionReport {
		baseSymbolISIN: string;
		date: string;
		openPositionSum: number;
	}

	export interface Column {
		id: number;
		title: string;
		category: string;
		isHidden: boolean;
		order: number;
	}

	export interface CalculativeInfo {
		breakEvenPoint: number;
		leverage: number;
		delta: number;
		theta: number;
		gamma: number;
		vega: number;
		requiredMargin: number;
		impliedVolatility: number;
		historicalVolatility: number;
		wiv: number;
		intrinsicValue: number;
		timeValue: number;
		iotm: IOTM;
		initialMargin: number;
	}

	export interface WatchlistList {
		id: number;
		name: string;
		isHidden: boolean;
	}
}

declare namespace Symbol {
	export interface Info {
		symbolISIN: string;
		symbolTitle: string;
		companyName: string;
		insCode: string;
		exchange: string;
		lastTradedPrice: number;
		tradePriceVarPreviousTrade: number;
		tradePriceVarPreviousTradePercent: number;
		yesterdayClosingPrice: number;
		closingPrice: number;
		closingPriceVarReferencePrice: number;
		closingPriceVarReferencePricePercent: number;
		lowThreshold: number;
		highThreshold: number;
		lowPrice: number;
		highPrice: number;
		tradeValue: number;
		tradeVolume: number;
		cancellationNAV: number;
		oneMonthAvgVolume: null | number;
		hv: number;
		avgIV: number;
		lastTradeDate: string;
		openPrice: number;
		baseVolume: number;
		tradeCount: number;
		eps: null | number;
		pe: null | number;
		ps: null | number;
		symbolTradeState: string;
		individualBuyVolume: number;
		numberOfIndividualsBuyers: number;
		individualSellVolume: number;
		numberOfIndividualsSellers: number;
		legalBuyVolume: number;
		numberOfILegalsBuyers: number;
		legalSellVolume: number;
		numberOfLegalsSellers: number;
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		marketUnit: string;
		notionalValue: number;
		contractEndDate: string;
		openPosition: number;
		contractSize: number;
		isOption: boolean;
		oneMonthEfficiency: number;
		threeMonthEfficiency: number;
		oneYearEfficiency: number;
	}

	export interface Search {
		symbolISIN: string;
		symbolTitle: string;
		companyISIN: string;
		isOption: boolean;
		isFreeze?: boolean;
		marketUnit: string;
		companyName: string;
		insCode: null | string;
		symbolTradeState: 'NULL' | 'Reserved' | 'Suspended' | 'Open' | 'Frozen' | null;
	}

	export interface BestLimit {
		symbolISIN: string;
		rowIndex: number;
		bestBuyLimitPrice: number;
		bestSellLimitPrice: number;
		bestBuyLimitQuantity: number;
		bestSellLimitQuantity: number;
		numberOfOrdersAtBestBuy: number;
		numberOfOrdersAtBestSell: number;
	}

	export interface SameSector {
		insCode: string;
		companyISIN: string;
		symbolTitle: string;
		symbolISIN: string;
		marketCode: string;
		companyName: string;
		enCompanyName: string;
		highestTradePriceOfTradingDay: number;
		lowestTradePriceOfTradingDay: number;
		closingPrice: number;
		openPrice: number;
		yesterdayClosingPrice: number;
		highThreshold: number;
		lowThreshold: number;
		totalNumberOfSharesTraded: number;
		totalNumberOfTrades: number;
		totalTradeValue: number;
		lastTradedPrice: number;
		lastTradedDate: string;
		lastTradeDateTime: string;
		firstTradedPrice: number;
		preClosingPrice: number;
		lastTradedPriceVar: number;
		lastTradedPriceVarPercent: number;
		closingPriceVar: number;
		closingPriceVarPercent: number;
		symbolGroupCode: string;
		bestBuyLimitQuantity: number;
		bestSellLimitQuantity: number;
		minTradeQuantity: number;
		maxTradeQuantity: number;
		numberOfOrdersAtBestBuy: number;
		numberOfOrdersAtBestSell: number;
		bestBuyPrice: number;
		bestBuyLimitPrice_1: number;
		bestSellPrice: number;
		bestSellLimitPrice_1: number;
		sectorCode: string;
		unitCount: number;
		orderPriceTickSize: number;
		baseVolume: number;
		floatFree: number;
		pe: number;
		oneMonthEfficiency: number;
		sixMonthEfficiency: number;
		threeMonthEfficiency: number;
		oneYearEfficiency: number;
		eps: number;
		threeMonthTradeVolume: number;
		ps: number;
		marketUnit: string;
		symbolOrderState: string;
		symbolTradeState: string;
		groupState: string;
		symbolState: string;
		companyCode: string;
		tickPrice: number;
		tickQuantity: number;
		sectorPE: string;
		floatingStock: string;
		estimatedEPS: string;
		fiscalYear: string;
		symbolType: string;
		bourseKey: string;
		exchange: string;
		isOption: boolean;
		isBaseFreezed: boolean;
		symbolTag: string;
		navIssueDate: string;
		navIssuePrice: number;
		navCancellationPrice: number;
		contractSize: number;
		isValid: boolean;
		initialMargin: number;
		requiredMargin: number;
		isIpo: boolean;
		isFreeze: boolean;
		openPosition: number;
		totalPosition: number;
		baseSymbolISIN: string;
		baseSymbolTitle: string;
	}

	export interface ChartData {
		o: number;
		h: number;
		l: number;
		c: number;
		x: number;
		v: number;
	}
}

declare namespace OAuthAPI {
	declare interface ILoginFirstStep {
		state: 'NewUser' | 'OTP' | 'TooManyRequest' | 'HasPassword' | 'Fail';
		otpRemainSecond: number;
		nextStepToken: string | null;
	}

	declare interface ISendPasslessOTP {
		state: 'NewUser' | 'OTP' | 'TooManyRequest' | 'HasPassword' | 'Fail';
		otpRemainSecond: number;
		nextStepToken: string | null;
	}

	declare interface IForgetPasswordFirstStep {
		otpRemainSecond: number;
		nextStepToken: string;
	}

	declare interface IValidateForgetPasswordOtp {
		nextStepToken: string;
		responseMessage: string;
	}

	declare type IChangePassword = string;

	declare interface IPasswordLogin {
		message: string;
		token: string | null;
	}

	declare interface IChangeForgottenPassword {
		result: string;
	}

	declare interface ISignUp {
		message: string;
		token: string | null;
	}

	declare interface IOtpLogin {
		message: string;
		token: string | null;
	}
}

declare namespace User {
	interface IUserInformation {
		hasPassword: boolean;
		mobile: string;
		saveDate: string;
	}

	interface Broker {
		id: number;
		brokerCode: string | number;
		name: string;
		description: string;
		logo: null | string;
		ssoUrl: string;
	}
}

declare namespace Saturn {
	type SymbolTab = 'tab_market_depth' | 'tab_chart' | 'tab_my_asset';

	type OptionTab = 'price_information' | 'computing_information' | 'market_depth' | 'open_position';

	interface Template {
		id: number;
		name: string;
		content: string;
		isPinned: boolean;
	}

	interface ContentOption {
		symbolTitle: string;
		symbolISIN: string;
		activeTab: OptionTab;
	}

	interface Content {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		activeTab: SymbolTab;
		options: ContentOption[];
	}
}

declare namespace Broker {
	export type TRemainStatus = 'Normal' | 'AtRisk' | 'CallMargin';

	export type UrlKey =
		| 'TodayOrders'
		| 'ExecutedOrders'
		| 'Drafts'
		| 'CreateOrder'
		| 'OrdersCount'
		| 'OpenOrders'
		| 'Commission'
		| 'UserInformation'
		| 'UserRemain'
		| 'UserStatus'
		| 'OptionOrders'
		| 'CreateDraft'
		| 'DeleteDraft'
		| 'DeleteOrder'
		| 'GroupDeleteDraft'
		| 'GroupDeleteOrder'
		| 'UpdateDraft'
		| 'UpdateOrder'
		| 'CreateRequestEPaymentApi'
		| 'GetRemain'
		| 'CompleteRequestReceipt'
		| 'GetListBrokerBankAccount'
		| 'DepositOfflineHistory'
		| 'CustomerTurnOverRemain'
		| 'CreateChangeBrokers'
		| 'LastChangeBrokers'
		| 'GetWithFilterReceipt'
		| 'GetFilteredEPaymentApi'
		| 'RecentUnFreeze'
		| 'DeleteFreeze'
		| 'DeleteChangeBroker'
		| 'GetFilteredPayment'
		| 'GetListBankAccount'
		| 'GetRemainsWithDate'
		| 'LastListDrawal'
		| 'RequestPayment'
		| 'newKaraFreeze'
		| 'RecentFreeze'
		| 'symbolCountFreeze'
		| 'DepositOnlineHistory'
		| 'CustomerTurnOverCSVExport'
		| 'EPaymentExportFilteredCSV'
		| 'ReceiptExportFilteredCSV'
		| 'PaymentExportFilteredCSV'
		| 'SetCustomerSettings'
		| 'DepositOnlineHistory'
		| 'ReceiptEditRequest'
		| 'PaymentUpdateRequest'
		| 'GetCustomerSettings'
		| 'EPaymentApiGetStatuses'
		| 'EPaymentApiGetProviderTypes'
		| 'PaymentGetStatuses'
		| 'ChangeBrokerExportFilteredCSV'
		| 'ChangeBrokerChangeBrokersByFilter'
		| 'GetAgreements'
		| 'ChangeBrokerSetCancel'
		| 'FreezeExportFreeze'
		| 'Freezerequests'
		| 'Settlementcash'
		| 'Settlementphysical'
		| 'OrderExportOrders'
		| 'OrderOrders'
		| 'OrderExportTrades'
		| 'OrderDetailedOrders'
		| 'FreezeExportFreeze'
		| 'Freezerequests'
		| 'ReceiptSetCancel'
		| 'PaymentDeleteRequest'
		| 'AcceptAgreement'
		| 'MobileOtpRequest';

	type URL = Record<UrlKey, string>;

	export interface Remain {
		remainT1: number;
		remainT2: number;
		blockValue: number;
		purchasePower: number;
		credit: number;
	}

	export interface Status {
		remainStatus: TRemainStatus;
		remainAsset: number;
		marginValue: number;
		variationMargin: number | null;
	}

	export interface User {
		bourseCode: string;
		customerTitle: string;
		email: string;
		mobilePhone: string;
		userName: string;
		twoFactor: boolean;
		sendMail: boolean;
		sendSms: boolean;
		nationalCode: string;
		userID: number;
		customerISIN: string;
		brokerCode: string;
		isOption: boolean;
		isOffline: boolean;
		customerTags: string;
		ipLocation: string;
	}

	export interface OrdersCount {
		openOrderCnt: number;
		todayOrderCnt: number;
		executedOrderCnt: number;
		orderDraftCnt: number;
		orderOptionCount: number;
	}
}

declare namespace Order {
	export type StatusType =
		| 'InOMSQueu'
		| 'OnSending'
		| 'Error'
		| 'DeleteByEngine'
		| 'OnBoard'
		| 'Canceled'
		| 'OnModifyFrom'
		| 'OnModifyTo'
		| 'Modified'
		| 'OnBoardModify'
		| 'PartOfTheOrderDone'
		| 'OrderDone'
		| 'OnCanceling'
		| 'OnModifyError'
		| 'OnCancelError'
		| 'Expired'
		| 'RejectByGAP'
		| 'OnCancelingWithBroker'
		| 'TradeCancel';

	export type FormType = 'Web' | 'Mobile' | 'BrokerTrader' | 'ClientApi' | 'MarketMaker' | 'Admin' | 'Supervisor';

	export type Types = 'MarketOrder' | 'LimitOrder' | 'MarketToLimitOrder' | 'MarketOnOpeningOrder' | 'StopOrder';

	export type ActionType = 'CreateOrder' | 'ModifyOrder' | 'CancelOrder' | 'ExpireOrder';

	export type OrderSourceType = 'Account' | 'Portfolio' | 'Position' | 'Found';

	export type Side = 'Buy' | 'Sell';

	export type TOrder = OpenOrder | TodayOrder | ExecutedOrder | DraftOrder | OptionOrder;

	export interface Response {
		clientKey: string;
		response: string;
	}

	export interface OpenOrder {
		orderId: number;
		userName: null | string;
		customerISIN: string;
		marketUnit: string;
		symbolISIN: string;
		price: number;
		orderVolume: number;
		triggerPrice: number;
		orderPlaceInPrice?: null | number;
		orderVolumeInPrice?: null | number;
		quantity: number;
		orderSide: Side;
		orderOrigin: string;
		parentOrderId: number;
		orderType: Types;
		validity: TBsValidityDates;
		validityDate: string;
		orderFrom: FormType;
		orderAction: ActionType | 0;
		orderMinimumQuantity: number;
		orderDateTime: string;
		hostOrderNumber: null | string;
		expectedRemainingQuantity: number;
		sumExecuted: number;
		symbolTitle: string;
		position: number;
		valuePosition: number;
		lastTradePrice: number;
		orderStatus: StatusType;
		lastErrorCode: string | null;
		customErrorMsg: string | null;
		orderPlaceInPrice?: null | number;
		orderVolumeInPrice?: null | number;
		tradeDetails: TradeDetailsType;
		isEditable: boolean;
		blockType: OrderSourceType;
	}

	export interface TodayOrder {
		clientKey: string;
		orderId: number;
		userName: null | string;
		customerISIN: string;
		marketUnit: string;
		symbolISIN: string;
		price: number;
		orderVolume: number;
		triggerPrice: number;
		orderPlaceInPrice?: null | number;
		orderVolumeInPrice?: null | number;
		quantity: number;
		orderSide: Side;
		orderOrigin: string;
		parentOrderId: number;
		orderType: Types;
		validity: TBsValidityDates;
		validityDate: string;
		orderFrom: FormType;
		orderAction: ActionType | 0;
		orderMinimumQuantity: number;
		orderDateTime: string;
		hostOrderNumber: null | string;
		expectedRemainingQuantity: number;
		sumExecuted: number;
		symbolTitle: string;
		position: number;
		valuePosition: number;
		lastTradePrice: number;
		orderStatus: StatusType;
		lastErrorCode: string | null;
		customErrorMsg: string | null;
		orderPlaceInPrice?: null | number;
		orderVolumeInPrice?: null | number;
		tradeDetails: TradeDetailsType;
		isEditable: boolean;
		blockType: OrderSourceType;
	}

	export interface ExecutedOrder {
		orderId: number;
		userName: null | string;
		customerISIN: string;
		marketUnit: string;
		symbolISIN: string;
		price: number;
		orderVolume: number;
		triggerPrice: number;
		orderPlaceInPrice?: null | number;
		orderVolumeInPrice?: null | number;
		quantity: number;
		orderSide: Side;
		orderOrigin: string;
		parentOrderId: number;
		orderType: Types;
		validity: TBsValidityDates;
		validityDate: string;
		orderFrom: FormType;
		orderAction: ActionType | 0;
		orderMinimumQuantity: number;
		orderDateTime: string;
		hostOrderNumber: null | string;
		expectedRemainingQuantity: number;
		sumExecuted: number;
		symbolTitle: string;
		position: number;
		valuePosition: number;
		lastTradePrice: number;
		orderStatus: StatusType;
		lastErrorCode: string | null;
		customErrorMsg: string | null;
		orderPlaceInPrice?: null | number;
		orderVolumeInPrice?: null | number;
		tradeDetails: TradeDetailsType;
		isEditable: boolean;
		blockType: OrderSourceType;
	}

	export interface DraftOrder {
		id: number;
		symbolISIN: string;
		symbolTitle: string;
		price: number;
		quantity: number;
		side: Side;
		validity: TBsValidityDates;
		validityDate: string;
		date: string;
		blockType?: OrderSourceType;
	}

	export interface OptionOrder {
		orderId: number;
		side: 'Call' | 'Put';
		canClosePosition: boolean;
		availableClosePosition: number;
		customerISIN: string;
		symbolISIN: string;
		positionCount: number;
		blockedMargin: number;
		blockedAsset: number;
		variationMargin: number;
		physicalSettlementDate: string;
		cashSettlementDate: string;
		contractSize: number;
		strikePrice: number;
		finalPrice: number;
		gainedPortfolioLoss: number;
		profitLoss_ClosingPrice: number;
		profitLoss_ClosingPricePercent: number;
		profitLoss_LastPrice: number;
		profitLoss_LastPricePercent: number;
		remainDays: number;
		symbolTitle: string;
		companyISIN: string;
		isFreeze: boolean;
		isSwapped: boolean;
		blockType: OrderSourceType;
	}
}

declare namespace Message {
	export type MessageType = 'Oppening' | 'Stop' | 'Limitation' | 'Information';

	export interface Supervisor {
		id: number;
		messageTitle: string;
		messageBody: string;
		symbolISINs: string[];
		dateOfEvent: string;
		read: boolean;
		type: string;
	}
}

declare namespace Dashboard {
	export type TMarketStateExchange = 'Bourse' | 'FaraBourse' | 'Option';

	export type TIndex = 'Overall' | 'EqualWeightOverall' | 'RetailTrades';

	export type TTopSymbols = 'Option' | 'BaseSymbol' | 'Symbol';

	export type TOptionSide = 'Call' | 'Put';

	export type TInterval = 'Today' | 'Week' | 'Month' | 'ThreeMonths' | 'Year';

	export type TNewAndOld = 'FirstTradedOptionSymbol' | 'MostTradedOptionSymbol';

	export type TTopSymbol = GetTopSymbols.BaseSymbol.Type | GetTopSymbols.Symbol.Type | GetTopSymbols.Option.Type;

	export interface GetIndexDetails {
		overallValue: number;
		overallValuePercent: number;
		equalWeightOverallValue: number;
		equalWeightOverallPercent: number;
		retailTradesValue: number;
		retailTradesPercent: number;
	}

	export namespace GetMarketState {
		export type All = GetMarketState.Bourse | GetMarketState.FaraBourse | GetMarketState.Option;
		export interface Bourse {
			index: number;
			tradeVolume: number | null;
			tradeValue: number | null;
			marketValue: number;
			tradeCount: number;
		}

		export interface FaraBourse extends GetMarketState.Bourse {}

		export interface Option {
			tradeVolume: number | null;
			tradeValue: number | null;
			putValue: number;
			callValue: number;
		}
	}

	export namespace GetIndex {
		export interface Overall {
			symbolTitle: string;
			date: string;
			time:
				| 'ticks'
				| 'days'
				| 'hours'
				| 'milliseconds'
				| 'minutes'
				| 'seconds'
				| 'totalDays'
				| 'totalHours'
				| 'totalMilliseconds'
				| 'totalMinutes'
				| 'totalSeconds';
			lastIndexValueInDay: number;
		}

		export interface EqualWeightOverall extends Overall {
			ticks: 0;
			days: 0;
			hours: 0;
			milliseconds: 0;
			minutes: 0;
			seconds: 0;
			totalDays: 0;
			totalHours: 0;
			totalMilliseconds: 0;
			totalMinutes: 0;
			totalSeconds: 0;
		}

		export type RetailTrades = Record<string, number>;
	}

	export namespace GetTopSymbols {
		export type Data = Option.Data | BaseSymbol.Data | Symbol.Data;

		export namespace Option {
			export type Type =
				| 'OptionValue'
				| 'OptionOpenPosition'
				| 'OptionVolatility'
				| 'OptionTradeCount'
				| 'OptionYesterdayDiff'
				| 'OptionVolume';

			export type All = Value | OpenPosition | Volatility | TradeCount | YesterdayDiff | Volume;

			export type ORecord<T> = Record<TOptionSides, T>;

			export type Data = Array<ORecord<All>>;

			export type FakeData = ORecord<All[]>;

			export type Value = {
				totalTradeValue: number;
				lastTradedPrice: number;
				symbolTitle: string;
				symbolISIN: string;
				dueDays: number;
				optionType: TOptionSide;
			};

			export type OpenPosition = {
				openPositionCount: number;
				openPositionVarPercent: number;
				openPositionCountDiff: number;
				symbolTitle: string;
				symbolISIN: string;
				dueDays: number;
				optionType: TOptionSide;
			};

			export type Volatility = {
				volatilityPercent: number;
				volatility: number;
				symbolTitle: string;
				symbolISIN: string;
				dueDays: number;
				optionType: TOptionSide;
			};

			export type TradeCount = {
				totalNumberOfTradesVarPercent: number;
				totalNumberOfTrades: number;
				symbolTitle: string;
				symbolISIN: string;
				dueDays: number;
				optionType: TOptionSide;
			};

			export type YesterdayDiff = {
				closingPriceVarReferencePrice: number;
				closingPriceVarReferencePricePercent: number;
				symbolTitle: string;
				symbolISIN: string;
				dueDays: number;
				optionType: TOptionSide;
			};

			export type Volume = {
				totalNumberOfSharesTradedVarPercent: number;
				totalNumberOfSharesTraded: number;
				symbolTitle: string;
				symbolISIN: string;
				dueDays: number;
				optionType: TOptionSide;
			};
		}

		export namespace BaseSymbol {
			export type Data = Value[] | PutOpenPosition[] | CallOpenPosition[] | OpenPosition[] | Volume[];

			export type Type =
				| 'BaseSymbolValue'
				| 'BaseSymbolPutOpenPosition'
				| 'BaseSymbolCallOpenPosition'
				| 'BaseSymbolOpenPosition'
				| 'BaseSymbolVolume';

			export interface Value {
				symbolTitle: string;
				symbolISIN: string;
				totalTradeValue: number;
				thirtyDayValue: number;
				ninetyDayValue: number;
				lastTradedPrice: number;
				tradePriceVarPreviousTradePercent: number;
			}

			export interface PutOpenPosition {
				baseSymbolTitle: string;
				baseSymbolISIN: string;
				openPosition: number;
				openPositionVarPercent: number;
				contractCount: number;
				closestEndDate: string;
			}

			export interface CallOpenPosition {
				baseSymbolTitle: string;
				baseSymbolISIN: string;
				openPosition: number;
				openPositionVarPercent: number;
				contractCount: number;
				closestEndDate: string;
			}

			export interface OpenPosition {
				baseSymbolTitle: string;
				baseSymbolISIN: string;
				openPosition: number;
				openPositionVarPercent: number;
				contractCount: number;
				closestEndDate: string;
			}

			export interface Volume {
				symbolTitle: string;
				baseSymbolISIN: string;
				totalNumberOfSharesTraded: number;
				thirtyDayVolume: number;
				ninetyDayVolume: number;
				lastTradedPrice: number;
				tradePriceVarPreviousTradePercent: number;
			}
		}

		export namespace Symbol {
			export type Data = Value[] | Volume[];

			export type Type = 'SymbolValue' | 'SymbolVolume';

			export interface Value {
				symbolTitle: string;
				symbolISIN: string;
				totalTradeValue: number;
				thirtyDayValue: number;
				ninetyDayValue: number;
				lastTradedPrice: number;
				tradePriceVarPreviousTradePercent: number;
			}

			export interface Volume {
				symbolTitle: string;
				symbolISIN: string;
				totalNumberOfSharesTraded: number;
				thirtyDayVolume: number;
				ninetyDayVolume: number;
				lastTradedPrice: number;
				tradePriceVarPreviousTradePercent: number;
			}
		}
	}

	export namespace GetOptionContractAdditionalInfo {
		export type All = IOTM[] | ContractType[];

		export type Basis = 'Volume' | 'Value';

		export type Type = 'IOTM' | 'ContractType';

		export type DataPoint = null | 'atm' | 'otm' | 'itm' | 'call' | 'put';

		export interface IOTM {
			iotm: 'ATM' | 'OTM' | 'ITM';
			tradeValue: number;
			valuePercentageOfTotal: number;
			tradeVolume: number;
			volumePercentageOfTotal: number;
		}

		export interface ContractType {
			contractType: TOptionSide;
			tradeValue: number;
			valuePercentageOfTotal: number;
			tradeVolume: number;
			volumePercentageOfTotal: number;
		}
	}

	export namespace GetOptionMarketComparison {
		export type TChartType = 'OptionToMarket' | 'OptionBuyToMarket' | 'OptionSellToMarket';

		export type Data = Record<string, number>;
	}

	export namespace GetMarketProcessChart {
		export type TChartType = 'Value' | 'Volume' | 'NotionalValue';

		export type Data = Record<string, number>;
	}

	export namespace GetOptionTradeProcess {
		export type TChartType = 'Process' | 'PutToCall';

		export interface Data {
			intervalDateTime: string;
			callValue: number;
			putValue: number;
		}
	}

	export namespace GetOptionWatchlistPriceChangeInfo {
		export interface Data {
			count: number;
			state: string;
		}
	}

	export namespace GetOpenPositionProcess {
		export type Data = Record<string, number>;
	}

	export namespace GetAnnualReport {
		export type Type = 'FundIncrease' | 'Other';

		export interface Data {
			symbolTitle: string;
			symbolISIN: string;
			dateTime: string;
			title: string;
		}
	}

	export namespace GetFirstTradedOptionSymbol {
		export interface Data {
			symbolISIN: string;
			contractEndDate: string;
			symbolTitle: string;
			firstTradeDate: string;
			numberOfDaysUntilNow: number;
		}
	}

	export namespace GetMostTradedOptionSymbol {
		export interface Data {
			symbolISIN: string;
			contractEndDate: string;
			symbolTitle: string;
			workingDaysTradedCount: number;
		}
	}

	export namespace GetTopOptionBaseSymbolValue {
		export interface Data {
			todayTopOptionBaseSymbolValues: GetTopOptionBaseSymbolValue.Symbol[];
			weekTopOptionBaseSymbolValues: GetTopOptionBaseSymbolValue.Symbol[];
			monthTopOptionBaseSymbolValues: GetTopOptionBaseSymbolValue.Symbol[];
		}

		export interface Symbol {
			symbolISIN: string;
			symbolTitle: string;
			todayValue: number;
		}
	}

	export namespace GetOptionSettlementInfo {
		export type Type = 'MostRecent' | 'Closest';

		export type Data = GetOptionSettlementInfo.MostRecentData | GetOptionSettlementInfo.ClosestData;

		export interface MostRecentData {
			symbolTitle: string;
			symbolISIN: string;
			mostRecentPassedDays: number;
			totalTradeValue: number;
			totalTradeVolume: number;
		}

		export interface ClosestData {
			symbolTitle: string;
			symbolISIN: string;
			closestDueDays: number;
			totalTradeValue: number;
			totalTradeVolume: number;
		}
	}

	export namespace GetIndividualLegalInfo {
		export type SymbolType = 'Option' | 'BaseSymbol';

		export type Type = 'Individual' | 'Legal';

		export type Data = GetIndividualLegalInfo.Individual | GetIndividualLegalInfo.Legal;

		export interface Individual {
			dateTime: string;
			individualBuyAverage: number;
			individualSellAverage: number;
		}

		export interface Legal {
			dateTime: string;
			sumOfLegalsBuyVolume: number;
			sumOfLegalsSellVolume: number;
		}
	}
}

declare namespace Settings {
	export interface IBrokerCustomerSettings {
		id: number;
		configKey:
			| 'confirmBeforeDelete'
			| 'confirmBeforeSendOrder'
			| 'defaultBuyVolume'
			| 'defaultSellVolume'
			| 'sendSupervisorMarketMessage'
			| 'showSymbolDetailsInBuySellModal'
			| 'breakEvenPoint';
		configValue: string;
		saveDate: string;
	}

	export type IFormattedBrokerCustomerSettings = Record<IBrokerCustomerSettings['configKey'], string | boolean>;

	export interface IAgreements {
		agreementId: number;
		title: string;
		state: 'NotSpecified' | 'Accepted' | 'NotAccepted';
		changeDate: string;
		description: string;
		type: string;
		canChangeByCustomer: boolean;
		approveBySMS: boolean;
		attachmentUrl: string | null;
	}

	export interface IMobileOTP {
		expireDate: number;
		retryToken: string;
		starredMessage: string;
		state: boolean;
	}
}

declare namespace Payment {
	export type ThistoryState =
		| 'Request'
		| 'RequestBankToken'
		| 'RequestBankTokenOk'
		| 'RequestBankTokenError'
		| 'RedirectToBank'
		| 'OkBeforeVerify'
		| 'VerifyCheck'
		| 'VerifyCheckFailed'
		| 'Verify'
		| 'DoubleSpendingCheckFailed'
		| 'DoubleSpendingCheckedOk'
		| 'Done'
		| 'CanceledByUser'
		| 'Failed'
		| 'SessionIsNull'
		| 'InvalidParameters'
		| 'MerchantIpAddressIsInvalid'
		| 'TokenNotFound'
		| 'TokenRequired'
		| 'TerminalNotFound';

	type TFreezeRequestState = 'Done' | 'InProgress' | 'FreezeFailed';

	type TDepositTab = 'receiptDepositTab' | 'liveDepositTab';

	export type TRemainsWithDay = Record<
		't1' | 't2',
		{
			date: number;
			valid: boolean;
			amount: string;
		}
	>;

	export interface IDepositResponse {
		bankToken: string;
		amount: number;
		merchantId: null;
		reservationNumber: string;
		redirectUrl: string | null;
		wage: number;
		errorMessage: string | null;
		isSuccessful: boolean;
		mobilePhone: number;
	}

	export interface IDepositHistoryList {
		reservationNumber: number;
		saveDate: string;
		amount: number;
		providerType: string;
		state: ThistoryState;
	}

	export interface IChangeBrokerList {
		id: number;
		saveDate: string;
		symbolISIN: string;
		lastState: string;
		attachmentId: number;
		symbolTitle: string;
		hasAttachment: boolean;
	}

	export interface IBrokerAccount {
		id: string;
		bankName: string;
		bankBranch: string;
		accountType: string;
		accountNumber: string;
		permittedToPay: boolean;
		permittedToReceive: boolean;
	}

	export interface IUserBankAccount {
		id: number;
		shaba: string;
		accountNumber: string;
		bankName: string;
		isDefault: number;
	}

	export interface IWithdrawalForm {
		bankAccount: IUserBankAccount | null;
		withdrawalType: string | null;
		amount: string;
	}

	export interface IDrawalHistoryList {
		id: number;
		accountNumber: string;
		bankAccountId: number;
		branchId: number;
		comment: string;
		customerAccountId: number;
		customerBank: string;
		customerISIN: string;
		errorMessage: string;
		channel: string;
		id: number;
		nationalCode: string;
		requestDate: string;
		requestAmount: number;
		saveDate: string;
		state: string;
	}

	export interface IRecentFreezeList {
		saveDate: string;
		symbolISIN: string;
		symbolTitle: string;
		requestState: TFreezeRequestState;
	}

	export interface ICountFreeze {
		symbolISIN: string;
		symbolTitle: string;
		count: number;
	}
}

declare namespace Strategy {
	declare type Cheap =
		| 'HighRisk'
		| 'LowRisk'
		| 'NoRisk'
		| 'ModerateRisk'
		| 'LimitedInterest'
		| 'UnlimitedInterest'
		| 'LimitedLoss'
		| 'NoLimit'
		| 'UnlimitedLoss'
		| 'BullishMarket'
		| 'BearishMarket'
		| 'NeutralMarket'
		| 'AllMarket'
		| 'DirectionalMarket';

	declare type Type =
		| 'CoveredCall'
		| 'LongCall'
		| 'LongPut'
		| 'ProtectivePut'
		| 'BullCallSpread'
		| 'LongStraddle'
		| 'BearPutSpread'
		| 'Conversion';

	declare type AllStrategies =
		| CoveredCall
		| LongCall
		| LongPut
		| LongStraddle
		| Conversion
		| BullCallSpread
		| ProtectivePut
		| BearPutSpread;

	export interface GetAll {
		id: number;
		title: string;
		type: Type;
		imageUrl: string;
		tags: Cheap[];
	}

	export interface CoveredCall {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		nonExpiredYTM: number;
		bepDifferencePercent: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		symbolISIN: string;
		symbolTitle: string;
		strikePrice: number;
		openPositionCount: number;
		iotm: Option.IOTM;
		premium: number;
		tradePriceVarPreviousTradePercent: number;
		optionBestBuyLimitQuantity: number;
		optionBestBuyLimitPrice: number;
		baseBestSellLimitPrice: number;
		baseBestBuyLimitPrice: number;
		optionBestSellLimitPrice: number;
		optionBestSellLimitQuantity: number;
		baseClosingPrice: number;
		tradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradedDate: string;
		coveredCallBEP: number;
		maxProfit: number;
		maxProfitPercent: number;
		inUseCapital: number;
		bestBuyYTM: number;
		bestSellYTM: number;
		bepDifference: number;
		riskCoverage: number;
		nonExpiredProfit: number;
		nonExpiredProfitPercent: number;
		marketUnit: string;
		baseMarketUnit: string;
		historicalVolatility: number;
		requiredMargin: number;
		contractEndDate: string;
		contractSize: number;
		requiredMargin: number;
	}

	export interface LongCall {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		symbolISIN: string;
		symbolTitle: string;
		strikePrice: number;
		openPositionCount: number;
		iotm: Option.IOTM;
		premium: number;
		tradePriceVarPreviousTradePercent: number;
		optionBestSellLimitPrice: number;
		optionBestSellLimitQuantity: number;
		longCallBEP: number;
		profitAmount: number;
		profitPercent: number;
		blackScholes: number;
		bepDifference: number;
		timeValue: number;
		intrinsicValue: number;
		optionBestLimitPrice: number;
		optionBestLimitVolume: number;
		tradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradedDate: string;
		ytm: number;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		requiredMargin: number;
		contractEndDate: string;
		contractSize: number;
	}

	export interface LongPut {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		symbolISIN: string;
		symbolTitle: string;
		strikePrice: number;
		openPositionCount: number;
		iotm: Option.IOTM;
		premium: number;
		tradePriceVarPreviousTradePercent: number;
		optionBestSellLimitPrice: number;
		optionBestSellLimitQuantity: number;
		longPutBEP: number;
		profitAmount: number;
		profitPercent: number;
		blackScholes: number;
		bepDifference: number;
		timeValue: number;
		intrinsicValue: number;
		optionBestLimitPrice: number;
		optionBestLimitVolume: number;
		tradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradedDate: string;
		ytm: number;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		requiredMargin: number;
		contractEndDate: string;
		contractSize: number;
	}

	export interface LongStraddle {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		strikePrice: number;
		callSymbolISIN: string;
		callSymbolTitle: string;
		callBestSellLimitPrice: number;
		callBestSellLimitQuantity: number;
		callBestBuyLimitPrice: number;
		callBestBuyLimitQuantity: number;
		putBestBuyLimitPrice: number;
		putBestBuyLimitQuantity: number;
		putSymbolISIN: string;
		putSymbolTitle: string;
		putBestSellLimitPrice: number;
		putBestSellLimitQuantity: number;
		callOpenPositionCount: number;
		putOpenPositionCount: number;
		callIOTM: string;
		putIOTM: string;
		callPremium: number;
		callPremiumPercent: number;
		putPremium: number;
		putPremiumPercent: number;
		lowBEP: number;
		highBEP: number;
		maxLoss: number;
		inUseCapital: number;
		callTimeValue: number;
		putTimeValue: number;
		callIntrinsicValue: number;
		putIntrinsicValue: number;
		callTradeValue: number;
		putTradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		callRequiredMargin: number;
		putRequiredMargin: number;
		contractEndDate: string;
		baseLastTradedDate: string;
		contractSize: number;
	}

	export interface Conversion {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		strikePrice: number;
		callSymbolISIN: string;
		callSymbolTitle: string;
		callBestSellLimitPrice: number;
		callBestSellLimitQuantity: number;
		callPremium: number;
		callPremiumPercent: number;
		callIOTM: Option.IOTM;
		callOpenPositionCount: number;
		putSymbolISIN: string;
		putSymbolTitle: string;
		putBestSellLimitPrice: number;
		putBestSellLimitQuantity: number;
		putOpenPositionCount: number;
		callBestBuyLimitPrice: number;
		callBestBuyLimitQuantity: number;
		putBestBuyLimitPrice: number;
		putBestBuyLimitQuantity: number;
		putIOTM: Option.IOTM;
		putPremium: number;
		putPremiumPercent: number;
		profit: number;
		inUseCapital: number;
		bestBuyYTM: number;
		bestSellYTM: number;
		callTimeValue: number;
		putTimeValue: number;
		callIntrinsicValue: number;
		putIntrinsicValue: number;
		callTradeValue: number;
		putTradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradedDate: string;
		marketUnit: string;
		baseMarketUnit: string;
		historicalVolatility: number;
		contractEndDate: string;
		contractSize: number;
		requiredMargin: number;
	}

	export interface BullCallSpread {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		// اعمال پایین
		lspSymbolISIN: string;
		lspSymbolTitle: string;
		lspStrikePrice: number;
		lspBestSellLimitPrice: number;
		lspBestSellLimitQuantity: number;
		lspBestBuyLimitPrice: number;
		lspBestBuyLimitQuantity: number;
		// اعمال بالا
		hspSymbolISIN: string;
		hspSymbolTitle: string;
		hspStrikePrice: number;
		hspBestBuyLimitPrice: number;
		hspBestBuyLimitQuantity: number;
		hspBestSellLimitPrice: number;
		hspBestSellLimitQuantity: number;
		lspOpenPositionCount: number;
		hspOpenPositionCount: number;
		lspiotm: Option.IOTM;
		hspiotm: Option.IOTM;
		lspPremium: number;
		lspPremiumPercent: number;
		hspPremium: number;
		hspPremiumPercent: number;
		bullCallSpreadBEP: number;
		maxProfit: number;
		maxProfitPercent: number;
		maxLoss: number;
		inUseCapital: number;
		lspTimeValue: number;
		hspTimeValue: number;
		lspIntrinsicValue: number;
		historicalVolatility: number;
		hspIntrinsicValue: number;
		lspTradeValue: number;
		hspTradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradedDate: string;
		ytm: number;
		marketUnit: string;
		baseMarketUnit: string;
		contractEndDate: string;
		contractSize: number;
		requiredMargin: number;
	}

	export interface ProtectivePut {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		symbolISIN: string;
		symbolTitle: string;
		strikePrice: number;
		openPositionCount: number;
		iotm: Option.IOTM;
		premium: number;
		tradePriceVarPreviousTradePercent: number;
		optionBestBuyLimitQuantity: number;
		optionBestBuyLimitPrice: number;
		contractSize: number;
		baseBestSellLimitPrice: number;
		baseBestBuyLimitPrice: number;
		optionBestSellLimitPrice: number;
		optionBestSellLimitQuantity: number;
		protectivePutBEP: number;
		maxLoss: number;
		profitAmount: number;
		profitPercent: number;
		inUseCapital: number;
		bepDifference: number;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		requiredMargin: number;
		contractEndDate: string;
		timeValue: number;
		blackScholes: number;
		intrinsicValue: number;
		optionBestLimitPrice: number;
		optionBestLimitVolume: number;
		tradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradedDate: string;
	}

	export interface BearPutSpread {
		baseSymbolISIN: string;
		baseSymbolTitle: string;
		baseLastTradedPrice: number;
		baseTradePriceVarPreviousTradePercent: number;
		dueDays: number;
		lspSymbolISIN: string;
		lspSymbolTitle: string;
		lspStrikePrice: number;
		lspBestSellLimitPrice: number;
		lspBestSellLimitQuantity: number;
		lspBestBuyLimitPrice: number;
		lspBestBuyLimitQuantity: number;
		hspSymbolISIN: string;
		hspSymbolTitle: string;
		hspStrikePrice: number;
		hspBestBuyLimitPrice: number;
		hspBestBuyLimitQuantity: number;
		hspBestSellLimitPrice: number;
		hspBestSellLimitQuantity: number;
		lspOpenPositionCount: number;
		hspOpenPositionCount: number;
		lspiotm: Option.IOTM;
		hspiotm: Option.IOTM;
		lspPremium: number;
		lspPremiumPercent: number;
		hspPremium: number;
		hspPremiumPercent: number;
		bearPutSpreadBEP: number;
		maxProfit: number;
		maxProfitPercent: number;
		maxLoss: number;
		inUseCapital: number;
		lspTimeValue: number;
		hspTimeValue: number;
		lspIntrinsicValue: number;
		hspIntrinsicValue: number;
		lspTradeValue: number;
		hspTradeValue: number;
		baseTradeValue: number;
		baseTradeCount: number;
		baseTradeVolume: number;
		baseLastTradedDate: string;
		baseMarketUnit: string;
		marketUnit: string;
		historicalVolatility: number;
		lspRequiredMargin: number;
		hspRequiredMargin: number;
		contractEndDate: string;
		contractSize: number;
		ytm: number;
	}
}

declare namespace Reports {
	export interface ITransactions {
		debit: string;
		credit: string;
		remaining: string;
		description: string;
		date: string;
		station: string;
		symbolIsin: string;
		transactionType: 'Withdrawal' | 'Deposit' | 'Charge' | 'Buy' | 'Sell';
	}

	export interface IInstantDeposit {
		reservationNumber: number;
		referenceNumber: string;
		saveDate: string;
		amount: number;
		providerType: string;
		state:
			| 'CanceledByUser'
			| 'Done'
			| 'DoubleSpendingCheckedOk'
			| 'DoubleSpendingCheckFailed'
			| 'RedirectToBank'
			| 'Request'
			| 'RequestBankToken'
			| 'RequestBankTokenError'
			| 'Verify'
			| 'VerifyCheck'
			| 'VerifyCheckFailed'
			| 'OkBeforeVerifys';
		errorMessage: string;
	}

	export interface IDepositWithReceipt {
		id: number;
		nationalCode: string;
		customerISIN: string;
		date: string;
		bankAccountId: string;
		amount: number;
		receiptNumber: string;
		comment: string;
		receiptDate: string;
		accountCode: string;
		state: 'InOMSQueue' | 'OrderDone' | 'Error' | 'Modified' | 'Expired' | 'Canceled';
		providerType: string;
		base64Image: File | null;
	}

	export interface IWithdrawal {
		id: number;
		accountNumber: string;
		bankAccountId: number;
		branchId: number;
		comment: string;
		customerAccountId: number;
		customerBank: string;
		customerISIN: string;
		errorMessage: string;
		channel: string;
		id: number;
		nationalCode: string;
		requestDate: string;
		requestAmount: number;
		saveDate: string;
		state: string;
	}

	export interface IChangeBrokerReports {
		id: number;
		saveDate: string;
		symbolISIN: string;
		lastState: string;
		attachmentId: number;
		symbolTitle: string;
		hasAttachment: boolean;
	}

	export interface IFreezeUnfreezeReports {
		symbolISIN: string;
		symbolTitle: string;
		requestType: 'Freeze' | 'UnFreeze';
		requestState: FreezeUnFreezeReports.TFreezeRequestState;
		description: string;
		confirmed: boolean;
		confirmedOn: string;
	}

	export interface ICashSettlementReports {
		id: number;
		symbolTitle: string;
		symbolISIN: string;
		symbolTitle: string;
		openPositionCount: number;
		cashSettlementDate: string;
		side: 'Call' | 'Put';
		settlementRequestType: 'MaximumStrike' | 'PartialStrike' | null;
		requestCount: number;
		enabled: boolean;
		status:
			| 'Registered'
			| 'Sent'
			| 'Sending'
			| 'Settled'
			| 'Settling'
			| 'Expired'
			| 'Draft'
			| 'SendToBourse'
			| 'InSendQueue';
		doneCount: number;
		pandLStatus: string;
		history: IOptionHistory[];
		userType: 'System' | 'UserTitle' | 'Backoffice';
		userName: string;
		updatedAt: string | null;
		incomeValue: number;
	}

	export interface IPhysicalSettlementReports {
		id: number;
		symbolISIN: string;
		symbolTitle: string;
		openPositionCount: number;
		cashSettlementDate: string;
		side: 'Call' | 'Put';
		settlementRequestType: 'MaximumStrike' | 'PartialStrike' | null;
		requestCount: number;
		status:
			| 'Registered'
			| 'Sent'
			| 'Sending'
			| 'Settled'
			| 'Settling'
			| 'Expired'
			| 'Draft'
			| 'SendToBourse'
			| 'InSendQueue';
		doneCount: number;
		pandLStatus: 'Profit' | 'Loss';
		penCount: number;
		penValue: string;
		history: IOptionHistory[];
		requestForLostOrProfit: boolean;
		enabled: boolean;
		userType: 'System' | 'UserTitle' | 'Backoffice';
		userName: string;
		updatedAt: string | null;
		incomeValue: number;
		penVolume: number;
		peValue: number;
	}

	export interface IOrdersReports {
		orderId: number;
		userName: null | string;
		customerISIN: string;
		marketUnit: string;
		symbolISIN: string;
		price: number;
		orderVolume: number;
		triggerPrice: number;
		orderPlaceInPrice?: null | number;
		orderVolumeInPrice?: null | number;
		quantity: number;
		orderSide: TOrdersSide;
		orderOrigin: string;
		parentOrderId: number;
		orderType: TOrdersTypes;
		validity: TOrdersValidity;
		validityDate: string;
		orderFrom: TOrdersForm;
		orderAction: TOrdersAction | 0;
		orderMinimumQuantity: number;
		orderDateTime: string;
		hostOrderNumber: null | string;
		expectedRemainingQuantity: number;
		sumExecuted: number;
		symbolTitle: string;
		position: number;
		valuePosition: number;
		lastTradePrice: number;
		orderStatus: TOrdersStatus;
		lastErrorCode: string | null;
		customErrorMsg: string | null;
		orderPlaceInPrice?: null | number;
		orderVolumeInPrice?: null | number;
		tradeDetails: TTradeDetails;
		isEditable: boolean;
		blockType: TOrderSource;
	}

	export interface ITradesReports {
		orderId: number;
		userName: string;
		customerISIN: string;
		symbolISIN: string;
		price: number;
		triggerPrice: number;
		quantity: number;
		orderSide: 'Buy' | 'Sell';
		orderOrigin: string;
		parentOrderId: number;
		orderType: TOrdersTypes;
		validity: TOrdersValidity;
		validityDate: string;
		orderFrom: TOrdersForm;
		orderAction: TOrdersAction | 0;
		orderMinimumQuantity: number;
		orderDateTime: string;
		hostOrderNumber: string;
		expectedRemainingQuantity: number;
		sumExecuted: number;
		symbolTitle: string;
		position: number;
		valuePosition: number;
		lastTradePrice: number;
		orderStatus: TOrdersStatus;
		lastErrorCode: string;
		customErrorMsg: string;
		tradeDetails: TTradeDetails;
	}
}
