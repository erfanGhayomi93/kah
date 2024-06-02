import PriceChangesWatchlist from '@/components/pages/Dashboard/components/PriceChangesWatchlist';
import { useAppDispatch } from '@/features/hooks';
import { setPriceChangeWatchlistModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 800px;
	// min-height: 500px;
	display: flex;
	flex-direction: column;
`;

interface IPriceChangeWatchlistModalProps extends IBaseModalConfiguration {}

const ChangePriceWatchlistModal = forwardRef<HTMLDivElement, IPriceChangeWatchlistModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onclose = () => {
		dispatch(setPriceChangeWatchlistModal(null));
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
				<PriceChangesWatchlist isModal />
			</Div>
		</Modal>
	);
});

export default ChangePriceWatchlistModal;
