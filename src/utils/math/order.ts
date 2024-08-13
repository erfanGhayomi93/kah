type TAccountBlockTypeValue = Record<'price' | 'quantity' | 'initialRequiredMargin' | 'contractSize', number>;

type TPortfolioBlockTypeValue = Record<'quantity' | 'contractSize', number>;

export const getAccountBlockTypeValue = ({
	initialRequiredMargin,
	contractSize,
	price,
	quantity,
}: TAccountBlockTypeValue): number => {
	return quantity * (initialRequiredMargin + price * contractSize);
};

export const getPortfolioBlockTypeValue = ({ contractSize, quantity }: TPortfolioBlockTypeValue): number => {
	return quantity * contractSize;
};
