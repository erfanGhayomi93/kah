export const pushengine = process.env.NEXT_PUBLIC_PUSHENGINE_URL!;

// CSR
export const oauth = process.env.NEXT_PUBLIC_OAUTH_URL!;
export const rlc = process.env.NEXT_PUBLIC_RLC_URL!;

// SSR
export const OAUTH_SSR = process.env.NEXT_PUBLIC_OAUTH_URL_SSR!;
export const RLC_SSR = process.env.NEXT_PUBLIC_RLC_URL_SSR!;

const routes = {
	pushengine,

	authentication: {
		LoginFirstStep: `${oauth}/OAuthAPI/v1/LoginFirstStep`,
		ForgetPasswordFirstStep: `${oauth}/OAuthAPI/v1/ForgetPasswordFirstStep`,
		SignUp: `${oauth}/OAuthAPI/v1/SignUp`,
		OtpLogin: `${oauth}/OAuthAPI/v1/OtpLogin`,
		PasswordLogin: `${oauth}/OAuthAPI/v1/PasswordLogin`,
		ChangePassword: `${oauth}/OAuthAPI/v1/ChangePassword`,
		ValidateForgetPasswordOtp: `${oauth}/OAuthAPI/v1/ValidateForgetPasswordOtp`,
		ChangeForgottenPassword: `${oauth}/OAuthAPI/v1/ChangeForgottenPassword`,
		SendPasslessOTP: `${oauth}/OAuthAPI/v1/SendPasslessOTP`,
		Logout: `${oauth}/OAuthAPI/v1/Logout`,
		GetUserInformation: `${oauth}/OAuthAPI/v1/GetUserInformation`,
	},

	dashboard: {
		GetOpenPositionProcess: `${rlc}/Dashboard/v1/GetOpenPositionProcess`,
		GetIndex: `${rlc}/Dashboard/v1/GetIndex`,
		GetIndexDetails: `${rlc}/Dashboard/v1/GetIndexDetails`,
		GetRetailTradeValues: `${rlc}/Dashboard/v1/GetRetailTradeValues`,
		GetMarketState: `${rlc}/Dashboard/v1/GetMarketState`,
		GetOptionTopSymbols: `${rlc}/Dashboard/v1/GetOptionTopSymbols`,
		GetBaseTopSymbols: `${rlc}/Dashboard/v1/GetBaseTopSymbols`,
		GetTopSymbols: `${rlc}/Dashboard/v1/GetTopSymbols`,
		GetOptionContractAdditionalInfo: `${rlc}/Dashboard/v1/GetOptionContractAdditionalInfo`,
		GetOptionMarketComparison: `${rlc}/Dashboard/v1/GetOptionMarketComparison`,
		GetOptionTradeProcess: `${rlc}/Dashboard/v1/GetOptionTradeProcess`,
		GetMarketProcessChart: `${rlc}/Dashboard/v1/GetMarketProcessChart`,
		GetOptionWatchlistPriceChangeInfo: `${rlc}/Dashboard/v1/GetOptionWatchlistPriceChangeInfo`,
		GetTopOptionBaseSymbolValue: `${rlc}/Dashboard/v1/GetTopOptionBaseSymbolValue`,
		GetFirstTradedOptionSymbol: `${rlc}/Dashboard/v1/GetFirstTradedOptionSymbol`,
		GetMostTradedOptionSymbol: `${rlc}/Dashboard/v1/GetMostTradedOptionSymbol`,
		GetOptionSettlementInfo: `${rlc}/Dashboard/v1/GetOptionSettlementInfo`,
		GetAnnualReport: `${rlc}/Dashboard/v1/GetAnnualReport`,
		GetIndividualLegalInfo: `${rlc}/Dashboard/v1/GetIndividualLegalInfo`,
	},

	common: {
		time: `${rlc}/Common/v1/Time`,
		GetBrokers: `${rlc}/Common/v1/GetBrokers`,
		GetBrokerApiUrls: `${rlc}/Common/v1/GetBrokerApiUrls`,
		GetBuyAndSellCommission: `${rlc}/Common/v1/GetBuyAndSellCommission`,
	},

	option: {
		OptionBaseSymbolSearch: `${rlc}/Option/v1/OptionBaseSymbolSearch`,
		ContractInfoHeader: `${rlc}/Option/v1/ContractInfoHeader`,
		BaseSettlementDays: `${rlc}/Option/v1/BaseSettlementDays`,
		GetContractInfoHistory: `${rlc}/Option/v1/GetContractInfoHistory`,
		GetOpenPositionReport: `${rlc}/Option/v1/GetOpenPositionReport`,
		OptionSymbolSearch: `${rlc}/Option/v1/OptionSymbolSearch`,
	},

	optionWatchlist: {
		Watchlist: `${rlc}/OptionWatchlist/v1/Watchlist`,
		WatchlistInfoBySymbolISIN: `${rlc}/OptionWatchlist/v1/WatchlistInfoBySymbolISIN`,
		WatchlistExcel: `${rlc}/OptionWatchlist/v1/WatchlistExcel`,
		WatchlistBySettlementDate: `${rlc}/OptionWatchlist/v1/WatchlistBySettlementDate`,
		OptionCalculativeInfo: `${rlc}/OptionWatchlist/v1/OptionCalculativeInfo`,
		OptionSymbolColumns: `${rlc}/OptionWatchlist/v1/OptionSymbolColumns`,
		DefaultOptionSymbolColumns: `${rlc}/OptionWatchlist/v1/DefaultOptionSymbolColumns`,
		ResetOptionSymbolColumns: `${rlc}/OptionWatchlist/v1/ResetOptionSymbolColumns`,
		UpdateOptionSymbolColumns: `${rlc}/OptionWatchlist/v1/UpdateOptionSymbolColumns`,
		GetAllCustomWatchlist: `${rlc}/OptionWatchlist/v1/GetAllCustomWatchlist`,
		CreateCustomWatchlist: `${rlc}/OptionWatchlist/v1/CreateCustomWatchlist`,
		UpdateCustomWatchlist: `${rlc}/OptionWatchlist/v1/UpdateCustomWatchlist`,
		ChangeHiddenCustomWatchlist: `${rlc}/OptionWatchlist/v1/ChangeHiddenCustomWatchlist`,
		UpdateCustomWatchlistOrder: `${rlc}/OptionWatchlist/v1/UpdateCustomWatchlistOrder`,
		DeleteCustomWatchlist: `${rlc}/OptionWatchlist/v1/DeleteCustomWatchlist`,
		GetCustomWatchlist: `${rlc}/OptionWatchlist/v1/GetCustomWatchlist`,
		GetCustomWatchlistExcel: `${rlc}/OptionWatchlist/v1/GetCustomWatchlistExcel`,
		CustomWatchlistOptionSearch: `${rlc}/OptionWatchlist/v1/CustomWatchlistOptionSearch`,
		AddSymbolCustomWatchlist: `${rlc}/OptionWatchlist/v1/AddSymbolCustomWatchlist`,
		RemoveSymbolCustomWatchlist: `${rlc}/OptionWatchlist/v1/RemoveSymbolCustomWatchlist`,
	},

	symbol: {
		SymbolInfo: `${rlc}/Symbol/v1/SymbolInfo`,
		BestLimit: `${rlc}/Symbol/v1/BestLimit`,
		Search: `${rlc}/Symbol/v1/Search`,
		SymbolHistory: `${rlc}/Symbol/v1/SymbolHistory`,
		GetSameSectorSymbolsBySymbolISIN: `${rlc}/Symbol/v1/GetSameSectorSymbolsBySymbolISIN`,
		GetSupervisedMessage: `${rlc}/Symbol/v1/GetSupervisedMessage`,
		ChartData: `${rlc}/Symbol/v1/ChartData`,
	},

	saturn: {
		GetAllSaturns: `${rlc}/Saturn/v1/GetAllSaturns`,
		GetSaturn: `${rlc}/Saturn/v1/GetSaturn`,
		Upsert: `${rlc}/Saturn/v1/Upsert`,
		Pin: `${rlc}/Saturn/v1/Pin`,
		Delete: `${rlc}/Saturn/v1/Delete`,
		SetActive: `${rlc}/Saturn/v1/SetActive`,
		GetActive: `${rlc}/Saturn/v1/GetActive`,
	},

	strategy: {
		CoveredCall: `${rlc}/Strategies/v1/CoveredCall`,
		LongCall: `${rlc}/Strategies/v1/LongCall`,
		LongPut: `${rlc}/Strategies/v1/LongPut`,
		LongStraddle: `${rlc}/Strategies/v1/LongStraddle`,
		Conversion: `${rlc}/Strategies/v1/Conversion`,
		ProtectivePut: `${rlc}/Strategies/v1/ProtectivePut`,
		BullCallSpread: `${rlc}/Strategies/v1/BullCallSpread`,
		BearPutSpread: `${rlc}/Strategies/v1/BearPutSpread`,
		GetAll: `${rlc}/Strategies/v1/GetAll`,
	},
};

export const ssrRoutes = {
	strategy: {
		GetAll: `${RLC_SSR}/Strategies/v1/GetAll`,
	},
};

export default routes;
