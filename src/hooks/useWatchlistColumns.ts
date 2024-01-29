import { useDefaultOptionSymbolColumnsQuery, useOptionSymbolColumnsQuery } from '@/api/queries/optionQueries';
import { useUserInformationQuery } from '@/api/queries/userQueries';

const useWatchlistColumns = () => {
	const { data, isFetching: isFetchingUserData } = useUserInformationQuery({
		queryKey: ['userInformationQuery'],
	});

	const optionSymbolColumns = useOptionSymbolColumnsQuery({
		queryKey: ['optionSymbolColumnsQuery'],
		enabled: !isFetchingUserData && Boolean(data),
	});

	const defaultWatchlistColumns = useDefaultOptionSymbolColumnsQuery({
		queryKey: ['defaultOptionSymbolColumnsQuery'],
		enabled: !isFetchingUserData && !data,
	});

	return data ? optionSymbolColumns : defaultWatchlistColumns;
};

export default useWatchlistColumns;
