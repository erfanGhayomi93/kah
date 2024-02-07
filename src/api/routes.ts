import { URLIsValid } from '@/utils/helpers';

const isStage = URLIsValid('stage');
const isDev = URLIsValid('localhost');

const oauthUrl = isStage || isDev ? 'https://ramandoauth-stage.ramandtech.com' : 'https://ramandoauth.ramandtech.com';
const rlcUrl = isStage || isDev ? 'https://kahkeshanapi-stage.ramandtech.com' : 'https://kahkeshanapi.ramandtech.com';

const routes = {
	time: `${rlcUrl}/Time/v1/Time`,

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
	},

	option: {
		OptionSymbolSearch: `${rlcUrl}/Option/v1/OptionSymbolSearch`,
		OptionCalculativeInfo: `${rlcUrl}/OptionWatchlist/v1/OptionCalculativeInfo`,
		ContractInfoHeader: `${rlcUrl}/Option/v1/ContractInfoHeader`,
		BaseSettlementDays: `${rlcUrl}/Option/v1/BaseSettlementDays`,
	},

	optionWatchlist: {
		Watchlist: `${rlcUrl}/OptionWatchlist/v1/Watchlist`,
		WatchlistByCompanyISIN: `${rlcUrl}/OptionWatchlist/v1/WatchlistByCompanyISIN`,
		WatchlistBySettlementDate: `${rlcUrl}/OptionWatchlist/v1/WatchlistBySettlementDate`,
		OptionSymbolColumns: `${rlcUrl}/OptionWatchlist/v1/OptionSymbolColumns`,
		DefaultOptionSymbolColumns: `${rlcUrl}/OptionWatchlist/v1/DefaultOptionSymbolColumns`,
		ResetOptionSymbolColumns: `${rlcUrl}/OptionWatchlist/v1/ResetOptionSymbolColumns`,
		UpdateOptionSymbolColumns: `${rlcUrl}/OptionWatchlist/v1/UpdateOptionSymbolColumns`,
	},

	saturn: {
		GetAllSaturns: `${rlcUrl}/Saturn/v1/GetAllSaturns`,
		GetSaturn: `${rlcUrl}/Saturn/v1/GetSaturn`,
		Upsert: `${rlcUrl}/Saturn/v1/Upsert`,
		Pin: `${rlcUrl}/Saturn/v1/Pin`,
		Delete: `${rlcUrl}/Saturn/v1/Delete`,
	},
};

export default routes;
