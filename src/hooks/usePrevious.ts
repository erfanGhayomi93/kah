import { useLayoutEffect, useState } from 'react';

const usePrevious = <T>(value: T) => {
	const [state, setState] = useState<{ current: T; previous: T | null }>({
		current: value,
		previous: null,
	});

	useLayoutEffect(() => {
		setState({
			current: value,
			previous: state.current,
		});

		setTimeout(() => {
			setState((prev) => ({
				current: prev.current,
				previous: prev.current,
			}));
		}, 2500);
	}, [value]);

	return state.previous;
};

export default usePrevious;
