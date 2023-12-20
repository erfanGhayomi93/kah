import { useState } from 'react';

const useInputs = <T extends object>(props: T) => {
	const [inputs, setInputs] = useState(props);

	const setFieldValue = <K extends keyof T>(name: K, value: T[K]) => {
		setInputs((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const setFieldsValue = (props: Partial<T>) => {
		setInputs((prev) => ({
			...prev,
			...props,
		}));
	};

	return { inputs, setFieldValue, setFieldsValue };
};

export default useInputs;
