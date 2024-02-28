import { type Subscribe } from '@/classes/Subscribe';
import { useLayoutEffect, useRef } from 'react';

const useSubscription = () => {
	const subscription = useRef<Subscribe | null>(null);

	const subscribe = (sub: Subscribe) => {
		try {
			unsubscribe();
			sub.start();
		} catch (e) {
			//
		}
	};

	const unsubscribe = () => {
		try {
			subscription.current?.unsubscribe();
		} catch (e) {
			//
		}
	};

	useLayoutEffect(() => () => unsubscribe(), []);

	return { subscribe, unsubscribe };
};

export default useSubscription;
