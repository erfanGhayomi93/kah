import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

export const useAllSavedTemplatesQuery = createQuery<Saturn.Template[], ['useAllSavedTemplates']>({
	staleTime: 36e5,
	queryKey: ['useAllSavedTemplates'],
	queryFn: async ({ signal }) => {
		try {
			const response = await axios.get<ServerResponse<Saturn.Template[]>>(routes.saturn.GetAllSaturns, {
				signal,
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});

export const useSavedTemplateQuery = createQuery<Saturn.Template, ['useSavedTemplate', number]>({
	staleTime: 36e5,
	queryKey: ['useSavedTemplate', -1],
	queryFn: async ({ signal, queryKey }) => {
		const [, templateId] = queryKey;

		const response = await axios.get<ServerResponse<Saturn.Template>>(routes.saturn.GetSaturn, {
			signal,
			params: { id: templateId },
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useActiveTemplateQuery = createQuery<Saturn.Template, ['useActiveTemplate']>({
	staleTime: 36e5,
	queryKey: ['useActiveTemplate'],
	queryFn: async ({ signal, queryKey }) => {
		const response = await axios.get<ServerResponse<Saturn.Template>>(routes.saturn.GetActive, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});
