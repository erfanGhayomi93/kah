import { useCommissionsQuery } from '@/api/queries/commonQueries';
import { isBetween } from '@/utils/helpers';
import { useEffect } from 'react';
import useInputs from './useInputs';

interface IConfiguration {
	baseAssets: number;
	useCommission?: boolean;
	maxPrice?: number | null;
	minPrice?: number | null;
	enabled?: boolean;
}

const useAnalyze = (contracts: TSymbolStrategy[], config: IConfiguration) => {
	const { inputs, setInputs } = useInputs<IAnalyzeInputs>({
		data: [],
		maxPrice: config?.maxPrice ?? 0,
		minPrice: config?.minPrice ?? 0,
		baseSymbolStatus: 'atm',
		maxProfit: 0,
		maxLoss: 0,
		bep: [],
		cost: 0,
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

	useEffect(() => {
		if (config?.enabled === false) return;

		const data = JSON.parse(JSON.stringify(contracts)) as typeof contracts;
		const newInputs: IAnalyzeInputs = {
			data: [],
			maxPrice: 0,
			minPrice: 0,
			baseSymbolStatus: 'atm',
			maxProfit: 0,
			maxLoss: 0,
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
			const { baseAssets, useCommission } = config;
			const { maxPrice, minPrice } = newInputs;
			const series: IAnalyzeInputs['data'] = [];

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
				const requiredMargin = side === 'buy' || item.type === 'base' ? 0 : item.symbol.requiredMargin ?? 0;
				let contractCost = contractSize * amount;
				contractCost *= side === 'sell' ? -1 : 1;

				if (item.type === 'option') newInputs.neededBudget += requiredMargin;

				newInputs.neededRequiredMargin += requiredMargin;
				newInputs.neededBudget += contractCost;
				newInputs.cost += contractCost;

				let commission = 0;
				let index = 0;

				if (Array.isArray(commissionData) && (useCommission || item.tradeCommission)) {
					const transactionCommission = commissionData.find(
						({ marketUnitTitle }) => marketUnitTitle === item.marketUnit,
					);

					if (transactionCommission) {
						commission = transactionCommission[side === 'buy' ? 'buyCommission' : 'sellCommission'] ?? 0;

						commission *= quantity * price;
						if (side === 'sell') commission *= -1;
					}
				}

				const transactionValue = Math.ceil(Math.abs(quantity * price + commission));

				for (let j = minPrice; j <= maxPrice; j++) {
					let y = 0;

					if (type === 'base') {
						y = j - baseAssets;
					} else {
						const strikeCommission =
							useCommission && side === 'buy'
								? (strikePrice ?? 0) * 0.0005 * (optionType === 'call' ? 1 : -1)
								: 0;

						const iv = intrinsicValue((strikePrice ?? 0) + strikeCommission, j, optionType ?? 'call');
						y = pnl(iv, transactionValue, side);
					}

					y += series[index]?.y ?? 0;
					series[index] = {
						x: j,
						y,
					};

					index++;
				}
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

		setInputs(newInputs);
	}, [contracts, JSON.stringify(config)]);

	return inputs;
};

export default useAnalyze;
