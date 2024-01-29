import dayjs from '@/libs/dayjs';
import { useQuery, type QueryClient, type QueryKey, type UndefinedInitialDataOptions } from '@tanstack/react-query';
import { type AxiosError } from 'axios';

export const sepNumbers = (num: string | undefined): string => {
	if (num === undefined || isNaN(Number(num))) return '−';

	let result = num;

	try {
		const objRegex = /(-?[0-9]+)([0-9]{3})/;
		while (objRegex.test(result)) {
			result = result.replace(objRegex, '$1,$2');
		}
	} catch (e) {
		//
	}

	return result;
};

export const numFormatter = (num: number, formatNavigateNumber = true) => {
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
};

export const getDirection = (lang: string): 'rtl' | 'ltr' => {
	if (['fa', 'ar', 'arc', 'ks', 'ku', 'ps'].includes(lang)) return 'rtl';
	return 'ltr';
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
