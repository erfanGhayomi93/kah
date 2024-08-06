import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { createMutation } from '@/utils/helpers';
import brokerAxios from '../brokerAxios';
import { store } from '../inject-store';

export const useFreezeMutation = createMutation<boolean, { symbolISIN: string[]; type: 'freeze' | 'unFreeze' }>({
	mutationFn: async ({ symbolISIN, type }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return false;

		const response = await brokerAxios.post<ServerResponse<boolean>>(url.FreezeCreateFreeze, {
			symbolISIN,
			type,
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});
