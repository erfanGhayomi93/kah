'use client';

import { useTimeQuery } from '@/api/queries/commonQueries';
import type Subscribe from '@/classes/Subscribe';
import { subscribeDatetime } from '@/utils/subscriptions';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { createContext, useEffect, useRef, useState } from 'react';

const defaultParams = {
	timestamp: new Date().getTime(),
	setTimestamp: () => undefined,
};

interface ClockContextType {
	timestamp: number;
	setTimestamp: (v: number) => void;
}
export const ClockContext = createContext<ClockContextType>(defaultParams);

const ClockProvider = ({ children }: { children: React.ReactElement }) => {
	const timer = useRef<NodeJS.Timer | null>(null);

	const subscribe = useRef<Subscribe | null>(null);

	const [timestamp, setTimestamp] = useState(defaultParams.timestamp);

	const { data: serverDateTime } = useTimeQuery({
		queryKey: ['useTimeQuery'],
		refetchOnWindowFocus: true,
	});

	const onTimeUpdate = (updateInfo: ItemUpdate) => {
		try {
			updateInfo.forEachChangedField((_a, _b, value) => {
				if (value) {
					const ts = new Date(value).getTime();
					setTimestamp(ts);
				}
			});
		} catch (e) {
			//
		}
	};

	const stop = () => {
		try {
			if (typeof timer.current === 'number') clearInterval(timer.current);
			subscribe.current?.unsubscribe();
		} catch (e) {
			//
		}
	};

	const start = () => {
		try {
			timer.current = setInterval(() => setTimestamp((t) => t + 1000), 1000);

			subscribe.current = subscribeDatetime().addEventListener('onItemUpdate', onTimeUpdate).start();
		} catch (e) {
			//
		}
	};

	const restart = () => {
		stop();
		start();
	};

	useEffect(() => {
		if (!serverDateTime) return;

		setTimestamp(new Date(serverDateTime).getTime());
		restart();
	}, [serverDateTime]);

	return <ClockContext.Provider value={{ timestamp, setTimestamp }}>{children}</ClockContext.Provider>;
};

export default ClockProvider;
