import { useAppSelector } from '@/features/hooks';
import { getOrderBasket } from '@/features/slices/userSlice';
import dynamic from 'next/dynamic';

const Basket = dynamic(() => import('./Basket'), {
	ssr: false,
});

const OrderBasket = () => {
	const orderBasket = useAppSelector(getOrderBasket);

	if (orderBasket.length === 0) return null;
	return <Basket />;
};

export default OrderBasket;
