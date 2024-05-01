import { onUnauthorize } from '@/api/axios';
import { DateAsMillisecond } from '@/constants/enums';
import dayjs from '@/libs/dayjs';
import { useQuery, type QueryClient, type QueryKey, type UndefinedInitialDataOptions } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getClientId } from './cookie';

export const sepNumbers = (num: string | undefined): string => {
	if (num === undefined || isNaN(Number(num))) return '−';

	const formattedIntegerPart: string = num?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	return formattedIntegerPart;
};

export const numFormatter = (num: number, formatNavigateNumber = true) => {
	try {
		if (isNaN(num)) return '−';

		const suffixes = ['', ' K', ' M', ' B', ' T'];
		const divisor = 1e3;
		let index = 0;
		let isNegative = false;

		if (num < 0) {
			isNegative = true;
			num = Math.abs(num);
		}

		while (num >= divisor && index < suffixes.length - 1) {
			num /= divisor;
			index++;
		}

		let formattedNum = num.toFixed(3).replace(/\.?0+$/, '') + suffixes[index];

		if (isNegative) {
			formattedNum = formatNavigateNumber ? `(${formattedNum})` : `-${formattedNum}`;
		}

		return `\u200e${formattedNum}`;
	} catch (e) {
		return '−';
	}
};

export const getDirection = (lang: string): 'rtl' | 'ltr' => {
	if (['fa', 'ar', 'arc', 'ks', 'ku', 'ps'].includes(lang)) return 'rtl';
	return 'ltr';
};

export const openNewTab = (pathname: string, search = '') => {
	const url = new URL(location.href);
	url.pathname = pathname;
	url.search = search;

	if (window && url) window.open(decodeURIComponent(url.href), '_blank');
};

export const returnIfIsNaN = <T extends unknown>(value: number, defaultValue: T) => {
	if (isNaN(value)) return defaultValue;
	return value;
};

export const isBetween = (min: number, value: number, max: number): boolean => value >= min && value <= max;

export const getRndInteger = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const negativeValueFormatter = (value: number) => {
	if (value >= 0) return String(value);
	return `(${value})`;
};

export const rialToToman = (value: number) => {
	return (value / 10).toFixed(0);
};

export const convertStringToInteger = (inputString: string): string =>
	toEnglishNumber(inputString).replace(/[^\d]/g, '');

export const convertStringToDecimal = (inputString: string): string => inputString.replace(/[^0-9.]/g, '');

export const ifIsNaN = (input: number, defaultValue: number): number => {
	if (isNaN(input)) return defaultValue;
	return input;
};

export const ifIsInfinity = (input: number, defaultValue: number): number => {
	if (isNaN(input) || input === Infinity) return defaultValue;
	return input;
};

export const getDateAsJalali = (value?: string | number | Date | null) => {
	return dayjs(value).calendar('jalali').format('YYYY/MM/DD');
};

export const passwordValidation = (password: string) => {
	let score = 0;
	let lowercase = false;
	let uppercase = false;
	let numbers = false;
	let length = false;
	let char = false;

	if (password.length >= 8) {
		length = true;
		score++;
	}

	if (/[a-z]/.test(password)) {
		lowercase = true;
		score++;
	}

	if (/[A-Z]/.test(password)) {
		uppercase = true;
		score++;
	}

	if (/[0-9]/.test(password)) {
		numbers = true;
		score++;
	}

	if (/\W/.test(password)) {
		char = true;
		score++;
	}

	return { score, lowercase, uppercase, numbers, length, char };
};

export const base64encode = (value: string) => {
	return btoa(value);
};

export const base64decode = (value: string) => {
	try {
		return atob(value);
	} catch (e) {
		return null;
	}
};

export const createQuery = <TQueryFnData = unknown, TQueryKey extends QueryKey = QueryKey, TError = AxiosError>(
	initialOptions: UndefinedInitialDataOptions<TQueryFnData, TError, TQueryFnData, TQueryKey>,
	queryClient?: QueryClient,
) => {
	return (options: Partial<typeof initialOptions>) => useQuery({ ...initialOptions, ...options }, queryClient);
};

export const URLIsValid = (url: string) => {
	try {
		const regex = new RegExp(url, 'ig');
		if (window) return regex.test(window.location.host);
	} catch (e) {
		return false;
	}
};

