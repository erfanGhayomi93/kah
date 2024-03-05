declare namespace Option {
	export type IOTM = 'atm' | 'otm' | 'itm';

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

	export interface Search {
		symbolISIN: string;
		symbolTitle: string;
		companyISIN: string;
		companyName: string;
		insCode: null | string;
		symbolTradeState: 'NULL' | 'Reserved' | 'Suspended' | 'Open' | 'Frozen' | null;
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
		workingDaysLeftCount: number;
		oneMonthTradeValue: number;
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
		lastTradedPrice: number;
		tradeVolume: number;
		tradeValue: number;
		avgIV: null | number;
		closingPrice: number;
		tradeCount: number;
		lastTradeDate: string;
		hv: number;
		symbolTradeState: 'NULL' | 'Reserved' | 'Suspended' | 'Open' | 'Frozen' | null;
		tradePriceVarPreviousTrade: number;
		tradePriceVarPreviousTradePercent: number;
		closingPriceVarReferencePrice: number;
		closingPriceVarReferencePricePercent: number;
		oneMonthAvgVolume: string;
		individualBuyVolume: number;
		individualSellVolume: number;
		legalBuyVolume: number;
		legalSellVolume: number;
		baseSymbolISIN: null | string;
		marketUnit: string;
		isOption: boolean;
	}

	export interface Search {
		symbolISIN: string;
		symbolTitle: string;
		companyISIN: string;
		isOption: boolean;
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

	interface URL {
		brokerCode: string | number;
		url: string;
	}

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
}

declare namespace Order {
	export interface Response {
		clientKey: string;
		response: string;
	}
}
