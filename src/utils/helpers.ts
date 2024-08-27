import { logoutUser } from '@/api/axios';
import { appQueryClient, brokerQueryClient } from '@/components/common/Registry/QueryClientRegistry';
import { getDateMilliseconds } from '@/constants';
import { DateAsMillisecond } from '@/constants/enums';
import dayjs from '@/libs/dayjs';
import {
	useMutation,
	useQuery,
	type QueryClient,
	type QueryKey,
	type UndefinedInitialDataOptions,
	type UseMutationOptions,
} from '@tanstack/react-query';
import { tippy } from '@tippyjs/react';
import { type AxiosError } from 'axios';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getBrokerClientId, getClientId } from './cookie';

export const sepNumbers = (num: string | undefined): string => {
	if (num === undefined || isNaN(Number(num))) return '−';

	const formattedIntegerPart: string = num?.replace?.(/\B(?=(\d{3})+(?!\d))/g, ',');

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

export const persianNumFormatter = (num: number, formatNavigateNumber = true) => {
	try {
		if (isNaN(num)) return '−';

		const suffixes = ['', ' هزار', ' میلیون', ' میلیارد', ' همت'];
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

export const dayAsJalali = (v: dayjs.ConfigType) => {
	return dayjs(v, {
		// @ts-expect-error: dayjs does not recognize jalali
		jalali: true,
	});
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

export const createBrokerQuery = <TQueryFnData = unknown, TQueryKey extends QueryKey = QueryKey, TError = AxiosError>(
	initialOptions: UndefinedInitialDataOptions<TQueryFnData, TError, TQueryFnData, TQueryKey>,
) => {
	return (options: Partial<typeof initialOptions>) => useQuery({ ...initialOptions, ...options }, brokerQueryClient);
};

export const createQuery = <TQueryFnData = unknown, TQueryKey extends QueryKey = QueryKey, TError = AxiosError>(
	initialOptions: UndefinedInitialDataOptions<TQueryFnData, TError, TQueryFnData, TQueryKey>,
) => {
	return (options: Partial<typeof initialOptions>) => useQuery({ ...initialOptions, ...options }, appQueryClient);
};

export const createMutation = <TData = unknown, TVariables = void, TError = AxiosError, TContext = unknown>(
	initialOptions: UseMutationOptions<TData, TError, TVariables, TContext>,
	queryClient?: QueryClient,
) => {
	return (options?: Partial<typeof initialOptions>) => useMutation({ ...initialOptions, ...options }, queryClient);
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
					if (statusCode === 401) logoutUser();
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

export const downloadFileQueryParams = (
	url: string,
	name: string,
	params: string | string[][] | Record<string, string> | URLSearchParams | undefined = undefined,
) =>
	new Promise<void>((resolve, reject) => {
		try {
			const headers = new Headers();
			headers.append('Accept', 'application/json, text/plain, */*');
			headers.append('Accept-Language', 'en-US,en;q=0.9,fa;q=0.8');

			const clientId = getBrokerClientId()[0];
			if (clientId) headers.append('Authorization', 'Bearer ' + clientId);

			fetch(url + '?' + new URLSearchParams(params).toString(), {
				method: 'GET',
				headers,
				redirect: 'follow',
			})
				.then((response) => {
					try {
						const statusCode = Number(response.status);
						if (statusCode === 401) logoutUser();
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
		} catch (e) {
			//
		}
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

export const decodeBrokerUrls = (data: Broker.URL): IBrokerUrls => {
	return data;
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
	const timezoneOffsetInMinutes = d.getTimezoneOffset() * 6e4;
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

	const d = dayjs(v ?? new Date()).calendar('jalali');
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

export const convertSymbolWatchlistToSymbolBasket = (symbol: Option.Root, side: TBsSides): IOptionStrategy => {
	const { optionWatchlistData, symbolInfo } = symbol;
	const optionType = symbolInfo.optionType === 'Call' ? 'call' : 'put';

	return {
		id: uuidv4(),
		type: 'option',
		symbol: {
			symbolTitle: symbolInfo.symbolTitle,
			symbolISIN: symbolInfo.symbolISIN,
			optionType,
			requiredMargin: symbol.optionWatchlistData.requiredMargin,
			contractSize: symbolInfo.contractSize,
			settlementDay: new Date(symbolInfo.contractEndDate),
			baseSymbolPrice: optionWatchlistData.baseSymbolPrice,
			strikePrice: symbolInfo.strikePrice,
			historicalVolatility: optionWatchlistData.historicalVolatility,
		},
		price: optionWatchlistData.premium || 1,
		quantity: 1,
		side,
		marketUnit: symbolInfo.marketUnit ?? '',
	};
};

export const setHours = (d: Date, hour: number, minutes: number, seconds = 0, milliseconds = 0) => {
	d.setHours(hour, minutes, seconds, milliseconds);
	return d;
};

// DatePicker Helper
export const isAfter = (date1: Date, date2 = new Date()): boolean => {
	const year1 = date1.getFullYear();
	const month1 = date1.getMonth();
	const day1 = date1.getDate();

	const year2 = date2.getFullYear();
	const month2 = date2.getMonth();
	const day2 = date2.getDate();

	return year1 > year2 || (year1 === year2 && (month1 > month2 || (month1 === month2 && day1 > day2)));
};

export const isBefore = (date1: Date, date2 = new Date()): boolean => {
	const year1 = date1.getFullYear();
	const month1 = date1.getMonth();
	const day1 = date1.getDate();

	const year2 = date2.getFullYear();
	const month2 = date2.getMonth();
	const day2 = date2.getDate();

	return year1 < year2 || (year1 === year2 && (month1 < month2 || (month1 === month2 && day1 < day2)));
};

export const isSameOrAfter = (date1: Date, date2 = new Date()): boolean => {
	const year1 = date1.getFullYear();
	const month1 = date1.getMonth();
	const day1 = date1.getDate();

	const year2 = date2.getFullYear();
	const month2 = date2.getMonth();
	const day2 = date2.getDate();

	return year1 > year2 || (year1 === year2 && (month1 > month2 || (month1 === month2 && day1 >= day2)));
};

export const isSameOrBefore = (date1: Date, date2 = new Date()): boolean => {
	const year1 = date1.getFullYear();
	const month1 = date1.getMonth();
	const day1 = date1.getDate();

	const year2 = date2.getFullYear();
	const month2 = date2.getMonth();
	const day2 = date2.getDate();

	return year1 < year2 || (year1 === year2 && (month1 < month2 || (month1 === month2 && day1 <= day2)));
};

export const dojiAnalyzer = <T>(data: T[], callback: (item: T) => number): TDojiType => {
	const maxL = data.length - 1;

	const firstItem = callback(data[0]);
	const lastItem = callback(data[maxL]);

	if (lastItem > firstItem) return 'Bullish';
	if (lastItem < firstItem) return 'Bearish';
	return 'Neutral';
};

export const getColorBasedOnPercent = (v: number, reverse = false) => {
	if (v === 0) return 'text-gray-700';

	if ((v < 0 && reverse) || (v > 0 && !reverse)) return 'text-success-100';

	return 'text-error-100';
};

export const versionParser = (value: string) => {
	const version = value.replace(/[^0-9.]/gi, '');
	const [major, minor, patch] = version.split('.');

	return Number(major) * 100 + Number(minor ? Number(minor) * 10 : 0) + Number(patch ? Number(patch) * 1 : 0);
};

export const today = (): number => {
	let d: number | Date = new Date();

	d.setHours(23, 59, 59, 0);
	d = d.getTime();

	return d;
};

export const calculateDateRange = (
	date: Exclude<TDateRange, 'dates.custom'>,
	reverse = false,
): Record<'fromDate' | 'toDate', number> => {
	if (reverse) {
		const fromDate = today();

		let toDate: Date | number = new Date(fromDate);
		toDate.setHours(0, 0, 0, 0);
		toDate = toDate.getTime();

		if (date === 'dates.day') toDate += getDateMilliseconds.Day;
		if (date === 'dates.week') toDate += getDateMilliseconds.Week;
		if (date === 'dates.month') toDate += getDateMilliseconds.Month;
		if (date === 'dates.year') toDate += getDateMilliseconds.Year;

		return { fromDate, toDate };
	}

	const toDate = today();

	let fromDate: Date | number = new Date(toDate);
	fromDate.setHours(0, 0, 0, 0);
	fromDate = fromDate.getTime();

	if (date === 'dates.day') fromDate -= getDateMilliseconds.Day;
	if (date === 'dates.week') fromDate -= getDateMilliseconds.Week;
	if (date === 'dates.month') fromDate -= getDateMilliseconds.Month;
	if (date === 'dates.year') fromDate -= getDateMilliseconds.Year;

	return { fromDate, toDate };
};

export const toggleArrayElement = <T>(array: T[], element: T): T[] => {
	const index = array.indexOf(element);

	if (index === -1) return [...array, element];
	else return array.filter((item) => item !== element);
};

export const toPascalCase = (str: string) =>
	(str.match(/[a-zA-Z0-9]+/g) || []).map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join('');

export const textToHtml = (htmlAsText: string) => {
	const div = document.createElement('div');
	div.innerHTML = htmlAsText;

	return div.children;
};

export const sanitizeHTML = (html: string) => {
	const doc = new DOMParser().parseFromString(html, 'text/html');

	const scriptsAndStyles = doc.querySelectorAll('script, style');
	scriptsAndStyles.forEach((node) => node?.parentNode?.removeChild(node));

	const elements = doc.body.getElementsByTagName('*');
	for (let i = 0; i < elements.length; i++) {
		const attributes = elements[i].attributes;
		for (let j = attributes.length - 1; j >= 0; j--) {
			if (attributes[j].name.startsWith('on')) {
				elements[i].removeAttribute(attributes[j].name);
			}
		}
	}

	return doc.body.innerHTML;
};

export const comparePathname = (p1: string, p2: string): boolean => {
	const pattern = /^\/?|\/?$/gi;
	return p1.replace(pattern, '') === p2.replace(pattern, '');
};

export const addTooltip = (content: string, children: HTMLElement) => {
	const tooltip = tippy(children);
	tooltip.setContent(String(content));

	return tooltip;
};

export const getDeviceColorSchema = (): 'dark' | 'light' => {
	try {
		const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		return isDark ? 'dark' : 'light';
	} catch (e) {
		return 'light';
	}
};

export const except = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
	const result = JSON.parse(JSON.stringify(obj)) as T;

	keys.forEach((key) => {
		delete result[key];
	});

	return result;
};

export const isSymbolISINValid = (v: string): boolean => {
	const rgx = /^(IR[A-Z]{1,2}[0-9]{1,2}[A-Z]{2,5}[0-9]{2,5})$/gi;
	return rgx.test(v);
};

export const getTickPositions = (seriesData: TSeriesData, maxLength = 9): number[] => {
	const tickPositions: number[] = [];

	try {
		const length = Math.min(seriesData.length + 1, maxLength);
		const d = seriesData.length / (length - 1);

		if (d > 0) {
			for (let i = 1; i <= length; i++) {
				const n = Math.max(0, Math.round((i - 1) * d) - 1);
				if (seriesData[n]) tickPositions.push(seriesData[n].x);
			}
		}
	} catch (e) {
		//
	}

	return tickPositions;
};