export const findStringIn = (term: string, value: string): [string, string, string] => {
	try {
		const letterIndex = value.indexOf(term);
		const termIndex = letterIndex + term.length;

		const matches = value.slice(letterIndex, termIndex);
		const nomatch1 = value.slice(0, letterIndex);
		const nomatch2 = value.slice(termIndex, value.length);

		return [nomatch1, matches, nomatch2];
	} catch (e) {
		return [value, '', ''];
	}
};

export const downloadFile = (url: string, name: string, params: Record<string, unknown>) =>
	new Promise<void>((resolve, reject) => {
		const headers = new Headers();
		headers.append('Accept', 'application/json, text/plain, */*');
		headers.append('Accept-Language', 'en-US,en;q=0.9,fa;q=0.8');

		const clientId = getClientId();
		if (clientId) headers.append('Authorization', 'Bearer ' + clientId);

		const serialize = paramsSerializer(params);
		if (serialize) url += `?${serialize}`;

		fetch(url, {
			method: 'GET',
			headers,
			redirect: 'follow',
		})
			.then((response) => {
				try {
					const statusCode = Number(response.status);
					if (statusCode === 401) onUnauthorize();
				} catch (e) {
					//
				}

				return response.blob();
			})
			.then((blobResponse) => {
				const a = document.createElement('a');
				a.download = name;
				a.href = URL.createObjectURL(blobResponse);

				a.click();
				resolve();
			})
			.catch(reject);
	});

export const paramsSerializer = (params: Record<string, unknown>) => {
	const queryParams: string[] = [];
	const keys = Object.keys(params);

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const value = params[key];

		if (Array.isArray(value)) {
			for (let j = 0; j < value.length; j++) {
				queryParams.push(`${key}=${value[j]}`);
			}
		} else queryParams.push(`${key}=${params[key]}`);
	}

	return queryParams.join('&');
};

export const decodeBrokerUrls = (data: Broker.URL[]): IBrokerUrls => {
	const urls: IBrokerUrls = {
		todayOrders: data[0].url,
		executedOrders: data[1].url,
		drafts: data[2].url,
		createOrder: data[3].url,
		ordersCount: data[4].url,
		openOrders: data[5].url,
		commission: data[6].url,
		userInformation: data[7].url,
		userRemain: data[8].url,
		userStatus: data[9].url,
		optionOrders: data[10].url,
		createDraft: data[11].url,
		deleteDraft: data[12].url,
		deleteOrder: data[13].url,
		groupDeleteDraft: data[14].url,
		groupDeleteOrder: data[15].url,
		updateDraft: data[16].url,
		updateOrder: data[17].url,
		createRequestEPaymentApi: data[18].url,
		getRemain: data[19].url,
		completeRequestReceipt: data[20].url,
		getListBrokerBankAccount: data[21].url,
		getReceipt: data[22].url,
		customerTurnOverRemain: data[23].url,
		getWithFilterReceipt: data[24].url,
		getFilteredEPaymentApi: data[25].url,
		getFilteredPayment: data[26].url,
	};

	return urls;
};

export const divide = (arg1: number, arg2: number) => {
	if (arg1 === arg2) return 1;
	if (arg2 === 0) return 0;
	if (isNaN(arg1) || isNaN(arg2)) return 0;

	return arg1 / arg2;
};

export const cn = (...args: ClassesValue[]) => {
	return twMerge(clsx(args));
};

