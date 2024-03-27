import { useAppDispatch } from '@/features/hooks';
import { toggleBuySellModal, type IBuySellModal } from '@/features/slices/modalSlice';

const useTradingFeatures = () => {
	const dispatch = useAppDispatch();

	const addBuySellModal = (props: IBuySellModal) => {
		dispatch(toggleBuySellModal(props));
	};

	return { addBuySellModal };
};

export default useTradingFeatures;
