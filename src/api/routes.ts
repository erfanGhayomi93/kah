import { URLIsValid } from '@/utils/helpers';

const isStage = URLIsValid('stage');
const isDev = URLIsValid('localhost');

const oauthUrl = isStage || isDev ? 'https://ramandoauth-stage.ramandtech.com' : 'https://ramandoauth.ramandtech.com';
const rlcUrl = isStage || isDev ? 'https://kahkeshanapi-stage.ramandtech.com' : 'https://kahkeshanapi.ramandtech.com';

const routes = {
	common: {
		time: `${rlcUrl}/Common/v1/Time`,
		GetBrokers: `${rlcUrl}/Common/v1/GetBrokers`,
		GetBrokerApiUrls: `${rlcUrl}/Common/v1/GetBrokerApiUrls`,
	},

	option: {
		OptionBaseSymbolSearch: `${rlcUrl}/Option/v1/OptionBaseSymbolSearch`,
		ContractInfoHeader: `${rlcUrl}/Option/v1/ContractInfoHeader`,
		BaseSettlementDays: `${rlcUrl}/Option/v1/BaseSettlementDays`,
		GetContractInfoHistory: `${rlcUrl}/Option/v1/GetContractInfoHistory`,
		GetOpenPositionReport: `${rlcUrl}/Option/v1/GetOpenPositionReport`,
		OptionSymbolSearch: `${rlcUrl}/Option/v1/OptionSymbolSearch`,
	},

	optionWatchlist: {
		Watchlist: `${rlcUrl}/OptionWatchlist/v1/Watchlist`,
		WatchlistInfoBySymbolISIN: `${rlcUrl}/OptionWatchlist/v1/WatchlistInfoBySymbolISIN`,
		WatchlistExcel: `${rlcUrl}/OptionWatchlist/v1/WatchlistExcel`,
		WatchlistBySettlementDate: `${rlcUrl}/OptionWatchlist/v1/WatchlistBySettlementDate`,
		OptionCalculativeInfo: `${rlcUrl}/OptionWatchlist/v1/OptionCalculativeInfo`,
		OptionSymbolColumns: `${rlcUrl}/OptionWatchlist/v1/OptionSymbolColumns`,
		DefaultOptionSymbolColumns: `${rlcUrl}/OptionWatchlist/v1/DefaultOptionSymbolColumns`,
		ResetOptionSymbolColumns: `${rlcUrl}/OptionWatchlist/v1/ResetOptionSymbolColumns`,
		UpdateOptionSymbolColumns: `${rlcUrl}/OptionWatchlist/v1/UpdateOptionSymbolColumns`,
		GetAllCustomWatchlist: `${rlcUrl}/OptionWatchlist/v1/GetAllCustomWatchlist`,
		CreateCustomWatchlist: `${rlcUrl}/OptionWatchlist/v1/CreateCustomWatchlist`,
		UpdateCustomWatchlist: `${rlcUrl}/OptionWatchlist/v1/UpdateCustomWatchlist`,
		ChangeHiddenCustomWatchlist: `${rlcUrl}/OptionWatchlist/v1/ChangeHiddenCustomWatchlist`,
		UpdateCustomWatchlistOrder: `${rlcUrl}/OptionWatchlist/v1/UpdateCustomWatchlistOrder`,
		DeleteCustomWatchlist: `${rlcUrl}/OptionWatchlist/v1/DeleteCustomWatchlist`,
		GetCustomWatchlist: `${rlcUrl}/OptionWatchlist/v1/GetCustomWatchlist`,
		GetCustomWatchlistExcel: `${rlcUrl}/OptionWatchlist/v1/GetCustomWatchlistExcel`,
		CustomWatchlistOptionSearch: `${rlcUrl}/OptionWatchlist/v1/CustomWatchlistOptionSearch`,
		AddSymbolCustomWatchlist: `${rlcUrl}/OptionWatchlist/v1/AddSymbolCustomWatchlist`,
		RemoveSymbolCustomWatchlist: `${rlcUrl}/OptionWatchlist/v1/RemoveSymbolCustomWatchlist`,
	},

	authentication: {
		LoginFirstStep: `${oauthUrl}/OAuthAPI/v1/LoginFirstStep`,
		ForgetPasswordFirstStep: `${oauthUrl}/OAuthAPI/v1/ForgetPasswordFirstStep`,
		SignUp: `${oauthUrl}/OAuthAPI/v1/SignUp`,
		OtpLogin: `${oauthUrl}/OAuthAPI/v1/OtpLogin`,
		PasswordLogin: `${oauthUrl}/OAuthAPI/v1/PasswordLogin`,
		ChangePassword: `${oauthUrl}/OAuthAPI/v1/ChangePassword`,
		ValidateForgetPasswordOtp: `${oauthUrl}/OAuthAPI/v1/ValidateForgetPasswordOtp`,
		ChangeForgottenPassword: `${oauthUrl}/OAuthAPI/v1/ChangeForgottenPassword`,
		SendPasslessOTP: `${oauthUrl}/OAuthAPI/v1/SendPasslessOTP`,
		Logout: `${oauthUrl}/OAuthAPI/v1/Logout`,
		GetUserInformation: `${oauthUrl}/OAuthAPI/v1/GetUserInformation`,
	},

	symbol: {
		SymbolInfo: `${rlcUrl}/Symbol/v1/SymbolInfo`,
		BestLimit: `${rlcUrl}/Symbol/v1/BestLimit`,
		Search: `${rlcUrl}/Symbol/v1/Search`,
		SymbolHistory: `${rlcUrl}/Symbol/v1/SymbolHistory`,
	},

	saturn: {
		GetAllSaturns: `${rlcUrl}/Saturn/v1/GetAllSaturns`,
		GetSaturn: `${rlcUrl}/Saturn/v1/GetSaturn`,
		Upsert: `${rlcUrl}/Saturn/v1/Upsert`,
		Pin: `${rlcUrl}/Saturn/v1/Pin`,
		Delete: `${rlcUrl}/Saturn/v1/Delete`,
		SetActive: `${rlcUrl}/Saturn/v1/SetActive`,
		GetActive: `${rlcUrl}/Saturn/v1/GetActive`,
	},
};

export default routes;
