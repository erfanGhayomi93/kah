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
