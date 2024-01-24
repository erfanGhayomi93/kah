const letters = [
	'',
	' هزار',
	' میلیون',
	' میلیارد',
	' بیلیون',
	' بیلیارد',
	' تریلیون',
	' تریلیارد',
	'کوآدریلیون',
	' کادریلیارد',
	' کوینتیلیون',
	' کوانتینیارد',
	' سکستیلیون',
	' سکستیلیارد',
	' سپتیلیون',
	'سپتیلیارد',
	' اکتیلیون',
	' اکتیلیارد',
	' نانیلیون',
	' نانیلیارد',
	' دسیلیون',
	' دسیلیارد',
];

const num2persian = (value: string) => {
	if (!value || isNaN(Number(value))) return '';

	const toman = value.slice(0, -1);
	const result = [];

	const vLength = toman.length;
	for (let i = vLength; i >= 0; i -= 3) {
		const g = toman.slice(Math.max(0, i - 3), i);
		if (g) result.unshift(g);
	}

	const arrLength = result.length;
	const persianToman =
		result
			.map((item, index) => {
				const itemAsNumber = Number(item);
				if (!itemAsNumber) return '';
				return itemAsNumber + letters[arrLength - 1 - index];
			})
			.filter(Boolean)
			.join(' و ') + ' تومان';

	return persianToman;
};

export default num2persian;