export const isEnglish = (str: string): boolean => {
	return Boolean(str.match(/^[a-zA-Z\s0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/gi));
};

export const englishToPersian = (str: string): string => {
	if (!isEnglish(str)) return str;
	str = str.toLowerCase();

	const keyboards = {
		q: 'ض',
		w: 'ص',
		e: 'ث',
		r: 'ق',
		t: 'ف',
		y: 'غ',
		u: 'ع',
		i: 'ه',
		o: 'خ',
		p: 'ح',
		'[': 'ج',
		']': 'چ',
		a: 'ش',
		s: 'س',
		d: 'ی',
		f: 'ب',
		g: 'ل',
		h: 'ا',
		j: 'ت',
		k: 'ن',
		l: 'م',
		';': 'ک',
		// eslint-disable-next-line quotes
		"'": 'گ',
		z: 'ظ',
		x: 'ط',
		c: 'ز',
		v: 'ر',
		b: 'ذ',
		n: 'د',
		m: 'ئ',
		',': 'و',
		'\\': 'پ',
	};

	let modifiedWord = '';
	for (let i = 0; i < str.length; i++) {
		const letter = str[i];

		modifiedWord += keyboards[letter as keyof typeof keyboards] ?? letter;
	}

	return modifiedWord;
};

export const toISOStringWithoutChangeTime = (d: Date): string => {
	const timezoneOffsetInMinutes = d.getTimezoneOffset() * 60000;
	const utcDate = new Date(d.getTime() - timezoneOffsetInMinutes);

	const isoString = utcDate.toISOString();
	return isoString;
};

export const dateConverter = (v: 'Week' | 'Month' | 'Year') => {
	let timestamp = Date.now();

	if (v === 'Week') timestamp += DateAsMillisecond.Week;
	else if (v === 'Month') timestamp += DateAsMillisecond.Month;
	else if (v === 'Year') timestamp += DateAsMillisecond.Year;

	return timestamp;
};

export const toEnglishNumber = (str: string): string => {
	const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
	const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

	for (let i = 0; i < 10; i++) {
		str = str.replace(persianNumbers[i], String(i)).replace(arabicNumbers[i], String(i));
	}

	return str;
};

export const days = (ct: number, tt: number) => {
	const now = Date.now();
	const target = new Date(tt).getTime();
	const days = Math.floor((target - now) / 864e5);

	return days;
};

export const dateFormatter = (v: string | number, format: 'date' | 'time' | 'datetime' = 'datetime') => {
	const formats: Record<typeof format, string> = {
		time: 'HH:mm',
		date: 'YYYY/MM/DD',
		datetime: 'YYYY/MM/DD HH:mm',
	};

	const d = dayjs(v).calendar('jalali');
	if (d.isValid()) return d.format(formats[format]);

	return '−';
};

export const getCodalLink = (symbolTitle?: string): string => {
	return symbolTitle
		? `http://www.codal.ir/ReportList.aspx?search&Symbol=${encodeURI(symbolTitle)}`
		: 'http://www.codal.ir';
};

export const getTSELink = (insCode?: number | string): string => {
	return insCode
		? `http://tsetmc.com/Loader.aspx?ParTree=151311&i=${encodeURI(String(insCode))}`
		: 'http://tsetmc.com';
};

export const copyNumberToClipboard = (e: React.ClipboardEvent<HTMLElement>, value: number) => {
	e.preventDefault();

	try {
		e.clipboardData.setData('text/plain', String(value));
	} catch (e) {
		//
	}
};

export const uuidv4 = () => {
	return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
		(+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16),
	);
};

export const toFixed = (v: number, l = 3, round = true) => {
	if (isNaN(v) || v === Infinity) return '−';

	if (l === 0) return sepNumbers(v.toFixed(0));

	const value = v.toFixed(l);
	const [integer, decimal] = value.split('.');

	const decimalAsNumber = Number(`.${decimal}`) * 1;
	if (!decimalAsNumber) return sepNumbers(integer);

	return sepNumbers(integer) + '.' + (round ? String(decimalAsNumber).slice(2) : decimal);
};

export const xor = <T>(arrays1: T[], arrays2: T[], callback: (a: T, b: T) => boolean) => {
	const l = arrays2.length;
	const result: T[] = [];

	for (let i = 0; i < l; i++) {
		const index = arrays1.findIndex((item) => callback(item, arrays2[i]));
		if (index === -1) result.push(arrays2[i]);
	}

	return result;
};

export const convertSymbolWatchlistToSymbolBasket = (symbol: Option.Root, side: TBsSides): OrderBasket.Order => ({
	id: uuidv4(),
	symbol,
	contractSize: symbol.symbolInfo.contractSize,
	price: symbol.optionWatchlistData.premium || 1,
	quantity: 1,
	settlementDay: symbol.symbolInfo.contractEndDate,
	type: symbol.symbolInfo.optionType === 'Call' ? 'call' : 'put',
	strikePrice: symbol.symbolInfo.strikePrice,
	side,
	commission: {
		value: 0,
	},
	requiredMargin: {
		value: symbol.optionWatchlistData.requiredMargin,
	},
});

export const setHours = (d: Date, hour: number, minutes: number, seconds = 0, milliseconds = 0) => {
	d.setHours(hour, minutes, seconds, milliseconds);
	return d;
};
