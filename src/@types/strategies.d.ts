declare interface INextStrategyProps extends INextProps<{ id: Strategy.Type }> {}

type TStrategySymbolBasis = 'All' | 'BestLimit';

declare type TStrategyMarketTrend =
	| 'All'
	| Extract<Strategy.Cheap, 'BullishMarket' | 'BearishMarket' | 'NeutralMarket' | 'DirectionalMarket'>;

declare interface ISymbolStrategy {
	id: string;
	marketUnit: string;
	quantity: number;
	price: number;
}

declare interface IBaseSymbolStrategy extends ISymbolStrategy {
	type: 'base';
	side: TBsSides;
	symbol: {
		symbolTitle: string;
		symbolISIN: string;
		baseSymbolPrice: number;
		optionType?: null;
		historicalVolatility?: null;
	};
	strikePrice?: null;
	contractSize?: null;
	settlementDay?: null;
	commission?: null;
	requiredMargin?: null;
}

declare interface IStrategyFilter {
	priceBasis: TPriceBasis;
	symbolBasis: TStrategySymbolBasis;
	pageNumber: number;
	pageSize: number;
}

declare interface IOptionStrategy extends ISymbolStrategy {
	type: 'option';
	strikePrice: number;
	contractSize: number;
	settlementDay: Date | number | string;
	side: TBsSides;
	symbol: {
		symbolTitle: string;
		symbolISIN: string;
		optionType: TOptionSides;
		baseSymbolPrice: number;
		historicalVolatility: number;
	};
	commission?: {
		value: number;
		checked?: boolean;
		onChecked?: (checked: boolean) => void;
	};
	requiredMargin?: {
		value: number;
		checked?: boolean;
		onChecked?: (checked: boolean) => void;
	};
}

declare type TSymbolStrategy = IBaseSymbolStrategy | IOptionStrategy;

namespace CreateStrategy {
	export type Status = 'TODO' | 'PENDING' | 'DONE' | 'ERROR';

	export type TStep = 'option' | 'base';

	export interface IBaseSymbol {
		id: string;
		type: 'base';
		symbolTitle: string;
		symbolISIN: string;
		quantity: number;
		estimatedBudget: number;
		buyAssetsBySymbol: boolean;
		orderPrice: number;
		orderQuantity: number;
		status: Status;
	}

	export interface IOption {
		id: string;
		type: 'option';
		side: TBsSides;
		optionType: TOptionSides;
		estimatedBudget: number;
		symbolTitle: string;
		symbolISIN: string;
		status: Status;
		baseSymbol: {
			symbolTitle: string;
			symbolISIN: string;
		};
	}

	export interface IFreeze {
		id: string;
		type: 'freeze';
		estimatedBudget: number;
		status: Status;
		baseSymbol: {
			symbolTitle: string;
			symbolISIN: string;
		};
	}

	export type Input = CreateStrategy.IBaseSymbol | CreateStrategy.IOption | IFreeze;
}
