import { useAppDispatch } from '@/features/hooks';
import { setBuySellModal, type IBuySellModal } from '@/features/slices/modalSlice';

const useTradingFeatures = () => {
	const dispatch = useAppDispatch();

	const addBuySellModal = (props: IBuySellModal) => {
		dispatch(setBuySellModal(props));
	};

	return { addBuySellModal };
};

export default useTradingFeatures;
