export const PUSHENGINE_URL = process.env.NEXT_PUBLIC_PUSHENGINE_URL!;

// CSR
export const OAUTH_URL = process.env.NEXT_PUBLIC_OAUTH_URL!;
export const BASE_URL = process.env.NEXT_PUBLIC_RLC_URL!;

// SSR
export const OAUTH_SSR_URL = process.env.NEXT_PUBLIC_OAUTH_URL_SSR!;
export const BASE_SSR_URL = process.env.NEXT_PUBLIC_RLC_URL_SSR!;

const routes = {
	pushengine: PUSHENGINE_URL,

	authentication: {
		LoginFirstStep: `${OAUTH_URL}/OAuthAPI/v1/LoginFirstStep`,
		ForgetPasswordFirstStep: `${OAUTH_URL}/OAuthAPI/v1/ForgetPasswordFirstStep`,
		SignUp: `${OAUTH_URL}/OAuthAPI/v1/SignUp`,
		OtpLogin: `${OAUTH_URL}/OAuthAPI/v1/OtpLogin`,
		PasswordLogin: `${OAUTH_URL}/OAuthAPI/v1/PasswordLogin`,
		ChangePassword: `${OAUTH_URL}/OAuthAPI/v1/ChangePassword`,
		ValidateForgetPasswordOtp: `${OAUTH_URL}/OAuthAPI/v1/ValidateForgetPasswordOtp`,
		ChangeForgottenPassword: `${OAUTH_URL}/OAuthAPI/v1/ChangeForgottenPassword`,
		SendPasslessOTP: `${OAUTH_URL}/OAuthAPI/v1/SendPasslessOTP`,
		Logout: `${OAUTH_URL}/OAuthAPI/v1/Logout`,
		GetUserInformation: `${OAUTH_URL}/OAuthAPI/v1/GetUserInformation`,
	},

	dashboard: {
		GetOpenPositionProcess: `${BASE_URL}/Dashboard/v1/GetOpenPositionProcess`,
		GetIndex: `${BASE_URL}/Dashboard/v1/GetIndex`,
		GetIndexDetails: `${BASE_URL}/Dashboard/v1/GetIndexDetails`,
		GetRetailTradeValues: `${BASE_URL}/Dashboard/v1/GetRetailTradeValues`,
		GetMarketState: `${BASE_URL}/Dashboard/v1/GetMarketState`,
		GetOptionTopSymbols: `${BASE_URL}/Dashboard/v1/GetOptionTopSymbols`,
		GetBaseTopSymbols: `${BASE_URL}/Dashboard/v1/GetBaseTopSymbols`,
		GetTopSymbols: `${BASE_URL}/Dashboard/v1/GetTopSymbols`,
		GetOptionContractAdditionalInfo: `${BASE_URL}/Dashboard/v1/GetOptionContractAdditionalInfo`,
		GetOptionMarketComparison: `${BASE_URL}/Dashboard/v1/GetOptionMarketComparison`,
		GetOptionTradeProcess: `${BASE_URL}/Dashboard/v1/GetOptionTradeProcess`,
		GetMarketProcessChart: `${BASE_URL}/Dashboard/v1/GetMarketProcessChart`,
		GetOptionWatchlistPriceChangeInfo: `${BASE_URL}/Dashboard/v1/GetOptionWatchlistPriceChangeInfo`,
		GetTopOptionBaseSymbolValue: `${BASE_URL}/Dashboard/v1/GetTopOptionBaseSymbolValue`,
		GetFirstTradedOptionSymbol: `${BASE_URL}/Dashboard/v1/GetFirstTradedOptionSymbol`,
		GetMostTradedOptionSymbol: `${BASE_URL}/Dashboard/v1/GetMostTradedOptionSymbol`,
		GetOptionSettlementInfo: `${BASE_URL}/Dashboard/v1/GetOptionSettlementInfo`,
		GetAnnualReport: `${BASE_URL}/Dashboard/v1/GetAnnualReport`,
		GetIndividualLegalInfo: `${BASE_URL}/Dashboard/v1/GetIndividualLegalInfo`,
	},

	common: {
		time: `${BASE_URL}/Common/v1/Time`,
		GetBrokers: `${BASE_URL}/Common/v1/GetBrokers`,
		GetBrokerApiUrls: `${BASE_URL}/Common/v1/GetBrokerApiUrls`,
		GetBuyAndSellCommission: `${BASE_URL}/Common/v1/GetBuyAndSellCommission`,
	},

	option: {
		OptionBaseSymbolSearch: `${BASE_URL}/Option/v1/OptionBaseSymbolSearch`,
		ContractInfoHeader: `${BASE_URL}/Option/v1/ContractInfoHeader`,
		BaseSettlementDays: `${BASE_URL}/Option/v1/BaseSettlementDays`,
		GetContractInfoHistory: `${BASE_URL}/Option/v1/GetContractInfoHistory`,
		GetOpenPositionReport: `${BASE_URL}/Option/v1/GetOpenPositionReport`,
		OptionSymbolSearch: `${BASE_URL}/Option/v1/OptionSymbolSearch`,
	},

	optionWatchlist: {
		Watchlist: `${BASE_URL}/OptionWatchlist/v1/Watchlist`,
		WatchlistInfoBySymbolISIN: `${BASE_URL}/OptionWatchlist/v1/WatchlistInfoBySymbolISIN`,
		WatchlistExcel: `${BASE_URL}/OptionWatchlist/v1/WatchlistExcel`,
		WatchlistBySettlementDate: `${BASE_URL}/OptionWatchlist/v1/WatchlistBySettlementDate`,
		OptionCalculativeInfo: `${BASE_URL}/OptionWatchlist/v1/OptionCalculativeInfo`,
		OptionSymbolColumns: `${BASE_URL}/OptionWatchlist/v1/OptionSymbolColumns`,
		DefaultOptionSymbolColumns: `${BASE_URL}/OptionWatchlist/v1/DefaultOptionSymbolColumns`,
		ResetOptionSymbolColumns: `${BASE_URL}/OptionWatchlist/v1/ResetOptionSymbolColumns`,
		UpdateOptionSymbolColumns: `${BASE_URL}/OptionWatchlist/v1/UpdateOptionSymbolColumns`,
		GetAllCustomWatchlist: `${BASE_URL}/OptionWatchlist/v1/GetAllCustomWatchlist`,
		CreateCustomWatchlist: `${BASE_URL}/OptionWatchlist/v1/CreateCustomWatchlist`,
		UpdateCustomWatchlist: `${BASE_URL}/OptionWatchlist/v1/UpdateCustomWatchlist`,
		ChangeHiddenCustomWatchlist: `${BASE_URL}/OptionWatchlist/v1/ChangeHiddenCustomWatchlist`,
		UpdateCustomWatchlistOrder: `${BASE_URL}/OptionWatchlist/v1/UpdateCustomWatchlistOrder`,
		DeleteCustomWatchlist: `${BASE_URL}/OptionWatchlist/v1/DeleteCustomWatchlist`,
		GetCustomWatchlist: `${BASE_URL}/OptionWatchlist/v1/GetCustomWatchlist`,
		GetCustomWatchlistExcel: `${BASE_URL}/OptionWatchlist/v1/GetCustomWatchlistExcel`,
		CustomWatchlistOptionSearch: `${BASE_URL}/OptionWatchlist/v1/CustomWatchlistOptionSearch`,
		AddSymbolCustomWatchlist: `${BASE_URL}/OptionWatchlist/v1/AddSymbolCustomWatchlist`,
		RemoveSymbolCustomWatchlist: `${BASE_URL}/OptionWatchlist/v1/RemoveSymbolCustomWatchlist`,
	},

	symbol: {
		SymbolInfo: `${BASE_URL}/Symbol/v1/SymbolInfo`,
		BestLimit: `${BASE_URL}/Symbol/v1/BestLimit`,
		Search: `${BASE_URL}/Symbol/v1/Search`,
		SymbolHistory: `${BASE_URL}/Symbol/v1/SymbolHistory`,
		GetSameSectorSymbolsBySymbolISIN: `${BASE_URL}/Symbol/v1/GetSameSectorSymbolsBySymbolISIN`,
		GetSupervisedMessage: `${BASE_URL}/Symbol/v1/GetSupervisedMessage`,
		ChartData: `${BASE_URL}/Symbol/v1/ChartData`,
	},

	saturn: {
		GetAllSaturns: `${BASE_URL}/Saturn/v1/GetAllSaturns`,
		GetSaturn: `${BASE_URL}/Saturn/v1/GetSaturn`,
		Upsert: `${BASE_URL}/Saturn/v1/Upsert`,
		Pin: `${BASE_URL}/Saturn/v1/Pin`,
		Delete: `${BASE_URL}/Saturn/v1/Delete`,
		SetActive: `${BASE_URL}/Saturn/v1/SetActive`,
		GetActive: `${BASE_URL}/Saturn/v1/GetActive`,
	},

	strategy: {
		CoveredCall: `${BASE_URL}/Strategies/v1/CoveredCall`,
		LongCall: `${BASE_URL}/Strategies/v1/LongCall`,
		LongPut: `${BASE_URL}/Strategies/v1/LongPut`,
		LongStraddle: `${BASE_URL}/Strategies/v1/LongStraddle`,
		Conversion: `${BASE_URL}/Strategies/v1/Conversion`,
		ProtectivePut: `${BASE_URL}/Strategies/v1/ProtectivePut`,
		BullCallSpread: `${BASE_URL}/Strategies/v1/BullCallSpread`,
		BearPutSpread: `${BASE_URL}/Strategies/v1/BearPutSpread`,
		GetAll: `${BASE_URL}/Strategies/v1/GetAll`,
	},
};

export const ssrRoutes = {
	strategy: {
		GetAll: `${BASE_SSR_URL}/Strategies/v1/GetAll`,
	},
};

export default routes;
