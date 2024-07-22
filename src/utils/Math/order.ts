type TAccountBlockTypeValue = Record<'price' | 'quantity' | 'initialRequiredMargin' | 'contractSize', number>;

export const getAccountBlockTypeValue = ({
	initialRequiredMargin,
	contractSize,
	price,
	quantity,
}: TAccountBlockTypeValue): number => {
	return quantity * (initialRequiredMargin + price * contractSize);
};
