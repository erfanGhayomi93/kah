import { useCommissionsQuery } from '@/api/queries/commonQueries';
import { useEffect } from 'react';
import useInputs from './useInputs';

interface IConfiguration {
	baseAssets: number;
	useCommission?: boolean;
	maxPrice?: number;
	minPrice?: number;
	enabled?: boolean;
}

const useAnalyze = (contracts: TSymbolStrategy[], config: IConfiguration) => {
	const { inputs, setInputs } = useInputs<IAnalyzeInputs>({
		data: [],
		maxPrice: config?.maxPrice ?? 0,
		minPrice: config?.minPrice ?? 0,
		maxProfit: 0,
		maxLoss: 0,
		neededBudget: 0,
		risk: 0,
		profitProbability: 0,
		timeValue: 0,
		bep: [],
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

	useEffect(() => {
		if (config?.enabled === false) return;

		const data = JSON.parse(JSON.stringify(contracts)) as typeof contracts;
		const newInputs: IAnalyzeInputs = {
			maxPrice: 0,
			minPrice: 0,
			neededRequiredMargin: 0,
			maxProfit: 0,
			maxLoss: 0,
			neededBudget: 0,
			risk: 0,
			profitProbability: 0,
			timeValue: 0,
			bep: [],
			data: [],
		};

		if (data.length === 0) return;

		newInputs.minPrice = config?.minPrice || Math.floor(config.baseAssets * 0.5);
		newInputs.maxPrice = config?.maxPrice || Math.floor(config.baseAssets * 1.5);

		newInputs.minPrice = Math.max(0, newInputs.minPrice);
		newInputs.maxPrice = Math.min(1e5, newInputs.maxPrice);

		try {
			const { baseAssets, useCommission } = config;
			const { maxPrice, minPrice } = newInputs;
			const series: IAnalyzeInputs['data'] = [];

			let maxProfit = 0;
			let maxLoss = 0;

			for (let i = 0; i < data.length; i++) {
				const item = data[i];
				const contractType = item.symbol.optionType;
				const { strikePrice, price } = item;

				if (item.type === 'option') newInputs.neededRequiredMargin += item.requiredMargin?.value ?? 0;

				if (item.type === 'option')
					newInputs.neededBudget +=
						item.side === 'buy' ? +(item.price * item.contractSize) : -(item.price * item.contractSize);

				let commission = 0;
				let index = 0;

				if (Array.isArray(commissionData) && useCommission) {
					const transactionCommission = commissionData.find(
						({ marketUnitTitle }) => marketUnitTitle === item.marketUnit,
					);

					if (transactionCommission) {
						commission =
							transactionCommission[item.side === 'buy' ? 'buyCommission' : 'sellCommission'] ?? 0;

						commission *= item.quantity * item.price;
						if (item.side === 'sell') commission *= -1;
					}
				}

				const transactionValue = Math.ceil(Math.abs(item.quantity * price + commission));

				for (let j = minPrice; j <= maxPrice; j++) {
					let y = 0;

					if (item.type === 'base') {
						y = j - baseAssets;
					} else {
						const strikeCommission =
							useCommission && item.side === 'buy'
								? (strikePrice ?? 0) * 0.0005 * (item.symbol.optionType === 'call' ? 1 : -1)
								: 0;

						const iv = intrinsicValue((strikePrice ?? 0) + strikeCommission, j, contractType ?? 'call');
						y = pnl(iv, transactionValue, item.side);
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
			const diff = Math.floor((maxPrice - minPrice) / 100);

			for (let i = 0; i < l; i++) {
				const item = series[i];
				const pnl = Math.round(item.y);

				if (item.y > 0) maxProfit = Math.max(maxProfit, item.y);
				else if (item.y < 0) maxLoss = Math.min(maxLoss, item.y);

				if (pnl === 0 || i % diff === 0) {
					newInputs.data.push({
						x: item.x,
						y: pnl,
					});
				}

				if (pnl === 0) {
					newInputs.bep.push(item.x);
				} else if (i > 0) {
					const previousPNL = Math.round(series[i - 1].y);
					if ((previousPNL > 0 && pnl < 0) || (previousPNL < 0 && pnl > 0)) {
						newInputs.bep.push(item.x);
					}
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
