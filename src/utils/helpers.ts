import Num2Persian from '@/classes/NumToPersian';
import dayjs from '@/libs/dayjs';
import { useQuery, type QueryClient, type QueryKey, type UndefinedInitialDataOptions } from '@tanstack/react-query';
import { type AxiosError } from 'axios';

export const sepNumbers = (num: string): string => {
	let result = num;
	if (Number(result) < 1e3) return result;

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

export const numberFormatter = (value: number) => {
	try {
		if (value < 0) return `−${sepNumbers(String(Math.abs(value)))}`;
		return sepNumbers(String(value));
	} catch (e) {
		return value;
	}
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

export const tomanToRial = (v: number): string => {
	if (isNaN(v) || v <= 0) return '';

	const [integerPart, decimalPart] = String(v / 10).split('.');

	const toman = `${Num2Persian(integerPart)} تومان`;
	if (!decimalPart) return toman;

	const rial = `${Num2Persian(decimalPart)} ریال`;
	if (!integerPart) return rial;

	return `${toman} و ${rial}`;
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
