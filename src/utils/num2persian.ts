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

const num2persian = (value: string, showRial = false) => {
	if (!value || isNaN(Number(value))) return '-';

	const toman = value.slice(0, -1);
	const rial = value.slice(-1);
	if (!toman || toman === '0' || isNaN(Number(toman))) return showRial ? `${rial} ریال` : '';

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
				return item + letters[arrLength - 1 - index];
			})
			.join(' و ') + ' تومان';

	if (!showRial || !rial || rial === '0' || isNaN(Number(rial))) return persianToman;

	return showRial ? `${persianToman} و ${rial} ریال` : persianToman;
};

export default num2persian;
