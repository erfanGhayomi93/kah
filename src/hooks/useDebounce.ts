import { useEffect, useRef } from 'react';

interface IDebounceOutput {
	setDebounce: (cb: () => void, milliseconds: number) => void
	clearDebounce: () => void
}

const useDebounce = (): IDebounceOutput => {
	const timer = useRef<null | NodeJS.Timeout>(null);

	const clearDebounce = () => {
		if (typeof timer.current !== 'number') return;

		clearTimeout(timer.current);
		timer.current = null;
	};

	const setDebounce = (cb: () => void, milliseconds: number) => {
		clearDebounce();

		timer.current = setTimeout(cb, milliseconds);
	};

	useEffect(() => clearDebounce, []);

	return { setDebounce, clearDebounce };
};

export default useDebounce;
