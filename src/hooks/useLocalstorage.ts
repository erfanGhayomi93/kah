import Localstorage from '@/classes/Localstorage';
import { useLayoutEffect, useState, type Dispatch, type SetStateAction } from 'react';

const useLocalstorage = <T extends unknown>(name: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] => {
	const [value, setValue] = useState<T>(Localstorage.get<T>(name, defaultValue));

	useLayoutEffect(() => {
		Localstorage.set(name, value, false);
	}, [value]);

	useLayoutEffect(() => {
		Localstorage.addEventListener(name, (value) => {
			try {
				if (value === null) return;

				const formattedValue = JSON.parse(value) as T;
				setValue(formattedValue);
			} catch (e) {
				if (typeof defaultValue === 'string') setValue(value as T);
			}
		});
	}, []);

	return [value, setValue];
};

export default useLocalstorage;
