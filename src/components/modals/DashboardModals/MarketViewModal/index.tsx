import MarketView from '@/components/pages/Dashboard/components/MarketView';
import { useAppDispatch } from '@/features/hooks';
import { setMarketViewModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 1000px;
	min-height: 615px;
	display: flex;
	flex-direction: column;
`;

interface IMarketViewModalProps extends IBaseModalConfiguration {}

const MarketViewModal = forwardRef<HTMLDivElement, IMarketViewModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onclose = () => {
		dispatch(setMarketViewModal(null));
	};

	return (
		<Modal
			onClose={onclose}
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			{...props}
			ref={ref}
		>
			<Div className='bg-white'>
				<MarketView isModal />
			</Div>
		</Modal>
	);
});

export default MarketViewModal;
