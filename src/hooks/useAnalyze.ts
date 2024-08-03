import { useCommissionsQuery } from '@/api/queries/commonQueries';
import { getDateMilliseconds } from '@/constants';
import { isBetween } from '@/utils/helpers';
import { useEffect } from 'react';
import useInputs from './useInputs';

interface IConfiguration {
	baseAssets: number;
	useTradeCommission: boolean;
	useStrikeCommission: boolean;
	useRequiredMargin: boolean;
	dueDays?: number | null;
	maxPrice?: number | null;
	minPrice?: number | null;
	enabled?: boolean;
}

const useAnalyze = (contracts: TSymbolStrategy[], config: IConfiguration) => {
	const { inputs, setInputs } = useInputs<IAnalyzeInputs>({
		data: [],
		dueDays: config?.dueDays ?? 1,
		maxPrice: config?.maxPrice ?? 0,
		minPrice: config?.minPrice ?? 0,
		baseSymbolStatus: 'atm',
		maxProfit: 0,
		maxLoss: 0,
		baseAssets: config?.baseAssets,
		bep: [],
		cost: 0,
		income: 0,
		contractSize: 0,
		neededBudget: 0,
		neededRequiredMargin: 0,
	});

	const { data: commissionData } = useCommissionsQuery({
		queryKey: ['commissionQuery'],
	});

	const intrinsicValue = (strikePrice: number, baseSymbolPrice: number, type: TOptionSides) => {
		if (type === 'call') return Math.max(baseSymbolPrice - strikePrice, 0);
		return Math.max(strikePrice - baseSymbolPrice, 0);
	};

	const pnl = (intrinsicValue: number, premium: number, type: TBsSides) => {
		if (type === 'buy') return intrinsicValue - premium;
		return premium - intrinsicValue;
	};

	const numStatus = (v: number): 0 | 1 | -1 => {
		if (v === 0) return 0;
		if (v < 0) return -1;
		return 1;
	};

	const getCommission = (side: TBsSides, marketUnit: string) => {
		if (!commissionData) return 0;

		const transactionCommission = commissionData[marketUnit];
		if (!transactionCommission) return 0;

		const commissionValue = transactionCommission[side === 'buy' ? 'buyCommission' : 'sellCommission'];

		if (side === 'sell') return -commissionValue;
		return commissionValue;
	};

	useEffect(() => {
		if (config?.enabled === false) return;

		const data = JSON.parse(JSON.stringify(contracts)) as typeof contracts;
		const newInputs: IAnalyzeInputs = {
			data: [],
			dueDays: config?.dueDays ?? 0,
			maxPrice: 0,
			contractSize: 1e3,
			minPrice: 0,
			baseSymbolStatus: 'atm',
			maxProfit: 0,
			maxLoss: 0,
			income: 0,
			baseAssets: config?.baseAssets ?? 0,
			bep: [],
			cost: 0,
			neededBudget: 0,
			neededRequiredMargin: 0,
		};

		if (data.length === 0) return;

		newInputs.minPrice = config?.minPrice || Math.floor(config.baseAssets * 0);
		newInputs.maxPrice = config?.maxPrice || Math.floor(Math.round(config.baseAssets * 0.2) * 10);

		newInputs.minPrice = Math.max(0, Math.min(newInputs.minPrice, newInputs.maxPrice));
		newInputs.maxPrice = Math.min(1e5, Math.max(newInputs.minPrice, newInputs.maxPrice));

		try {
			const { baseAssets, useTradeCommission, useStrikeCommission, useRequiredMargin } = config;
			const { maxPrice, minPrice } = newInputs;
			const series: IAnalyzeInputs['data'] = [];

			const now = Date.now();

			for (let i = 0; i < data.length; i++) {
				const item = data[i];
				const {
					symbol: { strikePrice, optionType, contractSize },
					side,
					price,
					quantity,
					type,
				} = item;
				const amount = price * quantity;
				const sideInt = side === 'sell' ? -1 : 1;
				const income = amount * contractSize * sideInt;
				let requiredMargin = 0;
				if ((useRequiredMargin || item.requiredMargin) && side === 'sell' && type === 'option') {
					requiredMargin = item.symbol.requiredMargin;
				}
				const tax = side === 'buy' || type === 'base' ? 0 : 0;
				if (contractSize) newInputs.contractSize = contractSize;

				let commission = 0;
				if (useTradeCommission || item.tradeCommission) {
					commission = getCommission(item.side, item.marketUnit) * amount * contractSize;
				}
				const tradeCommission = Math.ceil(Math.abs(amount + commission));
				const cost = tax + commission + requiredMargin + income;

				if (type === 'base') newInputs.baseAssets = item.price;

				if (useRequiredMargin || item.requiredMargin) {
					if (type === 'option') newInputs.neededBudget += requiredMargin;
					newInputs.neededRequiredMargin += requiredMargin;
				}

				if (!config?.dueDays && type === 'option' && item.symbol.settlementDay) {
					newInputs.dueDays = Math.max(
						Math.ceil(
							Math.abs(new Date(item.symbol.settlementDay).getTime() - now) / getDateMilliseconds.Day,
						),
						newInputs.dueDays,
					);
				}

				let index = 0;
				for (let j = minPrice; j <= maxPrice; j++) {
					let y = 0;

					if (type === 'base') {
						y = (side === 'buy' ? j - baseAssets : baseAssets - j) * item.quantity;
					} else {
						let strikeCommission = 0;
						if ((useStrikeCommission || item.strikeCommission) && side === 'buy') {
							strikeCommission = (strikePrice ?? 0) * 0.0005;
							if (optionType === 'call') strikeCommission *= -1;
						}

						const iv = intrinsicValue((strikePrice ?? 0) + strikeCommission, j, optionType ?? 'call');
						y = pnl(iv, tradeCommission, side) * item.quantity;
					}

					y += series[index]?.y ?? 0;
					series[index] = {
						x: j,
						y,
					};

					index++;
				}

				newInputs.neededBudget += contractSize * (side === 'sell' ? -amount : amount);
				newInputs.cost += cost;
				newInputs.income += income;
			}

			const l = series.length;
			const pointsLength = Math.min(Math.max(Math.ceil(Math.sqrt(maxPrice - minPrice)) * 2, 100), 600);
			const diff = Math.floor((maxPrice - minPrice) / pointsLength);
			const rangeData: [number[], number[]] = [[], []];

			for (let i = 0; i < l; i++) {
				try {
					const item = series[i];
					const previousItem = series[i - 1];
					const pnl = Math.round(item.y);
					const previousPNL = i === 0 ? pnl : Math.round(previousItem.y);
					const isNotSameZone = previousPNL !== 0 && numStatus(previousPNL) !== numStatus(pnl);

					if (pnl > 0) newInputs.maxProfit = Math.round(Math.max(newInputs.maxProfit, pnl));
					else if (pnl < 0) newInputs.maxLoss = Math.round(Math.min(newInputs.maxLoss, pnl));

					if (isNotSameZone || i % diff === 0 || i === 0 || i === l - 1) {
						newInputs.data.push({
							x: item.x,
							y: pnl,
						});
					}

					if (isNotSameZone) {
						newInputs.bep.push(item.x);
					}

					if (item.x === baseAssets) {
						if (pnl === 0) newInputs.baseSymbolStatus = 'atm';
						else if (pnl > 0) newInputs.baseSymbolStatus = 'itm';
						else if (pnl < 0) newInputs.baseSymbolStatus = 'otm';
					}

					if (isBetween(0, i, 10)) rangeData[0].push(Math.round(pnl));
					if (isBetween(l - 11, i, l - 1)) rangeData[1].push(Math.round(pnl));
				} catch (e) {
					//
				}
			}

			const [startPNLs, endPNLs] = rangeData;
			const lastValueOfStartPNLs = startPNLs[startPNLs.length - 1];
			const lastValueOfEndPNLs = endPNLs[startPNLs.length - 1];

			if (lastValueOfStartPNLs === startPNLs[0]) {
				if (startPNLs[0] >= 0) newInputs.maxProfit = Math.max(startPNLs[0], newInputs.maxProfit);
				else newInputs.maxLoss = Math.min(startPNLs[0], newInputs.maxLoss);
			} else {
				if (startPNLs[0] > lastValueOfStartPNLs) {
					newInputs.maxProfit = Infinity;
				}
				if (startPNLs[0] < lastValueOfStartPNLs) {
					newInputs.maxLoss = -Infinity;
				}
			}

			if (endPNLs[0] === lastValueOfEndPNLs) {
				if (lastValueOfEndPNLs >= 0) newInputs.maxProfit = Math.max(lastValueOfEndPNLs, newInputs.maxProfit);
				else newInputs.maxLoss = Math.min(lastValueOfEndPNLs, newInputs.maxLoss);
			} else {
				if (lastValueOfEndPNLs > endPNLs[0]) {
					newInputs.maxProfit = Infinity;
				}
				if (lastValueOfEndPNLs < endPNLs[0]) {
					newInputs.maxLoss = -Infinity;
				}
			}
		} catch (e) {
			//
		}

		newInputs.cost = Math.ceil(newInputs.cost);
		newInputs.income = Math.ceil(newInputs.income);

		setInputs(newInputs);
	}, [contracts, JSON.stringify(config)]);

	return inputs;
};

export default useAnalyze;
