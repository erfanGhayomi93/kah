import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { getBrokerClientId } from '@/utils/cookie';
import { createMutation } from '@/utils/helpers';
import brokerAxios from '../brokerAxios';
import { store } from '../inject-store';

export const useLogoutMutation = createMutation({
	mutationFn: async () => {
		const url = getBrokerURLs(store.getState());
		if (!url) return false;

		const [token] = getBrokerClientId();
		await brokerAxios.get<ServerResponse<Symbol.Info>>(url.Logout, {
			params: { token },
		});
	},
});
