import type {
	IBlackScholes,
	IBlackScholesResponse,
	IBlackScholesValue,
	ID1,
	ID2,
	IGamma,
	IImpliedVolatility,
	ILambda,
	IResult,
	IRho,
	ITheta,
	IVega,
} from './type';

const cnd = (z: number) => {
	const t = 1 / (1 + 0.2316419 * Math.abs(z));
	const d = 0.3989423 * Math.exp((-z * z) / 2);
	const prob = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
	if (z > 0) return 1 - prob;

	return prob;
};

export const d1 = ({ sharePrice, strikePrice, rate, volatility, time }: ID1) => {
	return (
		(Math.log(sharePrice / strikePrice) + (rate + Math.pow(volatility, 2) / 2) * time) /
		(volatility * Math.sqrt(time))
	);
};

export const phi = (d: number) => {
	return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * Math.pow(d, 2));
};

export const d2 = ({ d1, volatility, time }: ID2) => {
	return d1 - volatility * Math.sqrt(time);
};

export const lambda = ({ delta, sharePrice, blackScholesValue }: ILambda) => {
	return (delta * sharePrice) / blackScholesValue;
};

export const delta = (d1: number) => {
	const result: IResult = { call: 0, put: 0 };

	result.call = cnd(d1);
	result.put = -1 * cnd(-1 * d1);

	return result;
};

export const blackScholesValue = ({ sharePrice, strikePrice, time, rate, d1, d2 }: IBlackScholesValue) => {
	const result: IResult = { call: 0, put: 0 };

	result.call = sharePrice * cnd(d1) - strikePrice * Math.exp(-rate * time) * cnd(d2);
	result.put = strikePrice * Math.exp(-rate * time) * cnd(-d2) - sharePrice * cnd(-d1);

	return result;
};

export const gamma = ({ d1, sharePrice, volatility, time }: IGamma) => {
	return phi(d1) / (sharePrice * volatility * Math.sqrt(time));
};

export const vega = ({ sharePrice, time, d1 }: IVega) => {
	return sharePrice * Math.sqrt(time) * phi(d1) * 0.01;
};

export const theta = ({ sharePrice, strikePrice, volatility, time, rate, d1, d2 }: ITheta) => {
	const result: IResult = { call: 0, put: 0 };

	result.call =
		(-((sharePrice * volatility * phi(d1)) / (2 * Math.sqrt(time))) -
			rate * (strikePrice * Math.exp(-rate * time)) * cnd(d2)) /
		365;

	result.put =
		(-((sharePrice * volatility * phi(d1)) / (2 * Math.sqrt(time))) +
			rate * (strikePrice * Math.exp(-rate * time)) * cnd(-d2)) /
		365;

	return result;
};

export const rho = ({ strikePrice, time, rate, d2 }: IRho) => {
	const result: IResult = { call: 0, put: 0 };

	result.call = time * (strikePrice * Math.exp(-rate * time)) * cnd(d2) * 0.01;

	result.put = -time * (strikePrice * Math.exp(-rate * time)) * cnd(-d2) * 0.01;

	return result;
};

export const blackScholes = (props: IBlackScholes): IBlackScholesResponse => {
	const { sharePrice, strikePrice, rate, volatility, dueDays } = props;

	const time = dueDays / 365;
	const d1V = d1({ ...props, time });
	const d2V = d2({ d1: d1V, time, volatility });
	const blackScholesV = blackScholesValue({ sharePrice, strikePrice, rate, time, d1: d1V, d2: d2V });
	const deltaV = delta(d1V);
	const vegaV = vega({ d1: d1V, sharePrice, time });
	const thetaV = theta({ d1: d1V, rate, d2: d2V, sharePrice, strikePrice, time, volatility });
	const rhoV = rho({ strikePrice, time, rate, d2: d2V });
	const lambdaCallV = lambda({ sharePrice, delta: deltaV.call, blackScholesValue: blackScholesV.call });
	const lambdaPutV = lambda({ sharePrice, delta: deltaV.put, blackScholesValue: blackScholesV.put });
	const gammaV = gamma({ d1: d1V, sharePrice, volatility, time });

	const result: IBlackScholesResponse = {
		call: blackScholesV.call,
		put: blackScholesV.put,
		deltaCall: deltaV.call,
		deltaPut: deltaV.put,
		vega: vegaV,
		thetaCall: thetaV.call,
		thetaPut: thetaV.put,
		rhoCall: rhoV.call,
		rhoPut: rhoV.put,
		lambdaCall: lambdaCallV,
		lambdaPut: lambdaPutV,
		gamma: gammaV,
	};

	return result;
};

export const impliedVolatility = ({
	optionPrice,
	rate,
	strikePrice,
	dueDays,
	contractType,
	sharePrice,
	stepCount,
	volatility = 0.1,
	step = 1,
}: IImpliedVolatility): number => {
	const price = optionPrice;

	if (optionPrice === 0) return 0;

	if (step > stepCount) return volatility;

	const x = Math.pow(10, step);
	const precision = 1 / x;
	let res = 0;
	let diff = price;

	for (let i = 0; ; i++) {
		if (volatility === 0.0001) return 0;

		const bs = blackScholes({ sharePrice, strikePrice, volatility, dueDays, rate });
		const bsValue = bs[contractType];

		if (i === 0 && bsValue > price) {
			volatility /= 10;
			res = volatility;
			break;
		}

		if (bsValue > price) {
			volatility -= precision;
			break;
		}

		if (volatility > 1000) {
			res = volatility;
			break;
		}

		if (diff > Math.abs(price - bsValue)) {
			diff = Math.abs(price - bsValue);
			res = volatility;
		}

		volatility += precision;
	}

	if (res > 1000) {
		return 1000;
	}

	return impliedVolatility({
		optionPrice,
		rate,
		strikePrice,
		dueDays,
		contractType,
		sharePrice,
		stepCount,
		volatility,
		step: step + 1,
	});
};
