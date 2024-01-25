const oauthUrl = 'https://ramandoauth-stage.ramandtech.com';
const rlcUrl = 'https://kahkeshanapi-stage.ramandtech.com';
// 172.30.14.12:7142 OptionWatchlist

const routes = {
	option: {
		OptionSymbolSearch: `${rlcUrl}/Option/v1/OptionSymbolSearch`,
		SymbolInfo: `${rlcUrl}/Option/v1/SymbolInfo`,
		ContractInfoHeader: `${rlcUrl}/Option/v1/ContractInfoHeader`,
	},

	optionWatchlist: {
		Watchlist: `${rlcUrl}/OptionWatchlist/v1/Watchlist`,
		OptionSymbolColumns: `${rlcUrl}/OptionWatchlist/v1/OptionSymbolColumns`,
		ResetOptionSymbolColumns: `${rlcUrl}/OptionWatchlist/v1/ResetOptionSymbolColumns`,
		UpdateOptionSymbolColumns: `${rlcUrl}/OptionWatchlist/v1/UpdateOptionSymbolColumns`,
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
	},
};

export default routes;
