declare namespace Option {
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
		 * ارزش مفهومی / ارزش ذاتی
		 */
		notionalValue: number;
		/**
		 * O/I TM
		 */
		iotm: 'atm' | 'otm' | 'itm';
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

	export interface SymbolSearch {
		symbolTitle: string;
		symbolISIN: string;
		insCode: string;
	}
}

declare namespace OAuthAPI {
	declare interface ILoginFirstStep {
		state: 'NewUser' | 'OTP' | 'TooManyRequest' | 'HasPassword' | 'Fail';
		otpRemainSecond: number;
		nextStepToken: string | null;
	}

	declare interface IForgetPasswordFirstStep {
		otpRemainSecond: number;
		nextStepToken: string;
	}

	declare interface IValidateForgetPasswordOTP {
		nextStepToken: string;
		responseMessage: string;
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
