import { useState } from 'react';

type ErrorValueType = null | ['error' | 'warning', string];

const useErrors = <T extends Record<string, ErrorValueType>>(props: T) => {
	const [errors, setErrors] = useState(props);

	const setFieldError = (name: keyof T, value: ErrorValueType) => {
		setErrors((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const setFieldsError = (props: Partial<T>) => {
		setErrors((prev) => ({
			...prev,
			...props,
		}));
	};

	return { errors, setFieldError, setFieldsError };
};

export default useErrors;
