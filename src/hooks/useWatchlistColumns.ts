import { useDefaultOptionSymbolColumnsQuery, useOptionSymbolColumnsQuery } from '@/api/queries/optionQueries';
import { useUserInformationQuery } from '@/api/queries/userQueries';
import { useAppSelector } from '@/features/hooks';
import { getIsLoggedIn } from '@/features/slices/userSlice';

const useWatchlistColumns = () => {
	const isLoggedIn = useAppSelector(getIsLoggedIn);

	const { isFetching: isFetchingUserData } = useUserInformationQuery({
		queryKey: ['userInformationQuery'],
	});

	const optionSymbolColumns = useOptionSymbolColumnsQuery({
		queryKey: ['optionSymbolColumnsQuery'],
		enabled: !isFetchingUserData && isLoggedIn,
	});

	const defaultWatchlistColumns = useDefaultOptionSymbolColumnsQuery({
		queryKey: ['defaultOptionSymbolColumnsQuery'],
		enabled: !isFetchingUserData && !isLoggedIn,
	});

	return isLoggedIn ? optionSymbolColumns : defaultWatchlistColumns;
};

export default useWatchlistColumns;
