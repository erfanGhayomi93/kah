import { useEffect, useMemo, useState } from 'react';

interface CountdownProps {
	seconds: number;
	onFinished: () => void;
}

const Countdown = ({ seconds, onFinished }: CountdownProps) => {
	const [remainingSeconds, setRemainingSeconds] = useState(seconds);

	const formatter = useMemo(() => {
		const m = String(Math.max(0, Math.floor(remainingSeconds / 60))).padStart(2, '0');
		const s = String(Math.max(0, Math.floor(remainingSeconds % 60))).padStart(2, '0');

		return `${m}:${s}`;
	}, [remainingSeconds]);

	useEffect(() => {
		if (!remainingSeconds && remainingSeconds < seconds) setRemainingSeconds(seconds);

		if (seconds <= 0) return;

		const interval = setInterval(() => {
			setRemainingSeconds((prevSecs) => {
				const nextRemainingSeconds = prevSecs - 1;

				if (nextRemainingSeconds < 0) {
					clearInterval(interval);
					if (prevSecs) onFinished();
					return prevSecs;
				}

				return nextRemainingSeconds;
			});
		}, 1000);
	}, [seconds]);

	return formatter;
};

export default Countdown;
