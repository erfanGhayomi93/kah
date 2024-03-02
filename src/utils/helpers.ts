import { onUnauthorize } from '@/api/axios';
import dayjs from '@/libs/dayjs';
import { useQuery, type QueryClient, type QueryKey, type UndefinedInitialDataOptions } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { getClientId } from './cookie';

export const sepNumbers = (num: string | undefined): string => {
	if (num === undefined || isNaN(Number(num))) return '−';

	const formattedIntegerPart: string = num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

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

export const getNestedValue = (obj: NestedObject, key: string) => {
	const keys = key.split('.');

	return keys.reduce<NestedObject | string | number | undefined>((acc, currentKey) => {
		return acc && typeof acc === 'object' && currentKey in acc ? acc[currentKey] : undefined;
	}, obj);
};

export const negativeValueFormatter = (value: number) => {
	if (value >= 0) return String(value);
	return `(${value})`;
};

export const minusFormatter = (value: number) => {
	if (value >= 0) return String(value);
	return `−${Math.abs(value)}`;
};

export const rialToToman = (value: number) => {
	return (value / 10).toFixed(0);
};

export const convertStringToInteger = (inputString: string): string => inputString.replace(/[^\d]/g, '');

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

export const decodeBrokerUrls = (data: Broker.URL[]) => {
	const urls: IBrokerUrls = {
		todayOrders: data[0].url,
		todayTrades: data[1].url,
		drafts: data[2].url,
		createOrder: data[3].url,
		ordersCount: data[4].url,
		openOrders: data[5].url,
		commission: data[6].url,
		userInformation: data[7].url,
		userRemain: data[8].url,
		userStatus: data[9].url,
	};

	return urls;
};

export const divide = (arg1: number, arg2: number) => {
	if (arg1 === arg2) return 1;

	if (arg2 === 0) return 0;

	return arg1 / arg2;
};
