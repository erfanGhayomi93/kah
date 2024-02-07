import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

export const useUserInformationQuery = createQuery<User.IUserInformation, ['userInformationQuery']>({
	staleTime: 36e5,
	queryKey: ['userInformationQuery'],
	queryFn: async ({ signal }) => {
		const response = await axios.get<ServerResponse<User.IUserInformation>>(
			routes.authentication.GetUserInformation,
			{
				signal,
			},
		);
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});
