import { useCommissionsQuery } from '@/api/queries/commonQueries';
import { useEffect } from 'react';
import useInputs from './useInputs';

interface IInput {
	data: Array<Record<'x' | 'y', number>>;
}

interface IConfiguration {
	baseAssets: number;
	useCommission?: boolean;
	maxPrice?: number;
	minPrice?: number;
	enabled?: boolean;
}

const useAnalyze = (contracts: TSymbolStrategy[], config: IConfiguration) => {
	const { inputs, setInputs } = useInputs<IInput>({
		data: [],
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

		const data = [...contracts];
		const newInputs: IInput = {
			...inputs,
			data: [],
		};

		newInputs.data = [];
		if (data.length === 0) return;

		if (!config?.minPrice) config.minPrice = Math.floor(config.baseAssets * 0.5);
		if (!config?.maxPrice) config.maxPrice = Math.ceil(config.baseAssets * 1.5);

		config.minPrice = Math.min(config.minPrice, config.maxPrice);
		config.maxPrice = Math.max(config.minPrice, config.maxPrice);

		try {
			const l = data.length;
			const { maxPrice, minPrice, baseAssets, useCommission } = config;

			for (let i = 0; i < l; i++) {
				const item = data[i];
				const contractType = item.symbol.optionType;
				const { strikePrice, price } = item;

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

					y += newInputs.data[index]?.y ?? 0;

					newInputs.data[index] = {
						x: j,
						y,
					};

					index++;
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
