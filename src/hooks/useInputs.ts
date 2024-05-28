import { useEffect, useState } from 'react';

const useInputs = <T extends object>(props: T, keepUpdate?: boolean) => {
	const [inputs, setInputs] = useState(props);

	const setFieldValue = <K extends keyof T>(name: K, value: T[K]) => {
		setInputs((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const setFieldsValue = (arg: Partial<T> | ((state: T) => Partial<T>)) => {
		if (typeof arg === 'function') {
			setInputs((prev) => ({
				...prev,
				...arg(prev),
			}));
		} else {
			setInputs((prev) => ({
				...prev,
				...arg,
			}));
		}
	};

	useEffect(() => {
		if (keepUpdate) setInputs(props);
	}, [keepUpdate, JSON.stringify(props)]);

	return { inputs, setFieldValue, setFieldsValue, setInputs };
};

export default useInputs;
