import Localstorage from '@/classes/Localstorage';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

const useLocalstorage = <T extends unknown>(name: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] => {
	const [value, setValue] = useState<T>(Localstorage.get<T>(name, defaultValue));

	useEffect(() => {
		Localstorage.set(name, value, false);
	}, [value]);

	useEffect(() => {
		Localstorage.addEventListener(name, (value) => {
			try {
				if (value === null) return;

				const formattedValue = JSON.parse(value);
				setValue(formattedValue);
			} catch (e) {
				//
			}
		});
	}, []);

	return [value, setValue];
};

export default useLocalstorage;
