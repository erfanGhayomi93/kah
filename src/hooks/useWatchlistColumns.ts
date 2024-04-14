import { WatchlistColumnsContext } from '@/contexts/WatchlistColumnsContext';
import { useContext } from 'react';

const useWatchlistColumns = () => {
	const wcContext = useContext(WatchlistColumnsContext);

	return wcContext;
};

export default useWatchlistColumns;
