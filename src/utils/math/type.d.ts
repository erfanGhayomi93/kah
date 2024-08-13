type TSide = 'call' | 'put';

export type IResult = Record<TSide, number>;

export interface IBlackScholes {
	sharePrice: number;
	strikePrice: number;
	rate: number;
	volatility: number;
	dueDays: number;
}

export interface ID1 {
	sharePrice: number;
	strikePrice: number;
	rate: number;
	volatility: number;
	time: number;
}

export interface ID2 {
	d1: number;
	volatility: number;
	time: number;
}

export interface ILambda {
	delta: number;
	sharePrice: number;
	blackScholesValue: number;
}

export interface IGamma {
	d1: number;
	sharePrice: number;
	volatility: number;
	time: number;
}

export interface IVega {
	sharePrice: number;
	time: number;
	d1: number;
}
export interface ITheta {
	sharePrice: number;
	strikePrice: number;
	volatility: number;
	time: number;
	rate: number;
	d1: number;
	d2: number;
}

export interface IRho {
	strikePrice: number;
	time: number;
	rate: number;
	d2: number;
}

export interface IBlackScholesValue {
	sharePrice: number;
	strikePrice: number;
	time: number;
	rate: number;
	d1: number;
	d2: number;
}

export interface IBlackScholesResponse {
	call: number;
	put: number;
	deltaCall: number;
	deltaPut: number;
	vega: number;
	thetaCall: number;
	thetaPut: number;
	rhoCall: number;
	rhoPut: number;
	lambdaCall: number;
	lambdaPut: number;
	gamma: number;
}
