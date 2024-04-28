export enum Environment {
	DEV = 'dev',
	STAGE = 'stage',
	PREPROD = 'preprod',
	PROD = 'production',
}

export enum DateAsMillisecond {
	Day = 864e5,
	Week = 6048e5,
	Month = 2592e6,
	Year = 31536e6,
}

export enum StrategyCheapColor {
	HighRisk = 'error-100',
	LowRisk = 'success-100',
	ModerateRisk = 'warning-100',
	LimitedInterest = 'success-100',
	UnlimitedInterest = 'success-100',
	LimitedLoss = 'error-100',
	UnlimitedLoss = 'error-100',
	BullishMarket = 'info',
	BearishMarket = 'info',
	NeutralMarket = 'info',
	DirectionalMarket = 'info',
}
