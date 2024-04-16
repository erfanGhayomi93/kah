import { useAppDispatch } from '@/features/hooks';
import { setBuySellModal } from '@/features/slices/modalSlice';
import { type IBuySellModal } from '@/features/slices/modalSlice.interfaces';

const useTradingFeatures = () => {
	const dispatch = useAppDispatch();

	const addBuySellModal = (props: IBuySellModal) => {
		dispatch(setBuySellModal(props));
	};

	return { addBuySellModal };
};

export default useTradingFeatures;
