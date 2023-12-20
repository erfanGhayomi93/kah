import { useEffect, useMemo, useState } from 'react';

interface CountdownProps {
	seconds: number;
	onFinished: () => void;
}

const Countdown = ({ seconds, onFinished }: CountdownProps) => {
	const [remainingSeconds, setRemainingSeconds] = useState(seconds);

	useEffect(() => {
		const interval = setInterval(() => {
			setRemainingSeconds((prevSecs) => {
				const nextRemainingSeconds = prevSecs - 1;
				if (nextRemainingSeconds < 0) {
					clearInterval(interval);
					onFinished();
					return prevSecs;
				}

				return nextRemainingSeconds;
			});
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	const formatter = useMemo(() => {
		const minutes = String(Math.max(0, Math.floor(remainingSeconds / 60))).padStart(2, '0');
		const seconds = String(Math.max(0, Math.floor(remainingSeconds % 60))).padStart(2, '0');

		return `${minutes}:${seconds}`;
	}, [remainingSeconds]);

	return formatter;
};

export default Countdown;
