import { brokerQueryClient } from '@/components/common/Registry/QueryClientRegistry';
import { useQueryClient } from '@tanstack/react-query';

const useBrokerQueryClient = () => {
	return useQueryClient(brokerQueryClient);
};

export default useBrokerQueryClient;
