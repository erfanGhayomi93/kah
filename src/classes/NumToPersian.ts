class NumToPersian {
	public delimiter: string;
	public zero: string;
	public negative: string;
	public letters: string[][];
	public decimalSuffixes: string[];

	constructor() {
		this.delimiter = ' و ';

		this.zero = 'صفر';

		this.negative = 'منفی ';

		this.letters = [
			['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'],
			['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده', 'بیست'],
			['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'],
			['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'],
			[
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
				' دسیلیارد'
			]
		];

		this.decimalSuffixes = [
			'',
			'دهم',
			'صدم',
			'هزارم',
			'ده‌هزارم',
			'صد‌هزارم',
			'میلیونوم',
			'ده‌میلیونوم',
			'صدمیلیونوم',
			'میلیاردم',
			'ده‌میلیاردم',
			'صد‌‌میلیاردم'
		];
	}

	prepareNumber(num: number | string) {
		if (typeof num === 'number') {
			num = num.toString();
		}

		const NumberLength = num.length % 3;
		if (NumberLength === 1) {
			num = `00${num}`;
		} else if (NumberLength === 2) {
			num = `0${num}`;
		}

		return num.replace(/\d{3}(?=\d)/g, '$&*').split('*');
	}

	tinyNumToWord(num: string | number) {
		if (typeof num === 'number') num = String(num);

		// return zero
		if (parseInt(num, 0) === 0) {
			return '';
		}

		const parsedInt = parseInt(num, 0);
		if (parsedInt < 10) {
			return this.letters[0][parsedInt];
		}
		if (parsedInt <= 20) {
			return this.letters[1][parsedInt - 10];
		}
		if (parsedInt < 100) {
			const one = parsedInt % 10;
			const ten = (parsedInt - one) / 10;
			if (one > 0) {
				return this.letters[2][ten] + this.delimiter + this.letters[0][one];
			}
			return this.letters[2][ten];
		}
		const one = parsedInt % 10;
		const hundreds = (parsedInt - (parsedInt % 100)) / 100;
		const ten = (parsedInt - (hundreds * 100 + one)) / 10;
		const out = [this.letters[3][hundreds]];
		const secondPart = ten * 10 + one;

		if (secondPart === 0) {
			return out.join(this.delimiter);
		}

		if (secondPart < 10) {
			out.push(this.letters[0][secondPart]);
		} else if (secondPart <= 20) {
			out.push(this.letters[1][secondPart - 10]);
		} else {
			out.push(this.letters[2][ten]);
			if (one > 0) {
				out.push(this.letters[0][one]);
			}
		}

		return out.join(this.delimiter);
	}

	convertDecimalPart(decimalPart: string) {
		decimalPart = decimalPart.replace(/0*$/, '');

		if (decimalPart === '') return '';

		if (decimalPart.length > 11) decimalPart = decimalPart.substr(0, 11);
		return ' ممیز ' + this.Num2persian(decimalPart) + ' ' + this.decimalSuffixes[decimalPart.length];
	}

	Num2persian(input: string | number) {
		if (typeof input === 'number') input = String(input);

		// Clear Non digits
		input = input.replace(/[^0-9.-]/g, '');
		let isNegative = false;
		const floatParse = parseFloat(input);
		// return zero if this isn't a valid number
		if (isNaN(floatParse)) return this.zero;

		// check for zero
		if (floatParse === 0) return this.zero;

		// set negative flag:true if the number is less than 0
		if (floatParse < 0) {
			isNegative = true;
			input = input.replace(/-/g, '');
		}

		// Declare Parts
		let decimalPart = '';
		let integerPart = input;
		const pointIndex = input.indexOf('.');

		// Check for float numbers form string and split Int/Dec
		if (pointIndex > -1) {
			integerPart = input.substring(0, pointIndex);
			decimalPart = input.substring(pointIndex + 1, input.length);
		}

		if (integerPart.length > 66) {
			return 'خارج از محدوده';
		}

		// Split to sections
		const slicedNumber = this.prepareNumber(integerPart);
		// Fetch Sections and convert
		const out = [];
		for (let i = 0; i < slicedNumber.length; i += 1) {
			const converted = this.tinyNumToWord(slicedNumber[i]);
			if (converted !== '') {
				out.push(converted + this.letters[4][slicedNumber.length - (i + 1)]);
			}
		}

		// Convert Decimal part
		if (decimalPart.length > 0) {
			decimalPart = this.convertDecimalPart(decimalPart);
		}

		return (isNegative ? this.negative : '') + out.join(this.delimiter) + decimalPart;
	}
}

const Num2Persian = (num: number | string) => {
	return new NumToPersian().Num2persian(num);
};

export default Num2Persian;
