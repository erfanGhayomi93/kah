import { appQueryClient } from '@/components/common/Registry/QueryClientRegistry';
import { useQueryClient } from '@tanstack/react-query';

const useAppQueryClient = () => {
	return useQueryClient(appQueryClient);
};

export default useAppQueryClient;
