const oauthUrl = 'https://ramandoauth-stage.ramandtech.com';
const rlcUrl = 'https://marketdata-stage.ramandtech.com';

const routes = {
	option: {
		Watchlist: `${rlcUrl}/KahkeshanOption/v1/Watchlist`,
		OptionSymbolSearch: `${rlcUrl}/KahkeshanOption/v1/OptionSymbolSearch`,
		OptionSymbolColumns: `${rlcUrl}/KahkeshanOption/v1/OptionSymbolColumns`,
		ResetOptionSymbolColumns: `${rlcUrl}/KahkeshanOption/v1/ResetOptionSymbolColumns`,
		UpdateOptionSymbolColumns: `${rlcUrl}/KahkeshanOption/v1/UpdateOptionSymbolColumns`,
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
