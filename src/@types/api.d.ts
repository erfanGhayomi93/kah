declare namespace Option {
	export interface Root {
		symbolInfo: SymbolInfo;
		optionWatchlistData: Watchlist;
	}

	export interface Watchlist {
		symbolISIN: string;
		companyISIN: string;
		premium: number;
		baseSymbolPrice: number;
		blackScholes: number;
		profitAndLoss: string;
		delta: number;
		volume: number;
		timeValue: number;
		intervalInterest: number;
		annualEffectiveInterest: number;
		growth: number;
		totalValue: number;
		valueContract: string;
		openPositionCount: number;
		highOpenPosition: string;
		notionalValue: number;
		callLeverage: number;
		putLeverage: number;
		callToBlackScholes: number;
		putToBlackScholes: number;
		bestPutPrice: number;
		bestCallPrice: number;
		spread: number;
		requiredMargin: number;
		individualCallVolume: number;
		legalCallVolume: number;
		individualPutVolume: number;
		legalPutVolume: number;
		theta: number;
		rho: number;
		vega: number;
		gamma: number;
		volatility: number;
		callImpliedVolatility: number;
		putImpliedVolatility: number;
		lastTradeDateTime: string;
	}

	export interface SymbolInfo {
		symbolISIN: string;
		companyISIN: string;
		title: string;
		companyName: string;
		strikePrice: number;
		baseSymbolTitle: string;
		baseSymbolISIN: string;
		optionType: string;
		daysToContractEndDate: number;
		contractEndDate: string;
		sectorTitle: string;
		subSectorName: null;
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
		message: string;
		token: string | null;
	}

	declare interface ISignUp {
		message: string;
		token: string | null;
	}
}
