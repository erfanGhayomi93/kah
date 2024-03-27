import { useDebounce } from '@/hooks';
import { useLayoutEffect, useState } from 'react';

interface AnimatePresenceProps {
	isEnable: boolean;
	duration?: number;
	children?: (isEnabled: boolean) => React.ReactNode;
}

const AnimatePresence = ({ isEnable, duration = 250, children }: AnimatePresenceProps) => {
	const { setDebounce, clearDebounce } = useDebounce();

	const [isRender, setIsRender] = useState(isEnable);

	useLayoutEffect(() => {
		clearDebounce();

		if (isEnable) {
			setIsRender(true);
			return;
		}

		setDebounce(() => {
			setIsRender(false);
		}, duration);
	}, [isEnable]);

	if (!isRender) return null;
	return children?.(isEnable);
};

export default AnimatePresence;
