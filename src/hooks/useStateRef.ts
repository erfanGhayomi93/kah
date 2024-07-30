import { useEffect, useRef } from 'react';

const useStateWithRef = <T>(state: T) => {
	const stateRef = useRef(state);

	useEffect(() => {
		stateRef.current = state;
	}, [state]);

	return stateRef;
};

export default useStateWithRef;
