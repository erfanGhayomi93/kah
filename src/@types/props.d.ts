declare interface INextProps {}

declare type IOFields = {
	symbolISIN: string;
	quantity: number;
	price: number;
	orderSide: 'buy' | 'sell';
	validity: TBsValidityDates;
	validityDate: number;
};
