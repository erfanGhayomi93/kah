import { ClockContext } from '@/contexts/ClockContext';
import { useContext } from 'react';

const useServerDatetime = () => {
	const { timestamp, setTimestamp } = useContext(ClockContext);

	return { timestamp, setTimestamp };
};

export default useServerDatetime;
