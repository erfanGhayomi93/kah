import MarketState from '@/components/pages/Dashboard/components/MarketState';
import { useAppDispatch } from '@/features/hooks';
import { setMarketStateModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 800px;
	min-height: 600px;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

interface IMarketStateModalProps extends IBaseModalConfiguration {}

const MarketStateModal = forwardRef<HTMLDivElement, IMarketStateModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onClose = () => {
		dispatch(setMarketStateModal(null));
	};

	return (
		<Modal
			onClose={onClose}
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			{...props}
			ref={ref}
		>
			<Div className='darkBlue:bg-gray-50 bg-white dark:bg-gray-50'>
				<MarketState isModal />
			</Div>
		</Modal>
	);
});

export default MarketStateModal;
