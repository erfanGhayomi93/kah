const baseUrl = 'https://ramandoauth-stage.ramandtech.com';

const routes = {
	option: {
		Watchlist: 'https://marketdata-stage.ramandtech.com/kahkeshanoption/v1/Watchlist',
	},

	authentication: {
		LoginFirstStep: `${baseUrl}/OAuthAPI/v1/LoginFirstStep`,
		ForgetPasswordFirstStep: `${baseUrl}/OAuthAPI/v1/ForgetPasswordFirstStep`,
		SignUp: `${baseUrl}/OAuthAPI/v1/SignUp`,
		OtpLogin: `${baseUrl}/OAuthAPI/v1/OtpLogin`,
		PasswordLogin: `${baseUrl}/OAuthAPI/v1/PasswordLogin`,
		ChangePassword: `${baseUrl}/OAuthAPI/v1/ChangePassword`,
		ForgetPassword: `${baseUrl}/OAuthAPI/v1/ForgetPassword`,
	},
};

export default routes;
